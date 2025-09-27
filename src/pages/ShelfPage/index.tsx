import { useCallback, useEffect, useState, useRef } from "react";
import ShelfBookCard from "../../components/ShelfBookCard.tsx";
import SubMenu from "../../components/SubMenu.tsx";
import useGetShelfLocationsFromBooks from "../../hooks/useGetShelfLocationsFromBooks.ts";
import bookApi from "../../services/bookApi.ts";
import { fetchBookByISBN } from "../../services/googleBooksApi.ts";
import type { IBook } from "../../types";
import { getMajorShelfList, getMinorShelfList } from "../../utils";
import classnames from "classnames";
import { getUserRole } from "../../utils";
import BarcodeScanner from "../../components/BarCodeScanner.tsx";
import axios from "axios";

const ShelfPage = () => {
    const [shelfLocation, setShelfLocation] = useState<string>("-");
    const [books, setBooks] = useState<IBook[]>([]);
    const [needNewShelf, setNeedNewShelf] = useState<boolean>(false);
    const [newBookISBN, setNewBookISBN] = useState<string>("");
    const [action, setAction] = useState<
        | "check books"
        | "add new books"
        | "check books with multiple locations"
        | "check books with no locations"
    >("check books");
    const [searchLoading, setSearchLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const searchRef = useRef(null);
    const [newBook, setNewBook] = useState<IBook | null>(null);
    const [existed, setExisted] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [newBookQty, setNewBookQty] = useState<number>(1);

    useEffect(() => {
        const fetchBook = async () => {
            setBooks(await bookApi.getAll());
        };
        fetchBook();
    }, []);

    const shelves: string[] = Array.from(useGetShelfLocationsFromBooks(books));
    const majorShelves: string[] = getMajorShelfList(shelves);

    const handleMajor = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        if (shelfLocation.split("-")[0] === e.currentTarget.textContent) {
            setShelfLocation("-");
            setNeedNewShelf(true);
        } else {
            const newLocation = e.currentTarget.textContent + "-";
            setShelfLocation(newLocation);
            setNeedNewShelf(false);
        }
    };

    const handleMinor = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        const majorShelf: string = shelfLocation.split("-")[0];
        const newLocation = majorShelf + "-" + e.currentTarget.textContent;
        setShelfLocation(newLocation);
    };

    const shelfBookList = books.filter((book) => {
        if (shelfLocation.split("-")[1] !== "")
            return book?.shelfLocation?.includes(shelfLocation);
        else
            return book?.shelfLocation?.some(
                (location) => location.split("-")[0] === shelfLocation.split("-")[0]
            );
    });

    const removeBookFromShelf = async (isbn: string) => {
        if (
            shelfLocation.split("-")[1] === "" ||
            shelfLocation.split("-")[0] === ""
        ) {
            alert("Please select a exact shelf location first!");
            return;
        }
        await bookApi.removeBookFromShelf(isbn, shelfLocation);
        setBooks((prevBooks) => prevBooks.filter((book) => book.ISBN !== isbn));
    };

    const putUnshelvedBookToShelf = async (isbn: string) => {
        if (
            shelfLocation.split("-")[1] === "" ||
            shelfLocation.split("-")[0] === ""
        ) {
            alert("Please select an exact shelf location first!");
            return;
        }

        try {
            const updatedBook: IBook = await bookApi.addBookToShelf(
                isbn,
                shelfLocation
            );
            setBooks((prevBooks) =>
                prevBooks.map((book) => (book.ISBN === isbn ? updatedBook : book))
            );
        } catch (error) {
            console.error("Failed to put book on shelf:", error);
            alert("❌ Failed to update shelf, please try again.");
        }
    };

    const handleNewShelfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newShelfLocation = e.currentTarget.value;
        if (!/[0-9a-zA-Z]+-[0-9a-zA-Z]+/.test(newShelfLocation)) {
            setShelfLocation("-");
        } else setShelfLocation(newShelfLocation);
    };

    const setActionAsAddNewBooks = () => {
        if (/[0-9a-zA-Z]+-[0-9a-zA-Z]+/.test(shelfLocation)) {
            setAction("add new books");
        } else {
            alert("Please select a exact shelf location first!");
        }
    };

    const onDected = async (barCode: string) => {
        setNewBookISBN(barCode);
        setMessage("");
    };

    const handleIsbnInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewBookISBN(e.target.value);
        },
        []
    );

    const handleSearch = async (isbn: string) => {
        setSearchLoading(true);
        setMessage("");
        try {
            const res = await bookApi.getByIsbn(isbn);
            const book: IBook = res.data;
            if (book) {
                setExisted(true);
                setNewBook(book);
                setMessage("We found this book in our database...");
                return;
            } else {
                setExisted(false);
                const book: IBook | null = await fetchBookByISBN(newBookISBN);
                if (book) {
                    setNewBook(book);
                    setMessage("We found this book in Google Books API...");
                } else {
                    setNewBook(null);
                    setMessage(
                        "No book found in our database or Google Books API... Please input book information manually..."
                    );
                }
            }
        } catch (error: unknown) {
            console.log("error: ", error);
        } finally {
            setSearchLoading(false);
        }
    };

    const newBookQtyChangeHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newQty = e.target.valueAsNumber;
            setNewBookQty(newQty);

            if (newBook) {
                const upDatedNewBook: IBook = {
                    ...newBook,
                    qtyOwned: newQty,
                    ISBN: newBookISBN,
                    title: newBook?.title || "",
                    borrowedBooksCount: 0,
                };
                setNewBook(upDatedNewBook);
            }
        },
        [newBook, newBookISBN]
    );

    const handleSave = useCallback(async () => {
        if (!newBook) return;
        if (!/[0-9a-zA-Z]+-[0-9a-zA-Z]+/.test(shelfLocation)){
            alert("Illegal shelf location! Please select a exact shelf location first!");
            return;
        }
        setSaveLoading(true);

        try {
            if (existed) {
                const newShelfLocation: string[] = Array.from(
                    new Set(newBook.shelfLocation).add(shelfLocation)
                );
                const res = await bookApi.update({
                    ...newBook,
                    qtyOwned: newBookQty,
                    shelfLocation: newShelfLocation,
                });
                const updatedBook: IBook = res.data;
                const updatedBooks = books.map((book) =>
                    book.ISBN === updatedBook.ISBN ? updatedBook : book
                );
                setBooks(updatedBooks);
            } else {
                const res = await bookApi.create({
                    ...newBook,
                    shelfLocation: [shelfLocation],
                });
                const createdBook = res.data;
                const updatedBooks = [...books, createdBook];
                setBooks(updatedBooks);
            }
            setNewBook(null);
            setNewBookQty(1);
            setMessage(`✅ Information of ${newBook.title} already saved...`);
        } catch (error) {
            console.log("error: ", error);
            if (axios.isAxiosError(error)) {
                setMessage(`❌ ${error.response?.data?.message ?? error.message}`);
            } else {
                setMessage(`❌ Failed to save, ${(error as Error).message}...`);
            }
        } finally {
            setSaveLoading(false);
        }
    }, [existed, newBook, newBookQty, shelfLocation, books]);

    return (
        <div className="mx-auto w-full ">
            <SubMenu />

            {/* Major & Minor Shelves */}
            <div className="flex flex-row justify-between items-start gap-4 mt-6 mb-4">
                <div className="flex-1 border rounded-xl shadow h-full bg-white p-2 lg:p-4">
                    <h1 className="text-xl font-semibold border-b-2 border-b-amber-600 mb-2">
                        Major
                    </h1>
                    <div className="space-y-2">
                        {majorShelves.sort().map((majorShelf) => (
                            <p
                                className={classnames(
                                    "text-lg sm:text-xl cursor-pointer rounded px-2 py-1",
                                    shelfLocation.split("-")[0] === majorShelf &&
                                    "bg-amber-500 text-white"
                                )}
                                key={majorShelf}
                                onClick={handleMajor}
                            >
                                {majorShelf}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="flex-1 border rounded-xl shadow bg-white p-4">
                    <h1 className="text-xl font-semibold border-b-2 border-b-amber-600 mb-2">
                        Minor
                    </h1>
                    <div className="space-y-2">
                        {getMinorShelfList(shelves, shelfLocation.split("-")[0])
                            .sort()
                            .map((minorShelf) => (
                                <p
                                    className={classnames(
                                        "text-lg sm:text-xl cursor-pointer rounded px-2 py-1",
                                        shelfLocation.split("-")[1] === minorShelf &&
                                        "bg-amber-500 text-white"
                                    )}
                                    key={minorShelf}
                                    onClick={handleMinor}
                                >
                                    {minorShelf}
                                </p>
                            ))}
                    </div>
                </div>
            </div>

            {/* New Shelf Input */}
            {needNewShelf && (
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Enter new shelf location (e.g. A-1)"
                        className={classnames(
                            "border rounded-xl p-3 w-full sm:w-80 text-center text-lg shadow",
                            !/[0-9a-zA-Z]+-[0-9a-zA-Z]+/.test(shelfLocation) &&
                            "bg-red-200",
                            /[0-9a-zA-Z]+-[0-9a-zA-Z]+/.test(shelfLocation) && "bg-green-200"
                        )}
                        onChange={handleNewShelfInputChange}
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-6">
                <button
                    className={classnames(
                        "px-4 py-2 rounded-lg border shadow",
                        action === "check books" && "bg-blue-700 text-white"
                    )}
                    onClick={() => {
                        setAction("check books");
                    }}
                >
                    Check Books
                </button>
                {["admin", "owner"].includes(getUserRole()) && (
                    <button
                        className={classnames(
                            "px-4 py-2 rounded-lg border shadow",
                            action === "add new books" && "bg-blue-700 text-white"
                        )}
                        onClick={setActionAsAddNewBooks}
                    >
                        Add New Books
                    </button>
                )}
                <button
                    className={classnames(
                        "px-4 py-2 rounded-lg border shadow",
                        action === "check books with multiple locations" &&
                        "bg-blue-700 text-white"
                    )}
                    onClick={() => {
                        setAction("check books with multiple locations");
                    }}
                >
                    Books with Multiple Locations
                </button>
                <button
                    className={classnames(
                        "px-4 py-2 rounded-lg border shadow",
                        action === "check books with no locations" &&
                        "bg-blue-700 text-white"
                    )}
                    onClick={() => {
                        setAction("check books with no locations");
                    }}
                >
                    Books with No Locations
                </button>
            </div>

            <hr className="my-4" />

            {/* Add New Book Section */}
            {action === "add new books" && (
                <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg">
                    <BarcodeScanner onDetected={onDected} />
                    <div className="flex items-center mb-4">
                        <input
                            value={newBookISBN}
                            onChange={handleIsbnInputChange}
                            placeholder="Enter ISBN"
                            className="flex-grow border px-3 py-2 rounded-l-lg"
                        />
                        <button
                            onClick={() => handleSearch(newBookISBN)}
                            disabled={searchLoading || !newBookISBN.trim()}
                            ref={searchRef}
                            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            {searchLoading ? "Searching..." : "Search"}
                        </button>
                    </div>
                    {newBook && (
                        <div className="border p-4 rounded shadow mb-4">
                            <h2 className="text-lg font-bold">{newBook.title}</h2>
                            {newBook.subtitle && <p className="text-sm">{newBook.subtitle}</p>}
                            <div className="flex flex-col sm:flex-row mt-2 gap-4">
                                {newBook.imageLink && (
                                    <img
                                        src={newBook.imageLink}
                                        alt={newBook.title}
                                        className="w-32 rounded shadow"
                                    />
                                )}
                                <div className="text-sm space-y-1">
                                    {newBook.authors && (
                                        <div>👤 Author: {newBook.authors.join(", ")}</div>
                                    )}
                                    {newBook.publishDate && (
                                        <div>📅 Publish Date: {newBook.publishDate}</div>
                                    )}
                                    {Number(newBook.pageCount) > 0 && (
                                        <div>🗐 Pages: {newBook.pageCount}</div>
                                    )}
                                    {newBook?.shelfLocation && (
                                        <div>
                                            📦 Shelf Location: {newBook.shelfLocation.join(", ")}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <label className="block mt-3">
                                🧮 Qty:
                                <input
                                    className="ml-2 border rounded px-2 w-20"
                                    type="number"
                                    value={newBookQty}
                                    onChange={newBookQtyChangeHandler}
                                />
                            </label>
                            <button
                                onClick={handleSave}
                                disabled={saveLoading}
                                type="button"
                                className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Save to {shelfLocation}
                            </button>
                        </div>
                    )}
                    {message && <p className="my-4 text-left">{message}</p>}
                </div>
            )}

            {/* Book Display */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 my-8">
                {action === "check books" &&
                    shelfBookList.map((book: IBook) => (
                        <ShelfBookCard
                            key={book._id}
                            book={book}
                            userRole={getUserRole()}
                            pageShelf={shelfLocation}
                            onRemoval={removeBookFromShelf}
                            onAddToShelf={putUnshelvedBookToShelf}
                            action={"remove"}
                        />
                    ))}

                {action === "check books with multiple locations" &&
                    books
                        .filter((book: IBook) => (book?.shelfLocation as string[]).length > 1)
                        .map((book: IBook) => (
                            <ShelfBookCard
                                key={book._id}
                                book={book}
                                userRole={getUserRole()}
                                pageShelf={shelfLocation}
                                onRemoval={removeBookFromShelf}
                                onAddToShelf={() => {}}
                                action={"remove"}
                            />
                        ))}

                {action === "check books with no locations" &&
                    books
                        .filter((book: IBook) => (book?.shelfLocation as string[]).length === 0)
                        .map((book: IBook) => (
                            <ShelfBookCard
                                key={book._id}
                                book={book}
                                userRole={getUserRole()}
                                pageShelf={shelfLocation}
                                onRemoval={() => {}}
                                onAddToShelf={putUnshelvedBookToShelf}
                                action={"add"}
                            />
                        ))}
            </div>
        </div>
    );
};

export default ShelfPage;
