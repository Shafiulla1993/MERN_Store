import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, user, logout, navigate } =
    useContext(ShopContext);

  const handleProfileClick = (path) => {
    setVisible(false);
    navigate(path);
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      {/* ✅ Brand Logo Text Instead of Static Asset */}
      <Link to="/" className="text-2xl font-semibold tracking-wide">
        Trendify
      </Link>

      {/* ✅ Desktop Menu */}
      <ul className="hidden gap-5 text-sm text-gray-700 sm:flex">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* ✅ Right Section */}
      <div className="flex items-center gap-6">
        {/* Search Button */}
        <button onClick={() => setShowSearch(true)} className="text-xl">
          🔍
        </button>

        {/* ✅ Profile Dropdown */}
        <div className="relative group">
          <button className="text-xl cursor-pointer">👤</button>
          <div className="absolute right-0 hidden pt-4 group-hover:block dropdown-menu">
            <div className="flex flex-col gap-2 px-5 py-3 text-gray-600 rounded w-36 bg-slate-100">
              {user ? (
                <>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={() => handleProfileClick("/profile")}
                  >
                    Profile
                  </p>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={() => handleProfileClick("/orders")}
                  >
                    Orders
                  </p>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={logout}
                  >
                    Logout
                  </p>
                </>
              ) : (
                <p
                  className="cursor-pointer hover:text-black"
                  onClick={() => navigate("/login")}
                >
                  Login
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Cart Icon */}
        <Link to="/cart" className="relative text-xl">
          🛒
          <p className="absolute right-[-8px] bottom-[-6px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <button onClick={() => setVisible(true)} className="text-xl sm:hidden">
          ☰
        </button>
      </div>

      {/* ✅ Mobile Sidebar */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <span className="text-lg">←</span>
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
