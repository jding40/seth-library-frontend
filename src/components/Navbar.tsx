// src/components/Navbar.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
//import {jwtDecode} from "jwt-decode";
import {getUserRole} from "../utils";
import classnames from "classnames";
import type {RoleType} from "../types";
import "./navbar.css"

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path:string = location.pathname.split("/")[1] || "";
  const role: RoleType = getUserRole();

  const [userRole, setUserRole] = useState<RoleType>("guest");
  //const token = localStorage.getItem("token");
  console.log("location.pathname: ",location.pathname)

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
    setUserRole("guest");

    navigate("/signin");
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
          <Link to="/" className="text-2xl font-bold text-blue-600 font-[SUSE_Mono]">
            Seth Library
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-6 font-[Kablammo]">
            <Link
              to="/"
              className={classnames("text-gray-700 hover:text-blue-600 transition px-2", path===""&&"active")}>
              Home
            </Link>

            {(userRole === "admin" || userRole === "owner") && (
              <>
                <Link
                  to="/books"
                  className={classnames("text-gray-700 hover:text-blue-600 transition px-2", path==="books"&&"active")}
                >
                  Books
                </Link>
                <Link
                  to="/users"
                  className={classnames("text-gray-700 hover:text-blue-600 transition px-2", path==="users"&&"active")}
                >
                  Users
                </Link>
                <Link
                  to="/borrows"
                  className={classnames("text-gray-700 hover:text-blue-600 transition px-2", path==="borrows"&&"active")}
                >
                  Borrows
                </Link>
              </>
            )}

            {userRole==="guest" ? (
                <>
                    <Link
                        to="/signin"
                        className={classnames("text-gray-700 hover:text-blue-600 transition", path==="signin"&&"active")}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className={classnames("text-gray-700 hover:text-blue-600 transition", path==="signup"&&"active")}
                    >
                      Sign up
                    </Link>
                </>
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
        className="hidden md:hidden bg-gray-50 px-4 py-2 space-y-2 font-[Kablammo]"
        ref={mobileMenuRef}
        onClick={()=>{mobileMenuRef.current?.classList.toggle("hidden"); }}
      >
        <Link to="/" className={classnames("block text-gray-700 hover:text-blue-600", path===""&&"active")}>
          Home
        </Link>
        {(userRole === "admin" || userRole === "owner") && (
          <>
            <Link
              to="/books"
              className={classnames("block text-gray-700 hover:text-blue-600", path==="books"&&"active")}
            >
              Book Management
            </Link>
            <Link
              to="/users"
              className={classnames("block text-gray-700 hover:text-blue-600", path==="users"&&"active")}
            >
              Users Management
            </Link>
            <Link
              to="/borrows"
              className={classnames("block text-gray-700 hover:text-blue-600", path==="borrows"&&"active")}
            >
              Borrow Management
            </Link>
          </>
        )}
        {userRole==='guest' ? (
            <>
              <Link to="/signin" className={classnames("block text-gray-700 hover:text-blue-600", path==="signin"&&"active")} >
                Sign in
              </Link>
              <Link to="/signup" className={classnames("block text-gray-700 hover:text-blue-600", path==="signup"&&"active")} >
                Sign up
              </Link>
            </>
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
