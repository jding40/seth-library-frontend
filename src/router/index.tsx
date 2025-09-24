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
import Signin from "../pages/Signin";
import BookEditPage from "../pages/BookEditPage";
import BorrowCreationPage from "../pages/BorrowCreationPage";
import {type FC } from "react";
import {RequireAuth} from "../auth";
import WishListPage from "../pages/WishListPage";
import Signup from "../pages/Signup";
import FindAndEdit  from "../pages/FindAndEdit";
import BorrowUpdate from "../pages/BorrowUpdate";

const router= createBrowserRouter([
        {
            path: "/",
            element: (
                <>
                    <Navbar />
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
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
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6">
                    <BooksPage />
                    </div>
                    </>
            ),
        },
    {
        path: "/books/wishlist",
        element: (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6">
                    <WishListPage />
                </div>
            </>
        ),
    },
    {
        path: "/books/edit/:isbn",
        element: (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6">
                    <BookEditPage ISBN={""} title={""} qtyOwned={0} borrowedBooksCount={0} />
                </div>
            </>
        ),
    },
    {
        path: "/books/add-new-book-by-isbn",
        element: (
            <RequireAuth role="admin">
                <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6">
                    <AddNewBookInfoByISBNPage />
                </div>
            </RequireAuth>
        ),
    },
        {
            path: "/users",
            element: (
                <>
                    <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6">
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
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6 ">
                    <BorrowPage />
                    </div>
                    </>
            ),
        },
    {
        path: "/borrows/new",
        element: (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6">
                    <BorrowCreationPage />
                </div>
            </>
        ),
    },
    {
        path: "/borrows/update/:id",
        element: (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6">
                    <BorrowUpdate />
                </div>
            </>
        ),
    },
    {
        path: "/signin",
        element: (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6 h-full">
                    <Signin />
                </div>
            </>
        ),
    },
    {
        path: "/signup",
        element: (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6 h-full">
                    <Signup />
                </div>
            </>
        ),
    },
    {
        path: "/books/find-and-edit",
        element: (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6 h-full">
                    <FindAndEdit />
                </div>
            </>
        ),
    },
        {
            path: "*",
            element: (
                <>
                    <Navbar />
                <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6">
                <h2 className="text-red-500">404 Page not existed</h2>
        </div>
        </>
    ),
    },
    ]);

const AppRoutes:FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRoutes;
