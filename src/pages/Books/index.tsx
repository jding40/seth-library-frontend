import { type FC, useEffect, useState } from "react";
import BookCard from "../../components/BookCard.tsx";
import bookApi from "../../services/bookApi.ts";
import {type IBook, type ICategoriedBooks } from "../../types";
import useGetCategoriedBooksFromBooks from "../../hooks/useGetCategoriedBooksFromBooks.ts";
import SubMenu from "../../components/SubMenu.tsx";

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
        console.log("categoriedBooks: ",categoriedBooks);

        const handleDelete = async(isbn:string): Promise<void>=>{

                const confirmed:boolean = window.confirm("Are you sure to delete this book?")
                if(!confirmed) return;
                await bookApi.remove(isbn);
                setBooks(books.filter((book:IBook):boolean=>book.ISBN !== isbn))
        }


        return (
            <div>
                    <SubMenu />
            {Object.entries(categoriedBooks).map(entry=>{
                    return <div key={entry[0]}>
                            <h1 key={entry[0]} className={"my-4 py-2 ps-2 rounded-md bg-blue-700 text-white font-[Grenze_Gotisch] text-2xl"}>{entry[0]}</h1>
                            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3">
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
