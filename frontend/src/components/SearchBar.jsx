import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi"; // ✅ React icons

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show only on /collection routes
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  if (!showSearch || !visible) return null;

  return (
    <div className="text-center border-t border-b bg-gray-50">
      <div className="inline-flex items-center justify-center w-3/4 px-5 py-2 mx-3 my-5 border border-gray-400 rounded-full sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none bg-inherit"
          type="text"
          placeholder="Search..."
        />
        <FiSearch className="text-gray-600 w-5 h-5" /> {/* 🔍 search icon */}
      </div>
      <FiX
        onClick={() => setShowSearch(false)}
        className="inline w-4 h-4 cursor-pointer text-gray-700"
      />{" "}
      {/* ❌ close icon */}
    </div>
  );
};

export default SearchBar;
