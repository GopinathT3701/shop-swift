import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

export default router;
