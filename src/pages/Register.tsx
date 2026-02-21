import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 Password match check
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // 🔒 Terms check
    if (!form.agree) {
      toast.error("Please agree to Terms & Conditions");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        agree: form.agree,
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Create account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join ShopVibe today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
              placeholder="9876543210"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <span>
              I agree to the{" "}
              <span className="text-primary font-medium">
                Terms & Conditions
              </span>
            </span>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
