import { type FC, useEffect, useState } from "react";
import BookCard from "../../components/BookCard.tsx";
import bookApi from "../../services/bookApi.ts";
import {type IBook, type ICategoriedBooks } from "../../types";
import useGetCategoriedBooksFromBooks from "../../hooks/useGetCategoriedBooksFromBooks.ts";
import {Link} from "react-router-dom";

const BooksPage: FC =() => {
        const [loading, setLoading] = useState(false);
        const [books, setBooks] = useState<IBook[]>([]);
        console.log(loading);

        useEffect(() => {
                const fetchBooks = async () => {
                        setLoading(true);
                        try {
                                const res:IBook[] = await bookApi.getAll();
                                setBooks(res);

                        } catch (err) {
                                console.error("❌ Failed to fetch borrow records:", err);
                        } finally {
                                setLoading(false);
                        }
                };
                fetchBooks();
        }, []);

        //const categories:Set<string> = useGetCategoriesFromBooks(books);
        const categoriedBooks:ICategoriedBooks = useGetCategoriedBooksFromBooks(books);
        console.log(categoriedBooks);

        const handleDelete = async(isbn:string): Promise<void>=>{

                const confirmed:boolean = window.confirm("Are you sure to delete this book?")
                if(!confirmed) return;
                await bookApi.remove(isbn);
                setBooks(books.filter((book:IBook):boolean=>book.ISBN !== isbn))
        }


        return (
            <div>
                    <div className="flex gap-4">
                            <Link
                                to="/books/wishlist"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                    📚 Wishlist
                            </Link>

                            <Link
                                to="/books/add-new-book-by-isbn"
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                    ✏️ Register A New Book By ISBN
                            </Link>
                            <Link to="/books/add-new-book-by-isbn"
                                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                    Register A New Book Manually
                            </Link>

                    </div>
            {Object.entries(categoriedBooks).map(entry=>{
                    return <div key={entry[0]}>
                            <h1 key={entry[0]} className={"my-4 py-2 ps-2 rounded-md bg-blue-700 text-white"}>{entry[0]}</h1>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3">
                                    {entry[1].map((book:IBook)=>{
                                            return <BookCard book={book} userRole={"admin"} key={book.ISBN} onDelete={handleDelete} />
                                    })}
                            </div>
                    </div>
            })}
            </div>

        );
};

export default BooksPage;
