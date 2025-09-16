
import { useEffect, useState, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import http from "../../services/http"; // 你之前写的 axios 封装
import {type IBook } from "../../types"; // 假设 IBook 接口放在这里
import bookApi from "../../services/bookApi";

const BookEditPage:FC<IBook> = () => {
    const { isbn } = useParams<{ isbn: string }>();
    const navigate = useNavigate();

    const [book, setBook] = useState<IBook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    if (!isbn) throw new Error(`No book found with ISBN: ${isbn}`)

    // 1. 获取图书详情
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await bookApi.getByIsbn(isbn);
                setBook(res.data);
            } catch (err) {
                setError("Failed to load book.");
                console.log("Error: ", err)
            } finally {
                setLoading(false);
            }
        };

        if (isbn) fetchBook();
    }, [isbn]);

    // 2. 提交更新
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book || !isbn) return;

        try {
            //await http.put(`/books/${isbn}`, book);
            await bookApi.update(book);
            alert("✅ Book updated successfully!");
            navigate("/books");
        } catch (err) {
            console.error("❌ Update failed:", err);
            setError("Failed to update book.");
        }
    };

    // 3. 处理输入
    //const handleChange = (field: keyof IBook, value:any) => { setBook((prev) => (prev ? { ...prev, [field]: value } : prev)); };
    const handleChange = <K extends keyof IBook>(field: K, value: IBook[K]) => {
        setBook((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!book) return <p>Book not found.</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={book.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label className="block text-gray-700">Subtitle</label>
                    <input
                        type="text"
                        value={book.subtitle || ""}
                        onChange={(e) => handleChange("subtitle", e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Authors */}
                <div>
                    <label className="block text-gray-700">Authors (comma separated)</label>
                    <input
                        type="text"
                        value={book.authors?.join(", ") || ""}
                        onChange={(e) => handleChange("authors", e.target.value.split(",").map(a => a.trim()))}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Qty Owned */}
                <div>
                    <label className="block text-gray-700">Quantity Owned</label>
                    <input
                        type="number"
                        value={book.qtyOwned}
                        onChange={(e) => handleChange("qtyOwned", Number(e.target.value))}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* isRecommended */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={book.isRecommended || false}
                        onChange={(e) => handleChange("isRecommended", e.target.checked)}
                        className="mr-2"
                    />
                    <span>Recommended</span>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-gray-700">Notes</label>
                    <textarea
                        value={book.notes || ""}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        className="w-full border rounded p-2"
                        rows={3}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default BookEditPage;
