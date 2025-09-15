// src/routes/AppRoutes.tsx
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import BooksPage from "../pages/Books";
import UsersPage from "../pages/Users";
import BorrowPage from "../pages/Borrows";
import AddNewBookInfoByISBNPage from "../pages/AddNewBookInfoByISBN";

const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <>
                    <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Home />
                    </div>
                    </>
            ),
        },
        {
            path: "/books",
            element: (
                <>
                    <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <BooksPage />
                    </div>
                    </>
            ),
        },
    {
        path: "/books/add-new-book-by-isbn",
        element: (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <AddNewBookInfoByISBNPage />
                </div>
            </>
        ),
    },
        {
            path: "/users",
            element: (
                <>
                    <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <UsersPage />
                    </div>
                    </>
            ),
        },
        {
            path: "/borrows",
            element: (
                <>
                    <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <BorrowPage />
                    </div>
                    </>
            ),
        },
        {
            path: "*",
            element: (
                <>
                    <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h2 className="text-red-500">404 Page not existed</h2>
        </div>
        </>
    ),
    },
    ]);

const AppRoutes = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
