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

    // 3️⃣ Fetch email
    const [userRows] = await db.promise().query(
      `SELECT email FROM users WHERE id=?`,
      [userId]
    );

    if (userRows.length > 0) {
      const userEmail = userRows[0].email;

      await sendEmail(
        userEmail,
        `Order #${orderId} Confirmed 🛒`,
        `
        <h2>🎉 Order Confirmed!</h2>
        <p><b>Order ID:</b> ${orderId}</p>
        <p><b>Total:</b> ₹${total}</p>
        <p><b>Status:</b> ${status}</p>
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

  db.query(
    `SELECT * FROM orders WHERE id=? AND user_id=?`,
    [orderId, req.user.id],
    (err, orderResult) => {
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
    }
  );
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
