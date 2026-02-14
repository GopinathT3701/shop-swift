import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onSaved: () => void;
  address?: any; // if present → edit mode
}

const AddAddressModal = ({ onClose, onSaved, address }: Props) => {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: address?.name || "",
    mobile: address?.mobile || "",
    country: address?.country || "",
    address1: address?.address1 || "",
    address2: address?.address2 || "",
    state: address?.state || "",
    city: address?.city || "",
    zipcode: address?.zipcode || "",
    address_type: address?.address_type || "Home",
    is_default: address?.is_default || false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.mobile || !form.address1 || !form.city) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (address) {
        // EDIT
        await axios.put(
          `http://localhost:5000/api/address/${address.id}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Address updated successfully");
      } else {
        // ADD
        await axios.post(
          "http://localhost:5000/api/address",
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success("Address added successfully");
      }

      onSaved();
      onClose();
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-full max-w-3xl rounded-2xl bg-white p-10 shadow-2xl">

      <h2 className="mb-8 text-3xl font-bold text-gray-800">
        {address ? "Edit Address" : "Add Delivery Address"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Name */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name *"
          className="inputStyle"
        />

        {/* Mobile */}
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile Number *"
          className="inputStyle"
        />

        {/* Country */}
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country *"
          className="inputStyle"
        />

        {/* State */}
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State *"
          className="inputStyle"
        />

        {/* Address 1 */}
        <input
          name="address1"
          value={form.address1}
          onChange={handleChange}
          placeholder="Address Line 1 *"
          className="inputStyle md:col-span-2"
        />

        {/* Address 2 */}
        <input
          name="address2"
          value={form.address2}
          onChange={handleChange}
          placeholder="Address Line 2"
          className="inputStyle md:col-span-2"
        />

        {/* City */}
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City *"
          className="inputStyle"
        />

        {/* Zipcode */}
        <input
          name="zipcode"
          value={form.zipcode}
          onChange={handleChange}
          placeholder="Zipcode *"
          className="inputStyle"
        />

      </div>

      {/* Address Type */}
      <div className="mt-8 flex gap-6">
        {["Home", "Office", "Other"].map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="address_type"
              value={type}
              checked={form.address_type === type}
              onChange={handleChange}
              className="accent-primary"
            />
            {type}
          </label>
        ))}
      </div>

      {/* Default Checkbox */}
      <div className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          name="is_default"
          checked={form.is_default}
          onChange={handleChange}
          className="h-4 w-4 accent-primary"
        />
        <span className="text-sm text-gray-700">
          Set as default address
        </span>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex justify-end gap-4">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-md hover:scale-105 transition"
        >
          Save
        </button>
      </div>

    </div>
  </div>
);

};

export default AddAddressModal;
