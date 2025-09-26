import {type IBook} from "../types"

function useGetShelfLocationsFromBooks(books:IBook[]) {
    //console.log("books in useGetShelfLocationsFromBooks: ",books)

    return books.reduce((acc: Set<string>, book) => {
        if (book.shelfLocation) {
            //console.log("book.shelfLocation: ", book.shelfLocation);
            book.shelfLocation.forEach((shelfLocation) => {
                if (!acc.has(shelfLocation)) {
                    acc.add(shelfLocation);
                }
            });
        }
        return acc;
    }, new Set<string>());

}

export default useGetShelfLocationsFromBooks;