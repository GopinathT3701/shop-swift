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

  const shippingCost = 50;
  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    axios.get("http://localhost:5000/api/address", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setAddresses(res.data);
    });
  }, []);

  // ================= COD ORDER =================
  const placeCODOrder = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total: finalTotal,
          address_id: selectedAddress.id,
          payment_method: "COD"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order Placed (Cash on Delivery)");
      items.forEach(item => removeFromCart(item.product.id));
      navigate("/profile");

    } catch {
      toast.error("Order failed");
    }
  };

  // ================= RAZORPAY =================
  const placeRazorpayOrder = async () => {
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
            items: items.map(item => ({
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.price
            })),
            total: finalTotal,
            address_id: selectedAddress.id,
            payment_method: "Razorpay",
            payment_id: response.razorpay_payment_id
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Payment Successful");
        items.forEach(item => removeFromCart(item.product.id));
        navigate("/profile");
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Select delivery address");
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

          {addresses.map(addr => (
            <div
              key={addr.id}
              onClick={() => setSelectedAddress(addr)}
              className={`border p-4 mb-3 cursor-pointer ${
                selectedAddress?.id === addr.id
                  ? "border-blue-500 bg-blue-50"
                  : ""
              }`}
            >
              <p>{addr.name}</p>
              <p>{addr.address1}</p>
              <p>{addr.city}, {addr.state}</p>
            </div>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="border rounded-xl p-6">
          <h2 className="font-bold mb-4">2️⃣ Product Details</h2>

          {items.map(item => (
            <div key={item.product.id} className="flex justify-between mb-2">
              <span>{item.product.name}</span>
              <span>₹ {(item.product.price * item.quantity).toFixed(2)}</span>
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
            /> Razorpay
          </label>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            /> Cash on Delivery
          </label>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="border rounded-xl p-6 h-fit">
        <h3 className="font-bold mb-4">Order Summary</h3>

        <div className="flex justify-between">
          <span>Cart</span>
          <span>₹ {totalPrice}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹ {shippingCost}</span>
        </div>

        <hr className="my-4"/>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹ {finalTotal}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
