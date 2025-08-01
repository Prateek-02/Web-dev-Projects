// /src/components/Navbar.jsx
import React from "react";

const Navbar = () => {
  return (
    <div className="bg-blue-600 text-white px-4 py-3 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">ChatterHub</h1>
      <div className="flex gap-4 items-center">
        <span className="hidden sm:block">Welcome back 👋</span>
        <img
          src="/default-avatar.png"
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Navbar;
