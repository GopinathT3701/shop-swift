import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, removeFromCart } = useCart();
  const token = localStorage.getItem("token");

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [loading, setLoading] = useState(false);

  // ✅ SHIPPING LOGIC
  const shippingCost = totalPrice >= 499 ? 0 : 49;
  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/address", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAddresses(res.data);
      })
      .catch(() => {
        toast.error("Failed to load addresses");
      });
  }, []);

  // ================= COD ORDER =================
  const placeCODOrder = async () => {
    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total: finalTotal,
          shipping: shippingCost,
          address_id: selectedAddress.id,
          payment_method: "COD",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order Placed (Cash on Delivery)");
      items.forEach((item) => removeFromCart(item.product.id));
      navigate("/profile");
    } catch {
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= RAZORPAY =================
  const placeRazorpayOrder = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: finalTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_SFxIn9vseSSiih",
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        handler: async function (response: any) {
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
              total: finalTotal,
              shipping: shippingCost,
              address_id: selectedAddress.id,
              payment_method: "Razorpay",
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          toast.success("Payment Successful");
          items.forEach((item) => removeFromCart(item.product.id));
          navigate("/profile");
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Select delivery address");
      return;
    }

    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (paymentMethod === "COD") {
      placeCODOrder();
    } else {
      placeRazorpayOrder();
    }
  };

  return (
    <div className="container mx-auto py-10 grid lg:grid-cols-3 gap-10">

      {/* LEFT SECTION */}
      <div className="lg:col-span-2 space-y-8">

        {/* ADDRESS */}
        <div className="border rounded-xl p-6">
          <h2 className="font-bold mb-4">1️⃣ Delivery Address</h2>

          {addresses.length === 0 && (
            <div>
              <p>No address found.</p>
              <button
                onClick={() => navigate("/profile")}
                className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
              >
                Add Address
              </button>
            </div>
          )}

          {addresses.map((addr) => (
  <label
    key={addr.id}
    className={`flex items-start gap-4 border p-4 mb-3 rounded-lg cursor-pointer transition ${
      selectedAddress?.id === addr.id
        ? "border-blue-500 bg-blue-50"
        : "border-gray-300"
    }`}
  >
    {/* Radio Button */}
    <input
      type="radio"
      name="address"
      checked={selectedAddress?.id === addr.id}
      onChange={() => setSelectedAddress(addr)}
      className="mt-1"
    />

    {/* Address Content */}
    <div>
      <p className="font-semibold">{addr.name}</p>
      <p className="text-sm text-gray-700">{addr.address1}</p>
      <p className="text-sm text-gray-700">
        {addr.city}, {addr.state}
      </p>
    </div>
  </label>
))}

        </div>

        {/* PRODUCTS */}
        <div className="border rounded-xl p-6">
          <h2 className="font-bold mb-4">2️⃣ Product Details</h2>

          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between mb-2">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>
                ₹ {(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* PAYMENT */}
        <div className="border rounded-xl p-6">
          <h2 className="font-bold mb-4">3️⃣ Payment Method</h2>

          <label className="block mb-2">
            <input
              type="radio"
              checked={paymentMethod === "Razorpay"}
              onChange={() => setPaymentMethod("Razorpay")}
            />{" "}
            Razorpay
          </label>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />{" "}
            Cash on Delivery
          </label>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="border rounded-xl p-6 h-fit">
        <h3 className="font-bold mb-4">Order Summary</h3>

        {totalPrice >= 499 && (
          <p className="text-green-600 text-sm mb-2">
            🎉 You have unlocked Free Shipping!
          </p>
        )}

        {totalPrice < 499 && (
          <p className="text-sm mb-2 text-gray-600">
            Add ₹ {(499 - totalPrice).toFixed(2)} more to get Free Shipping

          </p>
        )}

        <div className="flex justify-between">
          <span>Cart</span>
          <span>₹ {totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-semibold">Free</span>
            ) : (
              `₹ ${shippingCost}`
            )}
          </span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹ {finalTotal.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="mt-6 w-full bg-orange-400 text-white py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
