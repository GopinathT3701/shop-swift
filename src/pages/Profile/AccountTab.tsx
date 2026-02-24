import { useEffect, useState } from "react";
import axios from "axios";
import EditProfileModal from "@/components/EditProfileModal";

const AccountTab = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    <>
      <div className="rounded-xl border p-6 bg-card">
        <h2 className="text-lg font-semibold mb-4">
          Account Info
        </h2>

        {/* 🔥 Profile Image */}
        <div className="mb-4 flex items-center gap-4">
          <img
            src={
              user.profile_pic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            onClick={() =>
              setPreviewImage(user.profile_pic)
            }
            className="h-20 w-20 rounded-full object-cover cursor-pointer hover:scale-105 transition"
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">
              Click image to view
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
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

      {/* 🔥 Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default AccountTab;
