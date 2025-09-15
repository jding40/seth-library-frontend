// src/components/BookCard.tsx
import { type IBook } from "../services/bookApi";

interface BookCardProps {
    book: IBook;
}

const BookCard = ({ book }: BookCardProps) => {
    return (
        <div className="flex bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition h-60">
            {/* 左侧封面 */}
            <div className="w-36 flex-shrink-0">
                <img
                    src={book.imageLink || "https://books.google.ca/googlebooks/images/no_cover_thumb.gif"}
                    alt={book.title}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* 右侧信息 */}
            <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{book.title}</h2>
                    {book.subtitle && <p className="text-sm text-gray-500">{book.subtitle}</p>}
                    {book.authors && (
                        <p className="text-sm text-gray-600 mt-1">Author: {book.authors.join(", ")}</p>
                    )}
                    {book.publishDate && (
                        <p className="text-sm text-gray-600 mt-1">Publish Date: {book.publishDate}</p>
                    )}
                </div>

                <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                        Stock:{" "}
                        <span className="font-medium">
                            {book.qtyOwned - book.borrowedBooksCount}/{book.qtyOwned}
                        </span>
                    </p>
                    {book.isRecommended && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Recommended
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;
