import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("userId");

  return (
    <nav className="bg-black shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          E-Commerce Store
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="text-white hover:text-gray-700">
                Cart
              </Link>
              <Link to="/my-orders" className="text-white hover:text-gray-700">
                My Orders
              </Link>
              <Link to="/profile" className="text-white hover:text-gray-700">
                Profile
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
