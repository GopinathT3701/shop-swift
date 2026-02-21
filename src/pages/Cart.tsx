import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Cart = () => {
  const navigate = useNavigate();

  const {
    items,
    removeFromCart,
    totalPrice,
    updateQuantity,
  } = useCart();

  const [loading] = useState(false);

  // ✅ Shipping Logic
  const shippingCost = totalPrice >= 499 ? 0 : 49;
  const finalTotal = totalPrice + shippingCost;
  const remainingForFreeShipping = Math.max(0, 499 - totalPrice);

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  // 🟢 Empty Cart UI
  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h2 className="mb-2 text-2xl font-bold">
          Your cart is empty
        </h2>
        <Link
          to="/products"
          className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">
        Shopping Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">

        {/* 🟢 Cart Items */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                className="mb-4 flex gap-4 rounded-xl border p-4"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />

                <div className="flex flex-1 justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {item.product.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {item.product.category}
                    </p>

                    {/* ✅ Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>

                      <span className="font-semibold text-lg">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ₹ {(item.product.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() =>
                        removeFromCart(item.product.id)
                      }
                      className="text-sm text-red-500 mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 🟢 Order Summary */}
        <div className="h-fit rounded-xl border p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Order Summary
          </h3>

          {totalPrice >= 499 && (
            <p className="text-green-600 text-sm mb-3">
              🎉 You have unlocked Free Shipping!
            </p>
          )}

          {totalPrice < 499 && (
            <p className="text-sm mb-3 text-gray-600">
              Add ₹ {remainingForFreeShipping.toFixed(2)} more to get Free Shipping
            </p>
          )}

          <div className="flex justify-between mb-2">
            <span>Cart</span>
            <span>₹ {totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>
              {shippingCost === 0 ? (
                <span className="text-green-600 font-semibold">
                  Free
                </span>
              ) : (
                `₹ ${shippingCost}`
              )}
            </span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹ {finalTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 w-full rounded-full bg-primary py-3 text-white"
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
