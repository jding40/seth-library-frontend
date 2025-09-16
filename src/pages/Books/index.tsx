import { type FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import { getAllBooks } from "@/api/bookApi";  // 假设你封装过bookApi
//import { getAllBooks } from "../../services/bookApi";
import BookCard from "../../components/BookCard";
import bookApi, {type IBook } from "../../services/bookApi";
//import type {AxiosResponse} from "axios";

const BooksPage: FC = () => {
        const [recommendedBooks, setRecommendedBooks] = useState<IBook[]>([]);
        const [allBooks, setAllBooks] = useState<IBook[]>([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                const fetchBooks = async () => {
                        try {
                                const books:IBook[] = await bookApi.getAll();

                                //const books = res.data;
                                console.log("books in BooksPage: ",books)


                                setAllBooks(books);
                                console.log("allbooks: ", allBooks);//allbooks: []

                                setRecommendedBooks(books?.filter((b) => b.isRecommended));
                        } catch (error) {
                                console.error("❌ Failed to fetch books:", error);
                        } finally {
                                setLoading(false);
                        }
                };

                fetchBooks();
        }, []);

        if (loading) {
                return <div className="p-4">Loading books...</div>;
        }

        return (
            <div className="p-6 space-y-10">
                    {/* 子菜单 */}
                    <div className="flex gap-4">
                            <Link
                                to="/books/wishlist"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                    📚 Wishlist
                            </Link>
                            <Link
                                to="/books/update"
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                    ✏️ Update Book Info
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

                    {/* Seth's Pick */}
                    <section>
                            <h2 className="text-2xl font-bold mb-4">🔥 Seth's Pick</h2>
                            {recommendedBooks?.length > 0 ? (
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                        {recommendedBooks.map((book) => (
                                            <BookCard key={book._id} book={book} />
                                        ))}
                                </div>
                            ) : (
                                <p>No recommended books yet.</p>
                            )}
                    </section>

                    {/* Seth's Book Collection */}
                    <section>
                            <h2 className="text-2xl font-bold mb-4">📖 Seth's Book Collection</h2>
                            {allBooks?.length > 0 ? (
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                        {allBooks?.map((book) => (
                                            <BookCard key={book._id} book={book} />
                                        ))}
                                </div>
                            ) : (
                                <p>No books found in collection.</p>
                            )}
                    </section>
            </div>
        );
};

export default BooksPage;
