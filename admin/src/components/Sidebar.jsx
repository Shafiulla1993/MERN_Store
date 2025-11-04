import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const linkClass =
    "flex items-center gap-3 border border-gray-500 border-r-0 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition";

  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink to={"/"} className={linkClass}>
          <img className="w-6 h-6" src={assets.add_icon} alt="Add Items" />
          <p className="hidden text-lg font-semibold md:block">Add Items</p>
        </NavLink>

        <NavLink to={"/list"} className={linkClass}>
          <img className="w-6 h-6" src={assets.parcel_icon} alt="List Items" />
          <p className="hidden text-lg font-semibold md:block">List Items</p>
        </NavLink>

        <NavLink to={"/orders"} className={linkClass}>
          <img className="w-6 h-6" src={assets.order_icon} alt="Orders" />
          <p className="hidden text-lg font-semibold md:block">View Orders</p>
        </NavLink>

        {/* 🆕 Manage Categories */}
        <NavLink to={"/add-category"} className={linkClass}>
          <img
            className="w-6 h-6"
            src={assets.category_icon || assets.add_icon}
            alt="Categories"
          />
          <p className="hidden text-lg font-semibold md:block">
            Manage Categories
          </p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
