import { useEffect, useState } from "react";
import axios from "axios";

const OrdersTab = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

const fetchOrders = async (pageNumber = 1) => {
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
};


  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  return (
    <div className="rounded-xl border p-6 bg-card">
      <h2 className="text-lg font-semibold mb-4">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="flex justify-between border-b py-3"
        >
          <div>
            <p>Order #{order.id}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            ₹{order.total}
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersTab;
