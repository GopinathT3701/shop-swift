import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/cart", label: "Cart" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/products?search=${search}`);
    setSearch("");
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
            S
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            ShopVibe
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.to)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* 🔍 Desktop Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 rounded-full border border-border bg-background px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-full p-2 transition-colors hover:bg-accent"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Profile */}
          <button
            onClick={handleProfileClick}
            className="hidden rounded-full p-2 transition-colors hover:bg-accent md:inline-flex"
          >
            <User className="h-5 w-5 text-foreground" />
          </button>

          {/* Logout */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="hidden rounded-full p-2 transition-colors hover:bg-accent md:inline-flex"
            >
              <LogOut className="h-5 w-5 text-red-500" />
            </button>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-2 transition-colors hover:bg-accent md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-3 p-4">

              {/* 🔍 Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-border bg-background px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </form>

              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleProfileClick();
                }}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-left text-muted-foreground hover:bg-accent"
              >
                {isLoggedIn ? "Profile" : "Login"}
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-left text-red-500 hover:bg-accent"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
