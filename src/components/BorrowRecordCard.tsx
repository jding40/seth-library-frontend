import { type FC, useEffect, useState } from "react";

import bookApi from "../services/bookApi";
import { type IBook, type IBorrowRecord } from "../types";
import type { AxiosResponse } from "axios";

interface BorrowCardProps {
    borrow?: IBorrowRecord; // 👈 允许传 undefined/null
    onUpdate?: () => void;
}

const BorrowCard: FC<BorrowCardProps> = ({ borrow, onUpdate }) => {
    const [book, setBook] = useState<IBook | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!borrow?.ISBN) return; //no borrow record
        const fetchBook = async () => {
            try {
                const result: AxiosResponse<IBook> = await bookApi.getByIsbn(borrow.ISBN);
                if (result) setBook(result.data);
            } catch (err) {
                console.error("❌ Failed to load book info", err);
            }
        };
        fetchBook();
    }, [borrow?.ISBN]);

    // 点击归还状态切换
    const handleToggleReturn = async () => {
        if (!borrow || !book) return;
        setUpdating(true);
        try {
            const updated: IBook = {
                ...book,
                borrowedBooksCount: borrow.isReturned
                    ? book.borrowedBooksCount + 1 // 取消归还
                    : book.borrowedBooksCount - 1, // 归还一本
            };

            await bookApi.update(updated);
            borrow.isReturned = !borrow.isReturned;
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error("❌ Failed to update return state", err);
        } finally {
            setUpdating(false);
        }
    };

    // 点击坏账状态切换
    const handleToggleDebt = async () => {
        if (!borrow || !book) return;
        if (!borrow.isReturned) return; // 未归还时不允许切换坏账
        setUpdating(true);
        try {
            borrow.isBadDebt = !borrow.isBadDebt;
            await bookApi.update(book); // book 不涉及库存，只是触发保存
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error("❌ Failed to update bad debt state", err);
        } finally {
            setUpdating(false);
        }
    };

    if (!borrow) {
        return (
            <div className="p-4 bg-gray-100 text-red-600 rounded-lg shadow">
                ⚠ No borrow record provided
            </div>
        );
    }

    return (
        <div className="flex bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition h-44 mb-4">
            {/* 左侧图书封面 */}
            <div className="w-28 flex-shrink-0">
                <img
                    src={
                        book?.imageLink ||
                        "https://books.google.ca/googlebooks/images/no_cover_thumb.gif"
                    }
                    alt={book?.title || borrow.ISBN}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* 右侧借阅信息 */}
            <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {book?.title || "Unknown Book"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        👤 Borrower: {borrow.borrowerName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        📅 Borrow Date: {new Date(borrow.borrowDate).toLocaleDateString()}
                    </p>
                    {borrow.returnDate && (
                        <p className="text-sm text-gray-600">
                            🔄 Return Date: {new Date(borrow.returnDate).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* status button */}
                <div className="flex justify-between items-center mt-2">
                    {/* status of return */}
                    <button
                        disabled={updating}
                        onClick={handleToggleReturn}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            borrow.isReturned
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {borrow.isReturned ? "Returned" : "Not Returned"}
                    </button>

                    {/* 坏账状态 */}
                    {borrow.isReturned && (
                        <button
                            disabled={updating}
                            onClick={handleToggleDebt}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                borrow.isBadDebt
                                    ? "bg-red-200 text-red-800"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {borrow.isBadDebt ? "Bad Debt" : "Normal"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BorrowCard;
