import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

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
router.post("/verify", verifyToken, (req, res) => {
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

  db.query(
    "INSERT INTO orders (user_id, total, status, address_id, payment_method, payment_id) VALUES (?, ?, ?, ?, ?, ?)",
    [
      req.user.id,
      total,
      "Paid",
      address_id,
      payment_method,
      payment_id,
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
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
        [values],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({ message: "Order saved successfully" });
        }
      );
    }
  );
});

export default router;
