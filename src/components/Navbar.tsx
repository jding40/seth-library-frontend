// src/components/Navbar.tsx
import { Link, NavLink, useNavigate, useLocation, type NavLinkRenderProps, type NavigateFunction } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import http from "../services/http.ts"

import {getUserRole} from "../utils";
import classnames from "classnames";
import type {RoleType} from "../types";
import "./navbar.css"


const Navbar = () => {
  const navigate:NavigateFunction = useNavigate();
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
    delete http.defaults.headers.common["Authorization"];

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
          <Link to="/" className="text-4xl font-bold text-blue-600 dancing-script-nav">
            Seth Library
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-4  shadows-into-light-regular  text-2xl">
            <NavLink
              to="/"
              className={({isActive}:NavLinkRenderProps)=> classnames("text-gray-700 hover:text-blue-600 transition px-2", isActive&&"active")}>
              Home
            </NavLink>

            <NavLink
                to="/books"
                className={({isActive}:NavLinkRenderProps)=> classnames("text-gray-700 hover:text-blue-600 transition px-2", isActive&&"active")}

            >
              Books
            </NavLink>
            <NavLink
                to="/shelf"
                className={({isActive}) => classnames("text-gray-700 hover:text-blue-600 transition px-2", isActive&&"active")}
            >
              Shelves
            </NavLink>

            {(userRole === "admin" || userRole === "owner") && (
              <>

                <NavLink
                  to="/users"
                  className={({isActive}) => classnames("text-gray-700 hover:text-blue-600 transition px-2", isActive &&"active")}
                >
                  Users
                </NavLink>
                <NavLink
                  to="/borrows"
                  className={({isActive}) =>classnames("text-gray-700 hover:text-blue-600 transition px-2", isActive&&"active")}
                >
                  Borrows
                </NavLink>
              </>
            )}

            {userRole==="guest" ? (
                <>
                    <NavLink
                        to="/signin"
                        className={({isActive}) =>classnames("text-gray-700 hover:text-blue-600 transition", isActive&&"active")}
                    >
                      Sign in
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className={classnames("text-gray-700 hover:text-blue-600 transition", path==="signup"&&"active")}
                    >
                      Sign up
                    </NavLink>
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
        className="hidden md:hidden bg-gray-50 px-4 py-2 space-y-2 shadows-into-light-regular"
        ref={mobileMenuRef}
        onClick={()=>{mobileMenuRef.current?.classList.toggle("hidden"); }}
      >
        <NavLink to="/" className={classnames("block text-gray-700 hover:text-blue-600", path===""&&"active")}>
          Home
        </NavLink>
        <NavLink
            to="/books"
            className={classnames("block text-gray-700 hover:text-blue-600", path==="books"&&"active")}
        >
          Books
        </NavLink>
        <NavLink
            to="/shelf"
            className={classnames("block text-gray-700 hover:text-blue-600", path==="shelf"&&"active")}
        >
          Shelves
        </NavLink>
        {(userRole === "admin" || userRole === "owner") && (
          <>

            <NavLink
              to="/users"
              className={classnames("block text-gray-700 hover:text-blue-600", path==="users"&&"active")}
            >
              Users
            </NavLink>
            <NavLink
              to="/borrows"
              className={classnames("block text-gray-700 hover:text-blue-600", path==="borrows"&&"active")}
            >
              Borrows
            </NavLink>
          </>
        )}
        {userRole==='guest' ? (
            <>
              <NavLink to="/signin" className={classnames("block text-gray-700 hover:text-blue-600", path==="signin"&&"active")} >
                Sign in
              </NavLink>
              <NavLink to="/signup" className={classnames("block text-gray-700 hover:text-blue-600", path==="signup"&&"active")} >
                Sign up
              </NavLink>
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
