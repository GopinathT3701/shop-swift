import { useEffect, useState } from "react";
import axios from "axios";

const AccountTab = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="rounded-xl border p-6 bg-card">
      <h2 className="text-lg font-semibold mb-4">Account Info</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
    </div>
  );
};

export default AccountTab;
