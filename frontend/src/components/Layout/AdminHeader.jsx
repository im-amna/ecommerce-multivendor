
import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      
      {/* Logo */}
      <div>
        <Link to="/">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Shop Logo"
          />
        </Link>
      </div>

      {/* Header Icons */}
      <div className="flex items-center">
        <div className="flex items-center mr-4">

          {/* Coupons */}
          <Link
            to="/dashboard-coupons"
            className="800px:block hidden"
          >
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
              title="Coupons"
            />
          </Link>

          {/* Events */}
          <Link
            to="/dashboard-events"
            className="800px:block hidden"
          >
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
              title="Events"
            />
          </Link>

          {/* Products */}
          <Link
            to="/dashboard-products"
            className="800px:block hidden"
          >
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
              title="Products"
            />
          </Link>

          {/* Orders */}
          <Link
            to="/dashboard-orders"
            className="800px:block hidden"
          >
            <FiPackage
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
              title="Orders"
            />
          </Link>

          {/* Messages */}
          <Link
            to="/dashboard-messages"
            className="800px:block hidden"
          >
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
              title="Messages"
            />
          </Link>

          {/* User Avatar */}
          <img
            src={user?.avatar?.url || ""}
            alt="Profile"
            className="w-[50px] h-[50px] rounded-full object-cover"
          />

        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
