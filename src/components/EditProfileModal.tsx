import { useState } from "react";
import axios from "axios";

interface Props {
  currentName: string;
  currentPic: string;
  onClose: () => void;
  onSaved: () => void;
}

const EditProfileModal = ({ currentName, currentPic, onClose, onSaved }: Props) => {
  const [name, setName] = useState(currentName);
  const [profilePic, setProfilePic] = useState(currentPic);

  const token = localStorage.getItem("token");

  const handleSave = async () => {
    await axios.put(
      "http://localhost:5000/api/auth/update-profile",
      { name, profile_pic: profilePic },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    onSaved();
    onClose();
  };

  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Profile Image URL</label>
            <input
              type="text"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              className="mt-1 w-full rounded-lg border border-input px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
