import { type FC, useState, useRef } from "react";

import { fetchBookByISBN } from "../../services/googleBooksApi";
import bookApi from "../../services/bookApi";
import {type IBook} from "../../types"
import axios from "axios";
import BarcodeScanner from "../../components/BarCodeScanner.tsx";

const AddNewBookInfoByISBNPage: FC = () => {
        const [isbn, setIsbn] = useState("");
        const [book, setBook] = useState<IBook | null>(null);
        const [loading, setLoading] = useState(false);
        const [message, setMessage] = useState("");
        const searchRef = useRef(null)



        const handleSearch = async () => {
                setLoading(true);
                setMessage("");
                try {
                        const result = await fetchBookByISBN(isbn);
                        if (result) {
                                setBook(result);
                        } else {
                                setMessage("❌ No book information found for this ISBN...");
                                setBook(null)
                        }
                } catch (error: unknown) {
                        console.error(error);
                        setMessage("❌ Query failed...");
                } finally {
                        setLoading(false);
                }
        };

        const handleSave = async () => {
                if (!book) return;
                setLoading(true);
                setMessage("");

                try {
                        //const savedBook = await bookApi.addBook(book);
                        console.log(book);
                        await bookApi.create(book)

                        setMessage(`✅ Information of ${book.title} already saved...`);

                } catch (error) {
                        console.log("error: ",error);
                        if (axios.isAxiosError(error)) {
                                console.error("❌ response data:", error.response?.data);
                                setMessage(`❌ ${error.response?.data?.message ?? error.message}`);
                        }
                        else {setMessage(`❌ Failed to save, ${(error as Error).message}...`);}
                } finally {
                        setLoading(false);
                }
        };

        const handleOnDetect = (barCode: string):void=>{
                setIsbn(barCode);
                handleSearch();
        }

        return (
            <div className="p-6 max-w-xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">📚 Register new book in database</h1>
                    <BarcodeScanner onDetected={ handleOnDetect } />

                    {/* enter ISBN */}
                    <div className="flex items-center mb-4">
                            <input
                                value={isbn}
                                onChange={(e) => setIsbn(e.target.value)}
                                placeholder="Enter ISBN"
                                className="flex-grow border px-3 py-2 rounded mr-2"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={loading || !isbn.trim()}
                                ref={searchRef}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                    {loading ? "Searching......" : "Search"}
                            </button>
                    </div>

                    {/* Display query result */}
                    {book && (
                        <div className="border p-4 rounded shadow mb-4">
                                <h2 className="text-lg font-bold">{book.title}</h2>
                                {book.subtitle && <p className="text-sm">{book.subtitle}</p>}
                                {book.authors && <p className="mt-2">👤 Author: {book.authors.join(", ")}</p>}
                                {book.publishDate && <p>📅 Publish Date: {book.publishDate}</p>}
                                {Number(book.pageCount) > 0 && <p>📖 Pages: {book.pageCount}</p>}
                                {book.imageLink && (
                                    <img
                                        src={book.imageLink}
                                        alt={book.title}
                                        className="mt-2 w-32 rounded shadow"
                                    />
                                )}
                                <button
                                    onClick={handleSave}
                                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                        Save to database
                                </button>
                        </div>
                    )}

                    {/* staus or error message */}
                    {message && <p className="mt-4 text-left">{message}</p>}
            </div>
        );
};

export default AddNewBookInfoByISBNPage;
