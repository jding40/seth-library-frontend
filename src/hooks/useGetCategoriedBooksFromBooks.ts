import { type IBook, type ICategoriedBooks } from "../types";

const useGetCategoriedBooksFromBooks = (books: IBook[]): ICategoriedBooks => {
    return books.reduce((acc: ICategoriedBooks, book: IBook) => {
        const categories = book.categories || ["No Category"];

        categories.forEach((category: string) => {
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(book);
        });

        return acc;
    }, {} as ICategoriedBooks);
};

export default useGetCategoriedBooksFromBooks;
