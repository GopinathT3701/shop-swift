import express from "express";
import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("No token");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Invalid token");
    req.user = user;
    next();
  });
};

// Add Address
router.post("/", verifyToken, (req, res) => {
  const {
    name,
    mobile,
    country,
    address1,
    address2,
    state,
    city,
    zipcode,
    address_type,
    is_default
  } = req.body;

  const q = `
    INSERT INTO addresses 
    (user_id,name,mobile,country,address1,address2,state,city,zipcode,address_type,is_default)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    q,
    [
      req.user.id,
      name,
      mobile,
      country,
      address1,
      address2,
      state,
      city,
      zipcode,
      address_type,
      is_default
    ],
    (err) => {
      if (err) return res.status(400).json(err);
      res.json({ message: "Address added successfully" });
    }
  );
});

// Get User Addresses
router.get("/", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM addresses WHERE user_id=?",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(400).json(err);
      res.json(result);
    }
  );
});

// Update Address
router.put("/:id", verifyToken, (req, res) => {
  const addressId = req.params.id;

  const {
    name,
    mobile,
    country,
    address1,
    address2,
    state,
    city,
    zipcode,
    address_type,
    is_default
  } = req.body;

  const q = `
    UPDATE addresses SET
    name=?,
    mobile=?,
    country=?,
    address1=?,
    address2=?,
    state=?,
    city=?,
    zipcode=?,
    address_type=?,
    is_default=?
    WHERE id=? AND user_id=?
  `;

  db.query(
    q,
    [
      name,
      mobile,
      country,
      address1,
      address2,
      state,
      city,
      zipcode,
      address_type,
      is_default,
      addressId,
      req.user.id
    ],
    (err, result) => {
      if (err) return res.status(400).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Address not found" });
      }

      res.json({ message: "Address updated successfully" });
    }
  );
});


export default router;
