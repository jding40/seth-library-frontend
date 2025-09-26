import {useCallback, useEffect, useState, useRef} from "react";
import ShelfBookCard from "../../components/ShelfBookCard.tsx";
import SubMenu from "../../components/SubMenu.tsx";
import useGetShelfLocationsFromBooks from "../../hooks/useGetShelfLocationsFromBooks.ts";
import bookApi from "../../services/bookApi.ts";
import {fetchBookByISBN} from "../../services/googleBooksApi.ts"
import type {IBook} from "../../types";
import {getMajorShelfList, getMinorShelfList} from "../../utils";
import classnames from "classnames";
import {getUserRole} from "../../utils";
import BarcodeScanner from "../../components/BarCodeScanner.tsx";
import axios from "axios";


// type ReturnFilter = "all" | "returned" | "notReturned";
// type DebtFilter = "all" | "badDebt" | "notBadDebt";

const ShelfPage = () => {
    const [shelfLocation, setShelfLocation] = useState<string>("-");
    const [books, setBooks] = useState<IBook[]>([]);
    const [needNewShelf, setNeedNewShelf] = useState<boolean>(false);
    const [newBookISBN, setNewBookISBN] = useState<string>("");
    const [action, setAction] = useState<"check books" | "add new books" | "check books with multiple locations" |"check books with no locations">("check books");
    // const [majorLocation, setMajorLocation] = useState<string>("");
    // const [minorLocation, setMinorLocation] = useState<string>("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const searchRef = useRef(null)
    const [newBook, setNewBook] = useState<IBook | null>(null);
    const [existed, setExisted] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("");
    const [newBookQty, setNewBookQty] = useState<number>(1)

    useEffect(()=> {
        const fetchBook = async()=>{
            setBooks(await bookApi.getAll());
        }
        fetchBook();
    },[])

    const shelves: string[] = Array.from(useGetShelfLocationsFromBooks(books))

    console.log("shelves: ",shelves);
    const majorShelves:string[] = getMajorShelfList(shelves);
    // console.log("majorShelves: ",majorShelves);
    // console.log("get minor shelved for A: ",getMinorShelfList(shelves, "A"));
    // console.log("get minor shelved for B: ",getMinorShelfList(shelves, "B"));

    const handleMajor = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        //const minorShelf:string =  shelfLocation.split("-")[1];

        //setShelfLocation(e.currentTarget.textContent+"-");
        if(shelfLocation.split("-")[0] === e.currentTarget.textContent) {
            setShelfLocation("-");
            setNeedNewShelf(true);
        }else{
            const newLocation = e.currentTarget.textContent + "-";
            setShelfLocation(newLocation);
            console.log("newLocation: ",newLocation);
            setNeedNewShelf(false);
        }



    }

    const handleMinor = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        const majorShelf:string =  shelfLocation.split("-")[0];
        const newLocation = majorShelf + "-" + e.currentTarget.textContent;
        setShelfLocation(newLocation);
        console.log("shelfLocation: ",newLocation);
    }

    const shelfBookList = books.filter((book) => {
        if(shelfLocation.split("-")[1] !== "") return book?.shelfLocation?.includes(shelfLocation)
        else return book?.shelfLocation?.some(location => location.split("-")[0] === shelfLocation.split("-")[0])
    });

    const removeBookFromShelf= async(isbn:string)=>{
        if(shelfLocation.split("-")[1] === "" || shelfLocation.split("-")[0] === "") {
            alert("Please select a exact shelf location first!");
            return ;
        }
        await bookApi.removeBookFromShelf(isbn, shelfLocation);
        setBooks(prevBooks => prevBooks.filter(book => book.ISBN !== isbn));
    }

    const handleNewShelfInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newShelfLocation = e.currentTarget.value;
        if(!/[0-9a-zA-Z]+-[0-9a-zA-Z]+/.test(newShelfLocation)) {
            setShelfLocation(("-"))
            console.log("shelfLocation: ",shelfLocation);
        }else setShelfLocation(newShelfLocation);
    }

    const setActionAsAddNewBooks = () => {
        if(/[0-9a-zA-Z]+-[0-9a-zA-Z]+/.test(shelfLocation)){
            setAction("add new books");
        }else{
            alert("Please select a exact shelf location first!");
        }

    }

    const onDected = async (barCode: string) => {
        setNewBookISBN(barCode);
    }

    const handleIsbnInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewBookISBN(e.target.value);
        // setMessage("");
        // setExisted(false);
        // setBook(null);
    }, []);

    const handleSearch = async (isbn:string) => {
        setSearchLoading(true);
        setMessage("");
        console.log("handlesearch=> isbn: ", isbn)
        try{
            const res = await bookApi.getByIsbn(isbn);
            const book:IBook = res.data;
            if(book){
                setExisted(true);
                setNewBook(book);
                setMessage("We found this book in our database...");
                return;
            }else{
                setExisted(false);
                const book:IBook|null = await fetchBookByISBN(newBookISBN);
                if(book){
                    setNewBook(book);
                    setMessage("We found this book in Google Books API...");
                }else{
                    setNewBook(null);
                    setMessage("No book found in our database or Google Books API... Please input book information manually...")
                }
            }
        }catch(error: unknown){
            console.log("error: ", error);
        }finally{
            setSearchLoading(false);
        }
    }

    const newBookQtyChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newQty = e.target.valueAsNumber;
        setNewBookQty(newQty);

        if (newBook) {
            const upDatedNewBook: IBook = {
                ...newBook,
                qtyOwned: newQty,
                ISBN: newBookISBN,
                title: newBook?.title || "",
                borrowedBooksCount: 0
            };
            setNewBook(upDatedNewBook);
        }
    }, [newBook, newBookISBN]);

    const handleSave = useCallback(async () => {
        if (!newBook) return;
        setSaveLoading(true);

        try {
            if(existed){
                const newShelfLocation:string[]=Array.from(new Set(newBook.shelfLocation).add(shelfLocation));
                await bookApi.update({...newBook, qtyOwned: newBookQty, shelfLocation:newShelfLocation})
                const updatedBooks = books.map(book => book.ISBN === newBook.ISBN ? newBook : book);

                setBooks(updatedBooks);
            }else{
                await bookApi.create({...newBook, shelfLocation: [shelfLocation]})
                const updatedBooks = [...books, newBook];
                setBooks(updatedBooks);
                // setBooks(prevBooks => [...prevBooks, newBook]);

            }
            setNewBook(null);
            setNewBookQty(1);
            setMessage(`✅ Information of ${newBook.title} already saved...`);
        } catch (error) {
            console.log("error: ", error);
            if (axios.isAxiosError(error)) {
                console.error("❌ response data:", error.response?.data);
                setMessage(`❌ ${error.response?.data?.message ?? error.message}`);
            } else {
                setMessage(`❌ Failed to save, ${(error as Error).message}...`);
            }
        } finally {
            setSaveLoading(false);
        }
    }, [existed, newBook, newBookQty, shelfLocation, books]);

    return (
        <div className="mx-auto w-full">
            <SubMenu />
            <div className={"flex justify-between items-start text-center gap-4 mt-10 my-4"}>
                <div className="border-1 rounded-xl w-200 px-4">
                    <h1 className={"text-2xl border-b-2 border-b-amber-600"}>Major</h1>
                    <div>
                        {majorShelves.map((majorShelf) => (
                                <p className={classnames("text-2xl cursor-pointer", shelfLocation.split("-")[0]===majorShelf && "bg-amber-500 text-white")} key={majorShelf} onClick={handleMajor}>{majorShelf}</p>
                        ))}
                    </div>
                </div>
                <div className=" border-1 rounded-xl w-200">
                    <h1 className={"text-2xl  border-b-2 border-b-amber-600"}>Minor</h1>
                    <div>
                        {getMinorShelfList(shelves, shelfLocation.split("-")[0]).map((minorShelf) => (
                            <p className={classnames("text-2xl cursor-pointer", shelfLocation.split("-")[1] === minorShelf && "bg-amber-500 text-white" )} key={minorShelf} onClick={handleMinor}>{minorShelf}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* add new shelflocation */}
            {needNewShelf && <div className="mt-3">
                <div className="flex space-x-2 justify-center">
                    <input
                        type="text"
                        placeholder="Enter new shelf location"
                        className={classnames("border rounded-xl p-2 w-50 h-20 text-center text-2xl", (!/[0-9a-zA-Z]+-[0-9a-zA-Z]+/.test(shelfLocation)) &&"bg-red-200", (/[0-9a-zA-Z]+-[0-9a-zA-Z]+/.test(shelfLocation)) && "bg-green-200")}
                        id="newShelfLocationInput"
                        onChange={handleNewShelfInputChange}
                    />
                </div>

            </div>}

            <div>
                <button className={classnames("p-2 rounded-t-xl border-1", action==="check books" && "bg-blue-700  text-white")} onClick={()=>{setAction("check books")}}>Check Books</button>
                {["admin", "owner"].includes(getUserRole()) && <button className={classnames("p-2 rounded-t-xl border-1", action==="add new books" && "bg-blue-700 text-white")} onClick={setActionAsAddNewBooks}>Add new books</button>}
                <button className={classnames("p-2 rounded-t-xl border-1", action==="check books with multiple locations" && "bg-blue-700 text-white")} onClick={()=>{setAction("check books with multiple locations")}}>Books with multiple locations</button>
                <button className={classnames("p-2 rounded-t-xl border-1", action==="check books with no locations" && "bg-blue-700 text-white")} onClick={()=>{setAction("check books with no locations")}}>Books with no locations</button>
            </div>
            <hr />

            {action=== "add new books" && <div className="p-6 max-w-xl mx-auto">
                <BarcodeScanner onDetected={onDected} />
                {/* enter ISBN */}
                <div className="flex items-center mb-4">
                    <input
                        value={newBookISBN}
                        onChange={handleIsbnInputChange}
                        placeholder="Enter ISBN"
                        className="flex-grow border px-3 py-2 rounded mr-2"
                    />
                    <button
                        onClick={()=>handleSearch(newBookISBN)}
                        disabled={searchLoading || !newBookISBN.trim()}
                        ref={searchRef}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {searchLoading ? "Searching......" : "Search"}
                    </button>

                </div>
                {newBook && (
                    <div className="border p-4 rounded shadow mb-4">
                        <h2 className="text-lg font-bold">{newBook.title}</h2>
                        {newBook.subtitle && <p className="text-sm">{newBook.subtitle}</p>}
                        <div className="flex">
                            {newBook.imageLink && (
                                <img
                                    src={newBook.imageLink}
                                    alt={newBook.title}
                                    className="mt-2 w-32 rounded shadow max-h-50"
                                />
                            )}
                            <div>
                                {newBook.authors && <div className="ps-1">👤 Author: {newBook.authors.join(", ")}</div>}
                                {newBook.publishDate && <div className="ps-1">📅 Publish Date: {newBook.publishDate}</div>}
                                {Number(newBook.pageCount) > 0 && <div className="ps-1">🗐 Pages: {newBook.pageCount}</div>}
                                {/*{book.description && <div className={"flex"}><div className={"me-1 ps-1"}>📖  </div><div>Description: {book.description}</div></div>}*/}
                            </div>

                        </div>
                        <label className={"me-3 text-2xl"}>🧮 Qty:
                            <input className="w-18 px-2" type={"number"} value={newBookQty} onChange={newBookQtyChangeHandler}/>
                        </label>
                        <button
                            onClick={handleSave}
                            disabled={saveLoading}
                            type="button"
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Save to database
                        </button>
                    </div>
                )}
                {message && <p className="my-4 text-left">{message}</p>}
            </div>}

            {/*book display for designated shelf*/}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 my-8">
                {action === "check books" && shelfBookList.map((book:IBook) =>
                    <ShelfBookCard key={book._id} book={book} userRole={getUserRole()}  onRemoval={removeBookFromShelf} />)}

                {action === "check books with multiple locations" && books.filter((book:IBook) => (book?.shelfLocation as string[]).length > 1).map((book:IBook) =>
                    <ShelfBookCard key={book._id} book={book} userRole={getUserRole()}  onRemoval={()=>{}} />)}
                {action === "check books with no locations" && books.filter((book:IBook) => (book?.shelfLocation as string[]).length == 0).map((book:IBook) =>
                    <ShelfBookCard key={book._id} book={book} userRole={getUserRole()} onRemoval={()=>{}} />)}
            </div>
        </div>)

}

export default ShelfPage;