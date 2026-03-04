import express from "express";
import { db } from "../config/db.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();


// ======================================================
// 🟢 GET USER CART
// ======================================================
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [cart] = await db.promise().query(
      "SELECT id FROM carts WHERE user_id=?",
      [userId]
    );

    if (cart.length === 0) {
      return res.json([]);
    }

    const cartId = cart[0].id;

    const [items] = await db.promise().query(
      `SELECT ci.id,
              ci.quantity,
              p.id AS product_id,
              p.name,
              p.price,
              p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id=?`,
      [cartId]
    );

    res.json(items);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load cart" });
  }
});


// ======================================================
// 🟢 ADD TO CART
// ======================================================
router.post("/add", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // 1️⃣ Get or Create Cart
    let [cart] = await db.promise().query(
      "SELECT * FROM carts WHERE user_id=?",
      [userId]
    );

    let cartId;

    if (cart.length === 0) {
      const [newCart] = await db.promise().query(
        "INSERT INTO carts (user_id) VALUES (?)",
        [userId]
      );
      cartId = newCart.insertId;
    } else {
      cartId = cart[0].id;
    }

    // 2️⃣ Check if product already exists
    const [existing] = await db.promise().query(
      "SELECT * FROM cart_items WHERE cart_id=? AND product_id=?",
      [cartId, product_id]
    );

    if (existing.length > 0) {
      await db.promise().query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id=?",
        [quantity, existing[0].id]
      );
    } else {
      await db.promise().query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cartId, product_id, quantity]
      );
    }

    res.json({ message: "Added to cart" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Add to cart failed" });
  }
});


// ======================================================
// 🟢 UPDATE QUANTITY
// ======================================================
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { item_id, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    await db.promise().query(
      "UPDATE cart_items SET quantity=? WHERE id=?",
      [quantity, item_id]
    );

    res.json({ message: "Quantity updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});


// ======================================================
// 🟢 REMOVE ITEM
// ======================================================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.promise().query(
      "DELETE FROM cart_items WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Item removed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Remove failed" });
  }
});


// ======================================================
// 🟢 CLEAR CART (After Order)
// ======================================================
router.delete("/clear/all", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [cart] = await db.promise().query(
      "SELECT id FROM carts WHERE user_id=?",
      [userId]
    );

    if (cart.length > 0) {
      await db.promise().query(
        "DELETE FROM cart_items WHERE cart_id=?",
        [cart[0].id]
      );
    }

    res.json({ message: "Cart cleared" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Clear failed" });
  }
});

export default router;