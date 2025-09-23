import {type FC, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import BarcodeScanner from "../../components/BarCodeScanner.tsx";
// import {fetchBookByISBN} from "../../services/googleBooksApi.ts";
import bookApi from "../../services/bookApi";
import type {AxiosResponse} from "axios";
import type {IBook} from "../../types";
// import type {IBook} from "../../types";

const FindAndEdit: FC = () => {
    const [isbn, setIsbn] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    // const [book, setBook] = useState<IBook | null>(null);
    const [message, setMessage] = useState<string>("");
    //const [existed, setExisted] = useState<boolean>(false)

    const findAndEditRef = useRef(null)
    const navigate = useNavigate();

    const handleOnDetect = async (barCode: string): Promise<void>=>{
        setIsbn(barCode);
        const res:AxiosResponse =  await bookApi.getByIsbn(barCode);
        const book: IBook | null = res.data;
        if(book) {
            //setExisted(true);
            navigate(`/books/edit/${barCode}`)
        }else{
            setMessage("We don't have this book in our database...")
        }
    }

    const handleSearch = async (isbn:string) => {
        setSearchLoading(true);
        try {
            const res:AxiosResponse = await bookApi.getByIsbn(isbn);
            const book: IBook | null = res.data;
            console.log("handlesearch=> book: ", book)
            if (book) {
                //setExisted(true);
                navigate(`/books/edit/${isbn}`)
            } else {
                setMessage("We don't have this book in our database...")
            }
        }catch(error: unknown){
            console.error(error);
            setMessage("❌ Query failed...");
        }finally {
            setSearchLoading(false);
        }
    };

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setIsbn(e.target.value);
        setMessage("");
        //setExisted(false);
        // setBook(null);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📚 Find and edit</h1>
            <BarcodeScanner onDetected={ handleOnDetect } />

            {/* enter ISBN */}
            <div className="flex items-center mb-4">
                <input
                    value={isbn}
                    onChange={handleInputChange}
                    placeholder="Enter ISBN"
                    className="flex-grow border px-3 py-2 rounded mr-2"
                />
                <button
                    onClick={()=>handleSearch(isbn)}
                    disabled={searchLoading || !isbn.trim()}
                    ref={findAndEditRef}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {searchLoading ? "Search......" : "Find and Edit"}
                </button>

            </div>
            {message.length>0 && <div className={"text-red-600"}>{message}</div>}
        </div>)

}

export default FindAndEdit;