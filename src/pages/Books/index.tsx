import { type FC,  useState, useMemo} from "react";
import BookCard from "../../components/BookCard.tsx";
import bookApi from "../../services/bookApi.ts";
import { type IBook, type ICategoriedBooks } from "../../types";
import useGetCategoriedBooksFromBooks from "../../hooks/useGetCategoriedBooksFromBooks.ts";
import SubMenu from "../../components/SubMenu.tsx";
import { getUserRole } from "../../utils";

import { useQuery } from "@tanstack/react-query";

const BooksPage: FC = () => {

    const [keyWord, setKeyWord] = useState<string>("");

    const { data: books = [] } = useQuery({
        queryKey: ["books"],
        queryFn: bookApi.getAll,
    });


    const filteredBooks = useMemo(() => {
        const keyword = keyWord.trim().toLowerCase();
        if (!keyword) return books.filter((book) => book.qtyOwned > 0);
        return books.filter(
            (book) => book.qtyOwned > 0 && book.title.toLowerCase().includes(keyword)
        );
    }, [keyWord, books]);

    const categoriedBooks: ICategoriedBooks =
        useGetCategoriedBooksFromBooks(filteredBooks);
    console.log("categoriedBooks: ", categoriedBooks);

    const handleKeyWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyWord(e.target.value);
    };

    const handleDelete = async (isbn: string): Promise<void> => {
        const confirmed: boolean = window.confirm(
            "Are you sure to delete this book?"
        );
        if (!confirmed) return;
        await bookApi.remove(isbn);
        //setBooks(books.filter((book: IBook): boolean => book.ISBN !== isbn));
    };

    return (
        <div className="">
            <SubMenu />
            <div className={"relative"}>
                <input
                    type={"text"}
                    className={
                        "border-2 border-blue-800  w-full my-2 h-10 px-3 rounded-xl"
                    }
                    placeholder="Please input title..."
                    value={keyWord}
                    onChange={handleKeyWordChange}
                />
                {keyWord && (
                    <span className={"absolute right-3 top-3.5 text-gray-500"}>
            {" "}
                        {filteredBooks.length}{" "}
                        {filteredBooks.length > 1 ? "results" : "result"}
          </span>
                )}
            </div>
            {Object.entries(categoriedBooks).map((entry) => {
                return (
                    <div key={entry[0]}>
                        <h1
                            key={entry[0]}
                            className={
                                "my-4 py-2 ps-2 rounded-md bg-blue-700 text-white font-[Grenze_Gotisch] text-2xl"
                            }
                        >
                            {entry[0]}
                        </h1>
                        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3">
                            {entry[1].map((book: IBook) => {
                                return (
                                    <BookCard
                                        book={book}
                                        userRole={getUserRole()}
                                        key={book.ISBN}
                                        onDelete={handleDelete}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BooksPage;
