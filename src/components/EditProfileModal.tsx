import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Props {
  currentName: string;
  currentPhone?: string;
  currentPic?: string;
  onClose: () => void;
  onSaved: () => void;
}

const EditProfileModal = ({
  currentName,
  currentPhone,
  currentPic,
  onClose,
  onSaved,
}: Props) => {
  const token = localStorage.getItem("token");

  const [name, setName] = useState(currentName || "");
  const [phone, setPhone] = useState(currentPhone || "");
  const [profilePic, setProfilePic] = useState(currentPic || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        {
          name,
          phone,
          profile_pic: profilePic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">

        <h2 className="text-xl font-semibold mb-6">
          Edit Profile
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Enter phone number"
          />
        </div>

        {/* Profile Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Profile Image URL
          </label>
          <input
            type="text"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;
