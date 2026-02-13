import { User, MapPin, Package, LogOut } from "lucide-react";

const Profile = () => {
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    joined: "January 2026",
    address: "123 Main St, New York, NY 10001",
  };

  const mockOrders = [
    { id: "#ORD-001", date: "Feb 10, 2026", total: 299.99, status: "Delivered" },
    { id: "#ORD-002", date: "Feb 5, 2026", total: 189.00, status: "Shipped" },
    { id: "#ORD-003", date: "Jan 28, 2026", total: 79.99, status: "Processing" },
  ];

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">My Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {mockUser.name[0]}
          </div>
          <h2 className="text-lg font-semibold text-foreground">{mockUser.name}</h2>
          <p className="text-sm text-muted-foreground">{mockUser.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">Member since {mockUser.joined}</p>
        </div>

        {/* Address */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Shipping Address</h3>
          </div>
          <p className="text-sm text-muted-foreground">{mockUser.address}</p>
          <button className="mt-4 text-sm font-medium text-primary hover:underline">Edit Address</button>
        </div>

        {/* Quick Stats */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Orders</h3>
          </div>
          <p className="text-3xl font-bold text-foreground">{mockOrders.length}</p>
          <p className="text-sm text-muted-foreground">Total orders placed</p>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Order History</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{order.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-accent text-accent-foreground"
                        : order.status === "Shipped"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
