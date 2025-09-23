// src/components/BookCard.tsx
import { type IBook } from "../types";
import {type FC, useState } from "react";
import bookApi from "../services/bookApi";
import classnames from "classnames";
import { Link } from "react-router-dom";


interface BookCardProps {
    book: IBook;
    userRole?: string;
    onDelete?: (isbn:string) => void;
}

const BookCard:FC<BookCardProps> = ({ book, userRole, onDelete }: BookCardProps) => {

    const [isRecommended, setIsRecommend]=useState<boolean>(book.isRecommended || false)
    const [isWishList, setIsWishList]=useState<boolean>(book.isWishList || false)


    // const toggleFavorite = async()=>{
    //     setIsRecommend(prev=>!prev)
    //     const updatedBook:IBook ={...book, isRecommended: isRecommended};
    //     await bookApi.update(updatedBook);
    // }
    const toggleFavorite = async () => {
        const newValue = !isRecommended;
        setIsRecommend(newValue);
        const updatedBook: IBook = { ...book, isRecommended: newValue };
        await bookApi.update(updatedBook);
    };
    const toggleWishList = async () => {
        const newValue = !isWishList;
        setIsWishList(newValue);
        const updatedBook: IBook = { ...book, isWishList: newValue };
        await bookApi.update(updatedBook);
    };

    return (
        <div className="flex bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition lg:mini-h-64 relative">
            {/* book cover on the left */}
            <div className="w-36 flex-shrink-0 max-h-60">
                <img
                    src={book.imageLink || "https://books.google.ca/googlebooks/images/no_cover_thumb.gif"}
                    alt={book.title}
                    className="h-full w-full object-cover"
                />
            </div>
            {userRole === "admin" &&<span className={classnames("material-symbols-outlined  absolute top-5 right-0.5 cursor-pointer", isRecommended && "text-amber-600" )} onClick={toggleFavorite}>thumb_up</span>}

            {/* book info on the right */}
            <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 pe-2">{book.title}</h2>
                    {book.subtitle && <p className="text-sm text-gray-500">{book.subtitle}</p>}
                    {book.authors && book.authors.length>0 && (
                        <p className="text-sm text-gray-600 mt-1"><strong>Author: </strong>{book.authors.join(", ")}</p>
                    )}
                    {book.publishDate && (
                        <p className="text-sm text-gray-600 mt-1"><strong>Publish Date: </strong>{book.publishDate}</p>
                    )}
                    {
                        book.description &&(
                            <p className="text-sm text-gray-600 mt-1"><strong>Description: </strong>{book.description}</p>
                        )
                    }
                </div>
                <div>
                    {/*wish list*/}
                    {book.qtyOwned===0  && (userRole==="admin"||(userRole!=="admin"&& book.isWishList)) &&<span className={classnames("material-symbols-outlined me-2 cursor-pointer", isWishList && "text-amber-600" )} onClick={userRole === "admin" ? toggleWishList : undefined}>favorite</span>}
                    {/*create a borrow record*/}
                    {book.qtyOwned>0 && userRole === "admin" && <Link to={`/borrows/new?isbn=${book.ISBN}`}> <span className="material-symbols-outlined text-amber-600">volunteer_activism</span></Link>}
                </div>

                <div className="mt-2 flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                        Stock:{" "}
                        <span className="font-medium">
                            {book.qtyOwned - book.borrowedBooksCount}/{book.qtyOwned}
                        </span>
                    </p>


                    {userRole === "admin" && (
                        <div>
                            <button type="button" className="text-xs bg-red-300 hover:bg-red-500 text-white px-1 py-1 rounded-full mr-2 w-15 cursor-pointer" onClick={()=> onDelete ? onDelete(book.ISBN ) :undefined}>Delete</button>
                            <Link  to={`edit\\${book.ISBN}`} className="text-xs bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded-full">
                                Edit
                            </Link>
                        </div>

                    )}

                </div>
            </div>
        </div>
    );
};

export default BookCard;
