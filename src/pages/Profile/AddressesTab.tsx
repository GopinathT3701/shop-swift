import { useEffect, useState } from "react";
import axios from "axios";

const AddressesTab = () => {
  const token = localStorage.getItem("token");
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/address", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAddresses(res.data));
  }, []);

  return (
    <div className="rounded-xl border p-6 bg-card">
      <h2 className="text-lg font-semibold mb-4">My Addresses</h2>

      {addresses.length === 0 && <p>No address added</p>}

      {addresses.map((addr) => (
        <div key={addr.id} className="border-b py-3">
          <p>{addr.name}</p>
          <p className="text-sm text-muted-foreground">
            {addr.address1}, {addr.city}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AddressesTab;
