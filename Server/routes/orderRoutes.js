import express from "express";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();


// =====================================================
// 🟢 PLACE ORDER (COD + Razorpay Support)
// =====================================================
router.post("/", verifyToken, (req, res) => {
  const {
    items,
    total,
    address_id,
    payment_method,
    payment_id
  } = req.body;

  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }

  if (!address_id) {
    return res.status(400).json({ message: "Address required" });
  }

  const status =
    payment_method === "COD" ? "Pending" : "Paid";

  db.query(
    `INSERT INTO orders 
     (user_id, total, status, address_id, payment_method, payment_id) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      total,
      status,
      address_id,
      payment_method,
      payment_id || null,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const orderId = result.insertId;

      const values = items.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
      ]);

      db.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price) 
         VALUES ?`,
        [values],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({
            message: "Order placed successfully",
            orderId,
          });
        }
      );
    }
  );
});


// =====================================================
// 🟢 GET MY ORDERS (Pagination)
// =====================================================
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


// =====================================================
// 🟢 GET SINGLE ORDER WITH ADDRESS
// =====================================================
router.get("/:id", verifyToken, (req, res) => {
  const orderId = req.params.id;

  const orderQuery = `
    SELECT o.*, 
           a.name, a.address1, a.city, a.state, a.zipcode
    FROM orders o
    LEFT JOIN addresses a ON o.address_id = a.id
    WHERE o.id = ? AND o.user_id = ?
  `;

  db.query(orderQuery, [orderId, req.user.id], (err, orderResult) => {
    if (err) return res.status(500).json(err);

    if (orderResult.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult[0];

    db.query(
      `SELECT oi.*, p.name, p.image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId],
      (err2, itemsResult) => {
        if (err2) return res.status(500).json(err2);

        res.json({
          order,
          items: itemsResult,
        });
      }
    );
  });
});


// =====================================================
// 🟢 CANCEL ORDER
// =====================================================
router.put("/:id/cancel", verifyToken, (req, res) => {
  const orderId = req.params.id;

  db.query(
    `UPDATE orders 
     SET status='Cancelled' 
     WHERE id=? AND user_id=?`,
    [orderId, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ message: "Order cancelled successfully" });
    }
  );
});

export default router;
