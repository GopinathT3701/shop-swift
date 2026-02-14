import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { db } from "../config/db.js";
import  verifyToken  from "../middleware/verifyToken.js";

const router = express.Router();

/* ================================
   Razorpay Instance
================================ */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ======================================
   1️⃣ CREATE RAZORPAY ORDER
====================================== */
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

/* ======================================
   2️⃣ VERIFY PAYMENT SIGNATURE
====================================== */
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      total,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ Payment is genuine
    // Insert Order
    db.query(
      "INSERT INTO orders (user_id, total, status, payment_id) VALUES (?, ?, ?, ?)",
      [req.user.id, total, "Paid", razorpay_payment_id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).json(err);
        }

        const orderId = result.insertId;

        // Prepare order_items
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
            if (err2) {
              console.error(err2);
              return res.status(400).json(err2);
            }

            res.json({
              success: true,
              message: "Payment verified & order placed successfully",
            });
          }
        );
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

export default router;
