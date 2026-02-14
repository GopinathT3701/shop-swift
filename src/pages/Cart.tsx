import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      // 1️⃣ Create Razorpay Order from backend
      const { data } = await axios.post(
  "http://localhost:5000/api/payment/create-order",
  { amount: totalPrice },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      if (!(window as any).Razorpay) {
        toast.error("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: "rzp_test_SFxIn9vseSSiih",
        amount: data.amount,
        currency: "INR",
        name: "ShopVibe",
        description: "Order Payment",
        order_id: data.id,

        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#6366f1",
        },

       handler: async function (response: any) {
  try {

    await axios.post(
      "http://localhost:5000/api/payment/verify",
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,

        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),

        total: totalPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Payment Verified & Order Placed");

    items.forEach((item) =>
      removeFromCart(item.product.id)
    );

    navigate("/profile");

  } catch (err) {
    toast.error("Payment verification failed");
  }
},

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Empty cart UI
  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
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
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">
        Shopping Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                className="mb-4 flex gap-4 rounded-xl border border-border bg-card p-4"
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
                    <p className="text-xs text-muted-foreground">
                      {item.product.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ₹ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Order Summary
          </h3>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹ {totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-6 w-full rounded-full bg-primary py-3 text-white disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
