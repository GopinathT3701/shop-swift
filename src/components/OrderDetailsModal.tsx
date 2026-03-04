import { useEffect, useState } from "react";
import axios from "axios";
import { X, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Props {
  orderId: number;
  onClose: () => void;
}

const OrderDetailsModal = ({ orderId, onClose }: Props) => {
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder(res.data.order);
      setItems(res.data.items);
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">Loading...</div>
      </div>
    );
  }

  if (!order) return null;

  // ✅ Safe Calculations
  const subtotal =
    order.subtotal ??
    items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

  const shipping =
    order.shipping ?? (subtotal >= 499 ? 0 : 49);

  const total = order.total ?? subtotal + shipping;

  const steps = ["Received", "Processed", "Shipped", "Delivered"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl bg-white rounded-xl p-8 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* ORDER BASIC INFO */}
        <div className="border rounded-lg p-4 mb-6">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>

        {/* TRACKING */}
        {order.status !== "Cancelled" && (
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Tracking Details</h3>
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={`h-4 w-4 rounded-full ${
                      index <= currentStep
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="text-xs mt-2">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CART ITEMS */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Cart Details</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border rounded-lg p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  ₹ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DELIVERY ADDRESS */}
<div className="border rounded-lg p-4 mb-6">
  <div className="flex items-center gap-2 mb-2">
    <MapPin size={18} />
    <h3 className="font-semibold">Delivery Address</h3>
  </div>

  {order?.address1 ? (
    <>
      <p>{order.name}</p>
      <p>{order.address1}</p>
      <p>{order.city}, {order.state}</p>
      <p>{order.zipcode}</p>
    </>
  ) : (
    <p className="text-gray-500">No address available</p>
  )}
</div>

        {/* PAYMENT DETAILS */}
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={18} />
            <h3 className="font-semibold">Payment Details</h3>
          </div>

          <p><strong>Method:</strong> {order.payment_method || "N/A"}</p>

          {order.payment_method === "Razorpay" && (
            <p><strong>Payment ID:</strong> {order.payment_id}</p>
          )}

          {order.payment_method === "COD" && (
            <p className="text-green-600 font-medium">
              Cash on Delivery
            </p>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Delivery Charges</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600 font-semibold">
                  Free Shipping
                </span>
              ) : (
                `₹ ${shipping.toFixed(2)}`
              )}
            </span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* CANCEL BUTTON */}
        {order.status !== "Delivered" &&
          order.status !== "Cancelled" && (
            <button
              onClick={async () => {
                try {
                  await axios.put(
                    `http://localhost:5000/api/orders/${orderId}/cancel`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  toast.success("Order cancelled");
                  fetchOrder();
                } catch {
                  toast.error("Cancel failed");
                }
              }}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
            >
              Cancel Order
            </button>
          )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;
