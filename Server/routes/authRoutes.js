import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// =================================================
// 🟢 REGISTER
// =================================================
router.post("/register", async (req, res) => {
  const { full_name, email, phone, password, agree } = req.body;

  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!agree) {
    return res.status(400).json({ message: "You must accept terms" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, phone, password, agree) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, phone, hashedPassword, agree],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already exists" });
          }
          return res.status(500).json(err);
        }

        res.json({ message: "User registered successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// =================================================
// 🟢 LOGIN
// =================================================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0)
      return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, result[0].password);

    if (!valid)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: result[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        phone: result[0].phone,
      },
    });
  });
});

// =================================================
// 🟢 GET PROFILE
// =================================================
router.get("/me", verifyToken, (req, res) => {
  db.query(
    "SELECT id, name, email, phone, profile_pic FROM users WHERE id=?",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(400).json(err);

      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      res.json(result[0]);
    }
  );
});

// =================================================
// 🟢 UPDATE PROFILE
// =================================================
router.put("/update-profile", verifyToken, (req, res) => {
  const { name, phone, profile_pic } = req.body;

  db.query(
    "UPDATE users SET name=?, phone=?, profile_pic=? WHERE id=?",
    [name, phone, profile_pic, req.user.id],
    (err) => {
      if (err) return res.status(400).json(err);
      res.json({ message: "Profile updated successfully" });
    }
  );
});

export default router;
