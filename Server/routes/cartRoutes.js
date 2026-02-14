import express from "express";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";


const router = express.Router();

router.post("/add", verifyToken, (req, res) => {
  const { productId, quantity } = req.body;

  db.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?)",
    [req.userId, productId, quantity],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Added to cart" });
    }
  );
});

router.get("/", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM cart WHERE user_id=?",
    [req.userId],
    (err, data) => {
      res.json(data);
    }
  );
});

export default router;
