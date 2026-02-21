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
  const [totalOrders, setTotalOrders] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const userRes = await axios.get(
        "http://localhost:5000/api/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const addressRes = await axios.get(
        "http://localhost:5000/api/address",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(userRes.data);
      setAddresses(addressRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // =========================
  // FETCH ORDERS WITH PAGINATION
  // =========================
  const fetchOrders = async (pageNumber = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/my?page=${pageNumber}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders);
      setTotalOrders(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchProfile();
      fetchOrders(1);
    }
  }, []);

  useEffect(() => {
    if (showOrders) {
      fetchOrders(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

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
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">

        {/* USER CARD */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4 flex items-center gap-4">
            {user?.profile_pic ? (
              <img
                src={user.profile_pic}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                {user?.name?.[0]}
              </div>
            )}
          </div>

          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p><br></br>
          <p className="text-sm text-muted-foreground">{user?.phone}</p>

          <button
            onClick={() => setShowEdit(true)}
            className="mt-3 text-sm text-primary hover:underline"
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
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Shipping Address</h3>
          </div>

          {defaultAddress ? (
            <div className="text-sm space-y-1">
              <p>{defaultAddress.name}</p>
              <p>{defaultAddress.mobile}</p>
              <p>{defaultAddress.address1}</p>
              <p>{defaultAddress.city}, {defaultAddress.state}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No address added</p>
          )}

          <button
            onClick={() => {
              setSelectedAddress(defaultAddress || null);
              setShowModal(true);
            }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            {defaultAddress ? "Edit Address" : "Add Address"}
          </button>
        </div>

        {/* ORDERS CARD */}
        <div
          onClick={() => setShowOrders(!showOrders)}
          className="cursor-pointer rounded-xl border bg-card p-6 hover:shadow-lg transition"
        >
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Orders</h3>
          </div>

          <p className="text-3xl font-bold">{totalOrders}</p>
          <p className="text-sm text-muted-foreground">
            Total orders placed
          </p>
        </div>
      </div>

      {/* ORDERS LIST */}
      {showOrders && (
        <div className="mt-10 rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">My Orders</h2>

          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <>
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order.id)}
                  className="cursor-pointer flex justify-between border-b py-3 hover:bg-accent rounded-lg px-2"
                >
                  <div>
                    <p>Order #{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{order.total}</p>
                    <span
  className={`text-xs px-3 py-1 rounded-full font-medium
    ${
      order.status === "Received"
        ? "bg-yellow-100 text-yellow-700"
        : order.status === "Paid"
        ? "bg-blue-100 text-blue-700"
        : order.status === "Shipped"
        ? "bg-purple-100 text-purple-700"
        : order.status === "Delivered"
        ? "bg-green-100 text-green-700"
        : order.status === "Cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700"
    }
  `}
>
  {order.status}
</span>

                  </div>
                </div>
              ))}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="border px-4 py-2 rounded disabled:opacity-40"
                  >
                    Prev
                  </button>

                  <span>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="border px-4 py-2 rounded disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* MODALS */}
      {showModal && (
        <AddAddressModal
          address={selectedAddress}
          onClose={() => setShowModal(false)}
          onSaved={fetchProfile}
        />
      )}

      {showEdit && (
        <EditProfileModal
  currentName={user?.name}
  currentPhone={user?.phone}
  currentPic={user?.profile_pic}
  onClose={() => setShowEdit(false)}
  onSaved={fetchProfile}
/>
      )}

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
