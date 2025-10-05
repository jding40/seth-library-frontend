// src/pages/BookPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, type NavigateFunction } from "react-router-dom";
import bookApi from "../../services/bookApi";
import { type IBook } from "../../types";
import SubMenu from "../../components/SubMenu.tsx";

const BookPage = () => {
    const { isbn } = useParams<{ isbn: string }>();
    const navigate:NavigateFunction = useNavigate();
    const [book, setBook] = useState<IBook | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await bookApi.getByIsbn(isbn!);
                setBook(res.data);
            } catch (err) {
                console.error("Failed to fetch book:", err);
            }
        };
        fetchBook();
    }, [isbn]);

    const handleDelete = async () => {
        if (!book) return;
        try {
            await bookApi.remove(book.ISBN);
            navigate("/books"); // navigate to books page after deletion
        } catch (err) {
            console.error("Failed to delete book:", err);
        }
    };

    if (!book) return <div>Loading...</div>;

    return (
        <>
        <SubMenu />
        <div className="bg-white shadow rounded-lg p-6  mt-6 md:mt-12 lg:mt-18 xl:mt-24 2xl:mt-30">


            <div className="flex gap-6">
                <img
                    src={
                        book.imageLink ||
                        "https://books.google.ca/googlebooks/images/no_cover_thumb.gif"
                    }
                    alt={book.title}
                    className="w-48 h-72 object-cover rounded-lg shadow"
                />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{book.title}</h1>
                    {book.subtitle && (
                        <p className="text-lg text-gray-600 mt-1">{book.subtitle}</p>
                    )}

                    {book.authors && book?.authors?.length > 0 && (
                        <p className="mt-2">
                            <strong>Authors: </strong>
                            {book.authors.join(", ")}
                        </p>
                    )}

                    {book.publishDate && (
                        <p>
                            <strong>Publish Date: </strong>
                            {book.publishDate}
                        </p>
                    )}

                    <p>
                        <strong>Language: </strong>
                        {book.language}
                    </p>

                    {book.pageCount && (
                        <p>
                            <strong>Page Count: </strong>
                            {book.pageCount}
                        </p>
                    )}

                    {book.categories && book.categories?.length > 0 && (
                        <p>
                            <strong>Categories: </strong>
                            {book.categories.join(", ")}
                        </p>
                    )}

                    {book.shelfLocation.length > 0 && (
                        <p>
                            <strong>Shelf Location: </strong>
                            {book.shelfLocation.join(", ")}
                        </p>
                    )}

                    <p>
                        <strong>Stock: </strong>
                        {book.qtyOwned - book.borrowedBooksCount}/{book.qtyOwned}
                    </p>

                    {book.notes && (
                        <p className="mt-2">
                            <strong>Notes: </strong>
                            {book.notes}
                        </p>
                    )}

                    {book.description && (
                        <p className="mt-4 text-gray-700">{book.description}</p>
                    )}
                </div>
            </div>

            {/* operations */}
            <div className="mt-6 flex gap-4">
                <Link
                    to={`/borrows/new?isbn=${book.ISBN}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Create BorrowRecord
                </Link>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                    Delete
                </button>
                <Link
                    to={`/books/edit/${book.ISBN}`}
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                    Edit
                </Link>
            </div>
        </div>
        </>
    );
};

export default BookPage;
