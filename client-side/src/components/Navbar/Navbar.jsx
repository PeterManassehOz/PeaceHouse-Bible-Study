import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import LivingSeed from "/LSeed-Logo-1.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-white shadow-md">
      {/* Logo */}
      <div className="w-1/2 max-sm:pt-5 flex items-center px-12">
        <img src={LivingSeed} alt="Logo" className="w-32 h-12 mr-2" />
      </div>

      {/* Desktop Menu (Hidden on Small Screens) */}
      <div className="hidden sm:flex w-1/2 bg-green-300 gap-25 p-8 max-sm:bg-white max-sm:gap-10 items-center justify-end px-12">
        <Link to="/studies" className="text-lg font-semibold text-gray-700 hover:text-blue-500">
          Studies
        </Link>
        <Link to="/user-dashboard" className="text-lg font-semibold text-gray-700 hover:text-blue-500">
          Dashboard
        </Link>
        <Link to="/about" className="text-lg font-semibold text-gray-700 hover:text-blue-500">
          About
        </Link>
      </div>

      {/* Hamburger Button (Only visible on small screens) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden text-gray-700 px-4 mr-10"
      >
        {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
      </button>

      {/* Mobile Menu (Dropdown) */}
      <div
        className={`absolute top-16 right-0 w-full bg-white shadow-md flex flex-col items-center py-4 transition-transform hover:green ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-96 opacity-0"
        } sm:hidden`}
      >
        <Link to="/studies"  className="text-lg font-semibold text-gray-700 hover:text-white hover:bg-green-500 w-full text-center py-3 transition duration-300">
          Studies
        </Link>
        <Link to="/user-dashboard"  className="text-lg font-semibold text-gray-700 hover:text-white hover:bg-green-500 w-full text-center py-3 transition duration-300">
          Dashboard
        </Link>
        <Link to="/about"  className="text-lg font-semibold text-gray-700 hover:text-white hover:bg-green-500 w-full text-center py-3 transition duration-300">
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
