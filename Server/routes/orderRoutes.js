import express from "express";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// =============================
// 🟢 PLACE ORDER (COD)
// =============================
router.post("/", verifyToken, async (req, res) => {
  const { items, total, address_id, payment_method, payment_id } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }

  if (!address_id) {
    return res.status(400).json({ message: "Address required" });
  }

  const status = payment_method === "COD" ? "Received" : "Paid";

  try {
    // 1️⃣ Insert order
    const [orderResult] = await db.promise().query(
      `INSERT INTO orders 
       (user_id, total, status, address_id, payment_method, payment_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, total, status, address_id, payment_method, payment_id || null]
    );

    const orderId = orderResult.insertId;

    // 2️⃣ Insert items
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

   
    // 3️⃣ Fetch user email
    const [userRows] = await db.promise().query(
      `SELECT email FROM users WHERE id=?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.json({ message: "Order placed", orderId });
    }

    const userEmail = userRows[0].email;

    // 4️⃣ Fetch Address
    const [addressRows] = await db.promise().query(
      `SELECT name, mobile, address1, city, state, zipcode 
       FROM addresses 
       WHERE id=? AND user_id=?`,
      [address_id, userId]
    );

    const address = addressRows[0];

    // 5️⃣ Fetch product names for mail
    const productIds = items.map((i) => i.product_id);

    const [products] = await db.promise().query(
      `SELECT id, name FROM products WHERE id IN (?)`,
      [productIds]
    );

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        name: product?.name || "Product",
        quantity: item.quantity,
        price: item.price,
      };
    });

    // 6️⃣ Send Email
    if (payment_method === "COD") {

      await sendEmail(
  userEmail,
  `Order #${orderId} Placed 🛒`,
  `
  <div style="font-family:Arial; background:#f6f6f6; padding:20px;">
    <div style="max-width:650px; margin:auto; background:#fff; padding:25px; border-radius:6px;">

      <h2>🛒 Order Placed Successfully</h2>
      <p>Your order has been placed with <b>Shopvibe</b>.</p>

      <table style="width:100%; margin-top:15px;">
        <tr>
          <td><b>Order ID:</b></td>
          <td>#${orderId}</td>
        </tr>
        <tr>
          <td><b>Payment Method:</b></td>
          <td>Cash on Delivery</td>
        </tr>
        <tr>
          <td><b>Total Amount:</b></td>
          <td>₹${total}</td>
        </tr>
      </table>

      <h3 style="margin-top:20px;">🛍 Ordered Items</h3>

      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#f1f1f1;">
            <th style="padding:8px; border:1px solid #ddd;">Product</th>
            <th style="padding:8px; border:1px solid #ddd;">Qty</th>
            <th style="padding:8px; border:1px solid #ddd;">Price</th>
            <th style="padding:8px; border:1px solid #ddd;">Total</th>
          </tr>
        </thead>

        <tbody>
          ${orderItems.map(
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
          ).join("")}
        </tbody>
      </table>

      <h3 style="margin-top:20px;">📦 Delivery Address</h3>

      <p style="line-height:1.6;">
        <b>${address?.name || ""}</b><br/>
        ${address?.address1 || ""}<br/>
        ${address?.city || ""}, ${address?.state || ""} - ${address?.zipcode || ""}
        📞 ${address?.mobile || ""}<br/>
      </p>

      <p style="font-size:13px;color:#777;margin-top:20px;">
        Please keep cash ready at the time of delivery.
      </p>

    </div>
  </div>
  `
);

      console.log("✅ COD confirm mail sent");
    }

    res.json({
      message: "Order placed successfully",
      orderId,
    });

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Order failed" });
  }
});

// =============================
// 🟢 GET MY ORDERS
// =============================
router.get("/my", verifyToken, (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  db.query(
    `SELECT * FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset],
    (err, orders) => {
      if (err) return res.status(500).json(err);

      db.query(
        `SELECT COUNT(*) as total FROM orders WHERE user_id = ?`,
        [userId],
        (err2, countResult) => {
          if (err2) return res.status(500).json(err2);

          const total = countResult[0].total;
          const totalPages = Math.ceil(total / limit);

          res.json({
            orders,
            total,
            page,
            totalPages,
          });
        }
      );
    }
  );
});

// =============================
// 🟢 GET SINGLE ORDER
// =============================
router.get("/:id", verifyToken, (req, res) => {
  const orderId = req.params.id;

  const orderQuery = `
    SELECT o.*, 
           a.name, 
           a.mobile,
           a.address1, 
           a.city, 
           a.state, 
           a.zipcode
    FROM orders o
    LEFT JOIN addresses a 
      ON o.address_id = a.id 
      AND a.user_id = o.user_id
    WHERE o.id = ? AND o.user_id = ?
  `;

  db.query(orderQuery, [orderId, req.user.id], (err, orderResult) => {
    if (err) return res.status(500).json(err);

    if (orderResult.length === 0)
      return res.status(404).json({ message: "Order not found" });

    db.query(
      `SELECT oi.*, p.name, p.image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId],
      (err2, itemsResult) => {
        if (err2) return res.status(500).json(err2);

        res.json({
          order: orderResult[0],
          items: itemsResult,
        });
      }
    );
  });
});

// =============================
// 🟢 CANCEL ORDER
// =============================
router.put("/:id/cancel", verifyToken, async (req, res) => {
  const orderId = req.params.id;

  try {
    await db.promise().query(
      `UPDATE orders SET status='Cancelled' WHERE id=? AND user_id=?`,
      [orderId, req.user.id]
    );

    const [userRows] = await db.promise().query(
      `SELECT email FROM users WHERE id=?`,
      [req.user.id]
    );

    if (userRows.length > 0) {
      await sendEmail(
        userRows[0].email,
        "Order Cancelled ❌",
        `<h2>Your order has been cancelled</h2><p>Order ID: ${orderId}</p>`
      );

      console.log("✅ Cancel mail sent");
    }

    res.json({ message: "Order cancelled successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cancel failed" });
  }
});

export default router;
