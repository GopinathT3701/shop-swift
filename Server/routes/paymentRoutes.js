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

    // 3️⃣ Fetch User Email
    const [userRows] = await db.promise().query(
      `SELECT email FROM users WHERE id=?`,
      [req.user.id]
    );

    if (userRows.length > 0) {
      const userEmail = userRows[0].email;

      await sendEmail(
        userEmail,
        `Order #${orderId} Confirmed 🛒`,
        `
        <h2>🎉 Payment Successful!</h2>
        <p><b>Order ID:</b> ${orderId}</p>
        <p><b>Total:</b> ₹${total}</p>
        <p><b>Status:</b> Paid</p>
        <br/>
        <p>Thank you for shopping with Shopvibe.</p>
        `
      );

      console.log("✅ Razorpay confirm mail sent");
    }

    res.json({ message: "Order saved successfully" });

  } catch (error) {
    console.error("Razorpay verify error:", error);
    res.status(500).json({ message: "Order verification failed" });
  }
});
export default router;
