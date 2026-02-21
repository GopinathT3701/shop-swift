import { useEffect, useState } from "react";
import axios from "axios";
import EditProfileModal from "@/components/EditProfileModal";

const AccountTab = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/auth/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUser(res.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="rounded-xl border p-6 bg-card">
      <h2 className="text-lg font-semibold mb-4">
        Account Info
      </h2>

      <div className="space-y-2 text-sm">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> {user.phone || "Not added"}</p>
      </div>

      <button
        onClick={() => setShowEdit(true)}
        className="mt-4 text-primary text-sm hover:underline"
      >
        Edit Account
      </button>

      {showEdit && (
        <EditProfileModal
          currentName={user.name}
          currentPhone={user.phone}
          currentPic={user.profile_pic}
          onClose={() => setShowEdit(false)}
          onSaved={fetchUser}
        />
      )}
    </div>
  );
};

export default AccountTab;
