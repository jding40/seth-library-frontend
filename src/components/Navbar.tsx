// src/components/Navbar.tsx
import { Link } from "react-router-dom";

const Navbar = () => {
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
                        <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
                            Home
                        </Link>
                        <Link to="/books" className="text-gray-700 hover:text-blue-600 transition">
                            Book Management
                        </Link>
                        <Link to="/users" className="text-gray-700 hover:text-blue-600 transition">
                            Users Management
                        </Link>
                        <Link to="/borrows" className="text-gray-700 hover:text-blue-600 transition">
                            Borrow Management
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            className="text-gray-700 hover:text-blue-600 focus:outline-none"
                            onClick={() => {
                                const menu = document.getElementById("mobile-menu");
                                menu?.classList.toggle("hidden");
                            }}
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div id="mobile-menu" className="hidden md:hidden bg-gray-50 px-4 py-2 space-y-2">
                <Link to="/" className="block text-gray-700 hover:text-blue-600">
                    HomePage
                </Link>
                <Link to="/books" className="block text-gray-700 hover:text-blue-600">
                    Book Management
                </Link>
                <Link to="/users" className="block text-gray-700 hover:text-blue-600">
                    Users Management
                </Link>
                <Link to="/borrows" className="block text-gray-700 hover:text-blue-600">
                    Borrow Management
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
