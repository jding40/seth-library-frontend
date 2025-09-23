import { type FC, useEffect, useState } from "react";
//import { getAllBooks } from "@/api/bookApi";
//import { getAllBooks } from "../../services/bookApi";
import BookCard from "../../components/BookCard.tsx";
import bookApi from "../../services/bookApi.ts";
import {type IBook } from "../../types";
import SubMenu from "../../components/SubMenu.tsx";
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
            <div className="">
                    {/* Sub-menu */}
                    <SubMenu />


                    {/* Seth's Pick */}
                    <section className="">
                            <h1  className={"my-4 py-2 ps-2 rounded-md bg-blue-700 text-white font-[Grenze_Gotisch] text-2xl"}>🔥 Seth's Pick</h1>
                            {recommendedBooks?.length > 0 ? (
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3">
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
                            <h1  className={"my-4 py-2 ps-2 rounded-md bg-blue-700 text-white font-[Grenze_Gotisch] text-2xl"}>📖  New Arrival</h1>

                            {allBooks?.length > 0 ? (
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3">
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
