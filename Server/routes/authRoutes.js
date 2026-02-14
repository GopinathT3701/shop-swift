import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";



const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, hashedPassword],
    (err) => {
      if (err) return res.status(400).json(err);
      res.json({ message: "User registered successfully" });
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (result.length === 0)
      return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, result[0].password);
    if (!valid)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token, user: result[0] });
  });
});



router.get("/me", verifyToken, (req, res) => {
  db.query(
    "SELECT id, name, email, profile_pic FROM users WHERE id=?",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(400).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(result[0]);
    }
  );
});



router.put("/update-profile", verifyToken, (req, res) => {
  const { name, profile_pic } = req.body;

  db.query(
    "UPDATE users SET name=?, profile_pic=? WHERE id=?",
    [name, profile_pic, req.user.id],
    (err) => {
      if (err) return res.status(400).json(err);
      res.json({ message: "Profile updated successfully" });
    }
  );
});




export default router;
