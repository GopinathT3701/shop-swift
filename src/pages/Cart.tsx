import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

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
                    <p className="text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
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

          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span className="font-bold">
              ₹ {totalPrice.toFixed(2)}
            </span>
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
