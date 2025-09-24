import { type FC, useEffect, useState } from "react";
import BookCard from "../../components/BookCard.tsx";
import bookApi from "../../services/bookApi.ts";
import {type IBook, type ICategoriedBooks } from "../../types";
import useGetCategoriedBooksFromBooks from "../../hooks/useGetCategoriedBooksFromBooks.ts";
import SubMenu from "../../components/SubMenu.tsx";
import {getUserRole} from "../../utils";


const BooksPage: FC =() => {
        const [loading, setLoading] = useState(false);
        const [books, setBooks] = useState<IBook[]>([]);
        const [keyWord, setKeyWord] = useState<string>("");
        // const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);
        console.log(loading);

        useEffect(() => {
                const fetchBooks = async () => {
                        setLoading(true);
                        try {
                                const res:IBook[] = await bookApi.getAll();
                                setBooks(res.filter((book)=>book.title.toLowerCase().includes(keyWord.trim().replace(/\s+/g, " "))));

                        } catch (err) {
                                console.error("❌ Failed to fetch borrow records:", err);
                        } finally {
                                setLoading(false);
                        }
                };
                fetchBooks();
        }, [keyWord]);

        //const categories:Set<string> = useGetCategoriesFromBooks(books);
        const categoriedBooks:ICategoriedBooks = useGetCategoriedBooksFromBooks(books);
        console.log("categoriedBooks: ",categoriedBooks);

        const handleKeyWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setKeyWord(e.target.value);
                // const filteredBooks:IBook[] = books.filter((book:IBook)=> book.title.toLowerCase().includes(keyWord.trim().replace(/\s+/g, " ")));
                // setBooks(filteredBooks);
        };

        const handleDelete = async(isbn:string): Promise<void>=>{

                const confirmed:boolean = window.confirm("Are you sure to delete this book?")
                if(!confirmed) return;
                await bookApi.remove(isbn);
                setBooks(books.filter((book:IBook):boolean=>book.ISBN !== isbn))
        }


        return (
            <div className="">
                    <SubMenu />
                    <div> <input type={"text"} className={"border-2 border-blue-800  w-full my-2 h-10 px-3 rounded-xl" } placeholder="Please input title..." value={keyWord} onChange={handleKeyWordChange} /></div>
            {Object.entries(categoriedBooks).map(entry=>{
                    return <div key={entry[0]}>
                            <h1 key={entry[0]} className={"my-4 py-2 ps-2 rounded-md bg-blue-700 text-white font-[Grenze_Gotisch] text-2xl"}>{entry[0]}</h1>
                            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3">
                                    {entry[1].map((book:IBook)=>{
                                            return <BookCard book={book} userRole={getUserRole()} key={book.ISBN} onDelete={handleDelete} />
                                    })}
                            </div>
                    </div>
            })}
            </div>

        );
};

export default BooksPage;
