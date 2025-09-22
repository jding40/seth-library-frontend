import { type FC, useEffect, useState } from "react";
import bookApi from "../services/bookApi";
import borrowApi from "../services/borrowApi";
import { type IBook, type IBorrowRecord } from "../types";

interface BorrowCardProps {
    record: IBorrowRecord;
    handleDelete: (id:string)=>void;
}

const BorrowCard: FC<BorrowCardProps> = ({ record, handleDelete }) => {
    const [book, setBook] = useState<IBook | null>(null);
    const [localRecord, setLocalRecord] = useState(record)


    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await bookApi.getByIsbn(record.ISBN);
                setBook(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch book info:", err);
            }
        };
        fetchBook();
    }, [record.ISBN, record.isBadDebt, record.isReturned]);

    const toggleBadDebt = ():void=>{
        const confirmed = window.confirm(localRecord.isBadDebt?"Are you sure to cancel the bad-debt status?":"Are you sure to mark it as bad debt?");
        if (!confirmed) return;
        const updated:IBorrowRecord  = {...record, isBadDebt: !localRecord.isBadDebt }
        setLocalRecord(updated);
        borrowApi.toggleBadDebt(record._id as string);
    }

    const handleReturn = ():void =>{
        const confirmed = window.confirm("Are you sure to mark it as returned?")
        if (!confirmed) return;
        const updated:IBorrowRecord = {...record, isReturned:!localRecord.isReturned, outstandingQty:0};
        setLocalRecord(updated);
        borrowApi.handleReturn(record._id as string)
    }

    // const handleDelete = ():void=>{
    //     const confirmed = window.confirm("Are you sure to delete this borrow record?")
    //     if(!confirmed) return;
    //     if(localRecord._id)borrowApi.remove(localRecord._id);
    // }



    return (
        <div className="flex bg-white shadow-md rounded-lg  hover:shadow-lg transition mb-4 w-full">
            {/* 左侧封面 */}
            <div className="w-28 flex-shrink-0 max-h-56">
                <img
                    src={
                        book?.imageLink ||
                        "https://books.google.ca/googlebooks/images/no_cover_thumb.gif"
                    }
                    alt={book?.title || record.ISBN}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* info on left side */}
            <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800 max-w-[90%]">
                            {book?.title || "Unknown Book"}
                        </h2>
                        {(localRecord.isBadDebt || localRecord.isReturned) && <span className="material-symbols-outlined text-red-600 cursor-pointer" onClick={()=>handleDelete(localRecord._id as string)}>delete</span>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Borrower: <span className="font-medium">{localRecord.borrowerName} </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Borrow Date: {new Date(record.borrowDate).toLocaleDateString()}
                    </p>
                </div>

                <div className="mt-2 flex justify-start sm:justify-between items-center">
                    <p className="text-sm text-gray-700 md:hidden">
                        <span className="font-medium me-2">{localRecord.outstandingQty} / {localRecord.totalQty}</span>
                    </p>
                    <p className="text-sm text-gray-700 hidden md:block">
                        <span className="font-medium me-2">Total: {localRecord.totalQty}</span><span className="font-medium">Outstanding: {localRecord.outstandingQty}</span>
                    </p>
                    <div className="space-x-2 text-xs">
                        {localRecord.isReturned ? (
                            <span className="bg-green-100 text-green-700  px-4.5 py-1 rounded-full" >Returned</span>) : (
                            <span className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded-full cursor-pointer" onClick = {handleReturn}>
                Not Returned
              </span>
                        )}
                        {localRecord.isBadDebt?(
                            <span className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded-full cursor-pointer" onClick = {toggleBadDebt}>
                Bad Debt
              </span>):( <span className="bg-green-100 hover:bg-green-200 text-green-700 px-3.5 py-1 rounded-full cursor-pointer" onClick = {toggleBadDebt}>
                Normal</span>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowCard;
