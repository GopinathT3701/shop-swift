import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";
import sendEmail from "../utils/sendEmail.js"; 

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Razorpay error" });
  }
});

// Verify & Save Order
router.post("/verify", verifyToken, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    total,
    address_id,
    payment_method,
    payment_id,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    // 1️⃣ Insert Order
    const [orderResult] = await db.promise().query(
      `INSERT INTO orders 
       (user_id, total, status, address_id, payment_method, payment_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        total,
        "Paid",
        address_id,
        payment_method,
        payment_id,
      ]
    );

    const orderId = orderResult.insertId;

    // 2️⃣ Insert Items
    const values = items.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
    ]);

    await db.promise().query(
      `INSERT INTO order_items 
       (order_id, product_id, quantity, price) 
       VALUES ?`,
      [values]
    );

    // 4️⃣ Fetch User Email
    const [userRows] = await db.promise().query(
      `SELECT email FROM users WHERE id=?`,
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.json({ message: "Order saved successfully" });
    }

    const userEmail = userRows[0].email;

    // 5️⃣ Fetch Address
    const [addressRows] = await db.promise().query(
      `SELECT * FROM addresses WHERE id=? AND user_id=?`,
      [address_id, req.user.id]
    );

    const address = addressRows.length > 0 ? addressRows[0] : null;

    // Fetch full order items with product names
const [orderItems] = await db.promise().query(
  `
  SELECT oi.quantity, oi.price, p.name
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  WHERE oi.order_id = ?
  `,
  [orderId]
);


 // 6️⃣ Send Email
    await sendEmail(
      userEmail,
      `Order #${orderId} Confirmed 🛒`,
      `
      <div style="font-family:Arial, sans-serif; background:#f4f6f8; padding:30px;">
        <div style="max-width:700px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">

          <h2 style="color:#2e7d32;">🎉 Payment Successful</h2>
          <p>Thank you for shopping with <strong>Shopvibe</strong>.</p>

          <hr style="margin:20px 0;" />

          <table style="width:100%; font-size:14px;">
            <tr>
              <td><strong>Order ID:</strong></td>
              <td>#${orderId}</td>
            </tr>
            <tr>
              <td><strong>Payment Status:</strong></td>
              <td style="color:#2e7d32;"><strong>Paid</strong></td>
            </tr>
            <tr>
              <td><strong>Total Amount:</strong></td>
              <td>₹${total}</td>
            </tr>
          </table>

          <hr style="margin:20px 0;" />

          <h3>🛍 Ordered Items</h3>
          <table style="width:100%; border-collapse:collapse; border:1px solid #ddd;">
            <thead style="background:#f1f1f1;">
              <tr>
                <th style="padding:8px; border:1px solid #ddd;">Product</th>
                <th style="padding:8px; border:1px solid #ddd;">Qty</th>
                <th style="padding:8px; border:1px solid #ddd;">Price</th>
                <th style="padding:8px; border:1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems
                .map(
                  (item) => `
                  <tr>
                    <td style="padding:8px; border:1px solid #ddd;">${item.name}</td>
                    <td style="padding:8px; border:1px solid #ddd;">${item.quantity}</td>
                    <td style="padding:8px; border:1px solid #ddd;">₹${item.price}</td>
                    <td style="padding:8px; border:1px solid #ddd;">
                      ₹${item.price * item.quantity}
                    </td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>

          <hr style="margin:20px 0;" />

          <h3>📦 Shipping Address</h3>
          <p style="line-height:1.6;">
            ${address?.name || ""}<br/>
            ${address?.address1 || ""}<br/>
            ${address?.city || ""}, ${address?.state || ""} - ${address?.zipcode || ""}
          </p>

          <hr style="margin:20px 0;" />

          <p style="font-size:13px; color:#777;">
            We are preparing your order and will notify you once shipped.
          </p>

        </div>
      </div>
      `
    );

    console.log("✅ Razorpay confirmation mail sent");

    res.json({ message: "Order saved successfully" });

  } catch (error) {
    console.error("Razorpay verify error:", error);
    res.status(500).json({ message: "Order verification failed" });
  }
});
export default router;
