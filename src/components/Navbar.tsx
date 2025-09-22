// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
//import {jwtDecode} from "jwt-decode";
import {getUserRole} from "../utils";
import type {RoleType} from "../types";

const Navbar = () => {
  const navigate = useNavigate();
  const role: RoleType = getUserRole();

  const [userRole, setUserRole] = useState<RoleType>("guest");
  //const token = localStorage.getItem("token");

  useEffect(() => {

    // if (!token){
    //   setUserRole("guest");
    // }
    // else {
    //   const userPayload: IUserPayload = jwtDecode(token);
    //   setUserRole(userPayload.role || "guest")
    // }
    setUserRole(role)

  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const toggleMobileMenu = ()=>{
    if (mobileMenuRef.current) {
      mobileMenuRef.current.classList.toggle("hidden");
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            Seth Library
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>

            {userRole === "admin" && (
              <>
                <Link
                  to="/books"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Book Management
                </Link>
                <Link
                  to="/users"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Users Management
                </Link>
                <Link
                  to="/borrows"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Borrow Management
                </Link>
              </>
            )}

            {userRole==="guest" ? (
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className="hidden md:hidden bg-gray-50 px-4 py-2 space-y-2"
        ref={mobileMenuRef}
        onClick={()=>{mobileMenuRef.current?.classList.toggle("hidden"); }}
      >
        <Link to="/" className="block text-gray-700 hover:text-blue-600">
          Home
        </Link>
        {userRole === "admin" && (
          <>
            <Link
              to="/books"
              className="block text-gray-700 hover:text-blue-600"
            >
              Book Management
            </Link>
            <Link
              to="/users"
              className="block text-gray-700 hover:text-blue-600"
            >
              Users Management
            </Link>
            <Link
              to="/borrows"
              className="block text-gray-700 hover:text-blue-600"
            >
              Borrow Management
            </Link>
          </>
        )}
        {userRole==='guest' ? (
          <Link to="/login" className="block text-gray-700 hover:text-blue-600" >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="block text-gray-700 hover:text-red-600 w-full text-left"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
