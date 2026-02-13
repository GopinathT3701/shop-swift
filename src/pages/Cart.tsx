import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h2 className="mb-2 font-display text-2xl font-bold text-foreground">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                exit={{ opacity: 0, x: -100 }}
                className="mb-4 flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-lg object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground transition-colors hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Order Summary</h3>
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="mb-6 border-t border-border pt-4">
            <div className="flex justify-between text-base font-bold text-foreground">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
