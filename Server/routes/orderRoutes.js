import express from "express";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";



const router = express.Router();

// Place Order
router.post("/", verifyToken, (req, res) => {
  const { items, total } = req.body;
  const userId = req.user.id;

  // 1. Create order
  db.query(
    "INSERT INTO orders (user_id, total) VALUES (?, ?)",
    [userId, total],
    (err, result) => {
      if (err) return res.status(400).json(err);

      const orderId = result.insertId;

      // 2. Insert order items
      const values = items.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
        [values],
        (err) => {
          if (err) return res.status(400).json(err);

          res.json({ message: "Order placed successfully" });
        }
      );
    }
  );
});


// Get My Orders
router.get("/Order-Details", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(400).json(err);
      res.json(result);
    }
  );
});



// GET Single Order Details
router.get("/:id", verifyToken, (req, res) => {
  const orderId = req.params.id;

  const orderQuery = `
    SELECT * FROM orders 
    WHERE id = ? AND user_id = ?
  `;

  db.query(orderQuery, [orderId, req.user.id], (err, orderResult) => {
    if (err) return res.status(400).json(err);
    if (orderResult.length === 0)
      return res.status(404).json({ message: "Order not found" });

    const order = orderResult[0];

    const itemsQuery = `
      SELECT oi.*, p.name, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    db.query(itemsQuery, [orderId], (err, itemsResult) => {
      if (err) return res.status(400).json(err);

      res.json({
        order,
        items: itemsResult
      });
    });
  });
});


router.put("/:id/cancel", verifyToken, (req, res) => {
  db.query(
    "UPDATE orders SET status='Cancelled' WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    (err) => {
      if (err) return res.status(400).json(err);
      res.json({ message: "Order cancelled successfully" });
    }
  );
});


export default router;
