import { NavLink, Outlet } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      {/* Tabs */}
      <div className="mb-8 flex gap-6 border-b">
        <NavLink
          to="account"
          className={({ isActive }) =>
            `pb-3 text-sm font-medium ${
              isActive
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`
          }
        >
          Account
        </NavLink>

        <NavLink
          to="orders"
          className={({ isActive }) =>
            `pb-3 text-sm font-medium ${
              isActive
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="addresses"
          className={({ isActive }) =>
            `pb-3 text-sm font-medium ${
              isActive
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`
          }
        >
          Addresses
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
};

export default ProfileLayout;
