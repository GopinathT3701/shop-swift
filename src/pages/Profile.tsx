import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Package, LogOut } from "lucide-react";
import AddAddressModal from "@/components/AddAddressModal";
import EditProfileModal from "@/components/EditProfileModal";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const fetchProfile = async () => {
    try {
      const userRes = await axios.get(
        "http://localhost:5000/api/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderRes = await axios.get(
        "http://localhost:5000/api/orders/Order-Details",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addressRes = await axios.get(
        "http://localhost:5000/api/address",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(userRes.data);
      setOrders(orderRes.data);
      setAddresses(addressRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, []);

  const defaultAddress = addresses.find((a) => a.is_default);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-8">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">
        My Profile
      </h1>

      <div className="grid gap-6 md:grid-cols-3">

        {/* USER CARD */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-4">
            {user?.profile_pic ? (
              <img
                src={user.profile_pic}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {user?.name?.[0]}
              </div>
            )}
          </div>

          <h2 className="text-lg font-semibold text-foreground">
            {user?.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            {user?.email}
          </p>

          <button
            onClick={() => setShowEdit(true)}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 text-sm text-red-500 hover:underline"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {/* ADDRESS CARD */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Shipping Address
            </h3>
          </div>

          {defaultAddress ? (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{defaultAddress.name}</p>
              <p>{defaultAddress.mobile}</p>
              <p>{defaultAddress.address1}</p>
              <p>{defaultAddress.city}, {defaultAddress.state}</p>
              <p>{defaultAddress.zipcode}</p>
              <p>{defaultAddress.country}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No address added
            </p>
          )}

          <button
            onClick={() => {
              setSelectedAddress(defaultAddress || null);
              setShowModal(true);
            }}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            {defaultAddress ? "Edit Address" : "Add Address"}
          </button>
        </div>

        {/* ORDERS CARD */}
        <div
          onClick={() => setShowOrders(!showOrders)}
          className="cursor-pointer rounded-xl border border-border bg-card p-6 hover:shadow-lg transition"
        >
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Orders
            </h3>
          </div>

          <p className="text-3xl font-bold text-foreground">
            {orders.length}
          </p>

          <p className="text-sm text-muted-foreground">
            Total orders placed
          </p>
        </div>
      </div>

      {/* ORDERS LIST */}
      {showOrders && (
        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">My Orders</h2>

          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No orders found
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order.id)}
                  className="cursor-pointer flex items-center justify-between border-b border-border pb-3 hover:bg-accent p-2 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{order.total}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADDRESS MODAL */}
      {showModal && (
        <AddAddressModal
          address={selectedAddress}
          onClose={() => {
            setShowModal(false);
            setSelectedAddress(null);
          }}
          onSaved={fetchProfile}
        />
      )}

      {/* EDIT PROFILE MODAL */}
      {showEdit && (
        <EditProfileModal
          currentName={user?.name}
          currentPic={user?.profile_pic}
          onClose={() => setShowEdit(false)}
          onSaved={fetchProfile}
        />
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Profile;
