
import { useEffect, useState, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import http from "../../services/http"; // 你之前写的 axios 封装
import {type IBook } from "../../types"; // 假设 IBook 接口放在这里
import bookApi from "../../services/bookApi";


const BookEditPage:FC= () => {
    const { isbn } = useParams<{ isbn: string }>();
    const navigate = useNavigate();

    const [book, setBook] = useState<IBook | null>(null);
    // const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categorySet, setCategorySet] = useState<Set<string>>(new Set());


    if (!isbn) throw new Error(`No book found with ISBN: ${isbn}`)

    // 1. get book information from the backend database
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await bookApi.getByIsbn(isbn);
                setBook(res.data);

                const booksRes = await bookApi.getAll();

                // setBooks(booksRes);
                const existedCategories= booksRes.reduce((acc: Set<string>, book) => {
                    if (book.categories) {
                        book.categories.forEach((category) => {
                            if (!acc.has(category)) {
                                acc.add(category);
                            }
                        });
                    }
                    return acc;
                }, new Set<string>());

                setCategorySet(existedCategories);

            } catch (err) {
                setError("Failed to load book.");
                console.log("Error: ", err)
            } finally {
                setLoading(false);
            }
        };
        if (isbn) fetchBook();


    }, [isbn]);



    // 2. submit the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book || !isbn) return;

        try {
            //await http.put(`/books/${isbn}`, book);
            await bookApi.update(book);
            alert("✅ Book updated successfully!");
            navigate("/books/find-and-edit");
        } catch (err) {
            console.error("❌ Update failed:", err);
            setError("Failed to update book.");
        }
    };

    // 3. process the input
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
                    <label className="block text-gray-700 font-[SUSE_Mono] ">Title</label>
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
                    <label className="block text-gray-700 font-[SUSE_Mono]">Subtitle</label>
                    <input
                        type="text"
                        value={book.subtitle || ""}
                        onChange={(e) => handleChange("subtitle", e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Cover */}
                <div>
                    <label className="block text-gray-700 font-[SUSE_Mono]">Cover Image</label>
                    <input
                        type="text"
                        value={book.imageLink || ""}
                        onChange={(e) => handleChange("imageLink", e.target.value)}
                        className="w-full border rounded p-2"
                    />
                </div>



                {/* Categories */}


                {/* existed categories */}
                <div className="space-y-1">
                    <label className="block text-gray-700 font-[SUSE_Mono]">Categories</label>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2  3xl:grid-cols-3">
                    {Array.from(categorySet).map((category) => (
                        <label key={category} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={book.categories?.includes(category) || false}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        handleChange("categories", [...(book.categories || []), category]);
                                    } else {
                                        handleChange(
                                            "categories",
                                            (book.categories || []).filter((c) => c !== category)
                                        );
                                    }
                                }}
                            />
                            <span>{category}</span>
                        </label>
                    ))}
                    </div>
                </div>

                {/* add new category */}
                <div className="mt-3">
                    <label className="block text-gray-700 font-[SUSE_Mono]">Add new category</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Enter new category"
                            className="flex-1 border rounded p-2"
                            id="newCategoryInput"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    const newCategory = (e.currentTarget.value || "").trim();
                                    if (newCategory) {
                                        if (!book.categories?.includes(newCategory)) {
                                            handleChange("categories", [...(book.categories || []), newCategory]);
                                        }
                                        setCategorySet((prev) => new Set([...Array.from(prev), newCategory]));
                                        e.currentTarget.value = "";
                                    }
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                            onClick={() => {
                                const inputEl = document.getElementById("newCategoryInput") as HTMLInputElement;
                                if (!inputEl) return;
                                const newCategory = (inputEl.value || "").trim();
                                if (newCategory) {
                                    if (!book.categories?.includes(newCategory)) {
                                        handleChange("categories", [...(book.categories || []), newCategory]);
                                    }
                                    setCategorySet((prev) => new Set([...Array.from(prev), newCategory]));
                                    inputEl.value = "";
                                }
                            }}
                        >
                            Add
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Press Enter or click Add</p>
                </div>




                {/* Authors */}
                <div>
                    <label className="block text-gray-700 font-[SUSE_Mono]">Authors (comma separated)</label>
                    <input
                        type="text"
                        value={book.authors?.join(", ") || ""}
                        onChange={(e) => handleChange("authors", e.target.value.split(",").map(a => a.trim()))}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Qty Owned */}
                <div>
                    <label className="block text-gray-700 font-[SUSE_Mono]">Quantity Owned</label>
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
                    <span className={"font-[SUSE_Mono]"}>Recommended</span>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-gray-700 font-[SUSE_Mono]">Notes</label>
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
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-[SUSE_Mono]"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default BookEditPage;
