import { type FC, useState } from "react";
import { fetchBookByISBN } from "../../services/googleBooksApi";
import bookApi from "../../services/bookApi";
import { type IBook } from "../../services/bookApi";

const AddNewBookInfoByISBNPage: FC = () => {
        const [isbn, setIsbn] = useState("");
        const [book, setBook] = useState<IBook | null>(null);
        const [loading, setLoading] = useState(false);
        const [message, setMessage] = useState("");

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
                        //setMessage(`✅ 已保存: ${savedBook.title}`);
                        setMessage(`✅ book information saved...`);

                } catch (error) {
                        console.error(error);
                        setMessage(`❌ Failed to save, ${(error as Error).message}...`);
                } finally {
                        setLoading(false);
                }
        };

        return (
            <div className="p-6 max-w-xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">📚 Register new book in database</h1>

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
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                    {loading ? "Searching......" : "Search"}
                            </button>
                    </div>

                    {/* 显示查询结果 */}
                    {book && (
                        <div className="border p-4 rounded shadow mb-4">
                                <h2 className="text-lg font-bold">{book.title}</h2>
                                {book.subtitle && <p className="text-sm">{book.subtitle}</p>}
                                {book.authors && <p className="mt-2">👤 Author: {book.authors.join(", ")}</p>}
                                {book.publishDate && <p>📅 Publish Date: {book.publishDate}</p>}
                                {book.pageCount && <p>📖 Pages: {book.pageCount}</p>}
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

                    {/* 状态消息 */}
                    {message && <p className="mt-4 text-left">{message}</p>}
            </div>
        );
};

export default AddNewBookInfoByISBNPage;
