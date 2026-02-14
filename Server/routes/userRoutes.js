import express from "express";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";


const router = express.Router();

// Get user profile
router.get("/me", verifyToken, (req, res) => {
  db.query(
    "SELECT id, name, email, address FROM users WHERE id=?",
    [req.userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

// Update address
router.put("/address", verifyToken, (req, res) => {
  const { address } = req.body;

  db.query(
    "UPDATE users SET address=? WHERE id=?",
    [address, req.userId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Address updated successfully" });
    }
  );
});

export default router;
