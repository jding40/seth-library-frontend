import { useEffect, useState, type FC } from "react";
import { useNavigate, useLocation, type Location } from "react-router-dom";
import { type IBook } from "../../types";
import bookApi from "../../services/bookApi";

const BookCreationPage: FC = () => {
    const location: Location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const defaultIsbn: string = queryParams.get("isbn") || "";

    const navigate = useNavigate();

    const [book, setBook] = useState<IBook>({
        ISBN: defaultIsbn,
        title: "",
        qtyOwned: 1,
        borrowedBooksCount: 0,
        subtitle: "",
        authors: [],
        publishDate: "",
        description: "",
        pageCount: undefined,
        categories: [],
        imageLink: "",
        language: "en",
        pdfTokenLink: "",
        webReaderLink: "",
        shelfLocation: [],
        isRecommended: false,
        isWishList: false,
        notes: "",
    });

    const [categorySet, setCategorySet] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 获取所有已有 categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const booksRes = await bookApi.getAll();
                const existedCategories = booksRes.reduce((acc: Set<string>, b: IBook) => {
                    if (b.categories) {
                        b.categories.forEach((c) => acc.add(c));
                    }
                    return acc;
                }, new Set<string>());
                setCategorySet(existedCategories);
            } catch (err) {
                console.error("❌ Failed to load categories:", err);
                setError("Failed to load categories.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // 表单输入处理
    const handleChange = <K extends keyof IBook>(field: K, value: IBook[K]) => {
        setBook((prev) => ({ ...prev, [field]: value }));
    };

    // 提交表单
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await bookApi.create(book);
            alert("✅ Book created successfully!");
            navigate("/books/find");
        } catch (err) {
            console.error("❌ Create failed:", err);
            setError("Failed to create book.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4">Create Book</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ISBN */}
                <div>
                    <label className="block text-gray-700 font-[SUSE_Mono]">ISBN</label>
                    <input
                        type="text"
                        value={book.ISBN}
                        onChange={(e) => handleChange("ISBN", e.target.value)}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-gray-700 font-[SUSE_Mono]">Title</label>
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

                {/* Categories */}
                <div className="space-y-1">
                    <label className="block text-gray-700 font-[SUSE_Mono]">Categories</label>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 3xl:grid-cols-3">
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

                {/* Add new category */}
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

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-[SUSE_Mono]">Description</label>
                    <textarea
                        value={book.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="w-full border rounded p-2"
                        rows={3}
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

                {/* Recommended */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={book.isRecommended || false}
                        onChange={(e) => handleChange("isRecommended", e.target.checked)}
                        className="mr-2"
                    />
                    <span className="font-[SUSE_Mono]">Recommended</span>
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
                    Create Book
                </button>
            </form>
        </div>
    );
};

export default BookCreationPage;
