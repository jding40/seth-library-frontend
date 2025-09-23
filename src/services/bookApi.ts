// src/api/bookApi.ts
import http from "./http";
//import axios from "axios";
//import type {AxiosResponse} from "axios";
import {type IBook} from "../types"
import type {AxiosResponse} from "axios";


const bookApi = {
    // get all books
    //getAll: (): Promise<AxiosResponse<IBook[]>> => http.get<IBook[]>("/books"),
    getAll: async (): Promise<IBook[]> => {
        const res   = await http.get<IBook[]>("/books");
        const books:IBook[] = res.data;
        console.log("books in bookApi.getAll: ",books)
        return books;
    },

    // get a book
    getByIsbn: (isbn: string) => http.get<IBook>(`/books/${isbn}`),

    // create a book
    create: (data: IBook) => http.post<IBook>("/books", data),

    // update a book
    update: ( data: Partial<IBook>) =>
        http.put("/books", data),

    // delete a book
    remove: async(isbn: string):Promise<void> => {
        const res:AxiosResponse<IBook>=await bookApi.getByIsbn(isbn);
        const book:IBook = res.data
        if(!book) throw new Error("Book not found");
        if(book.borrowedBooksCount !==0 ) {
            alert("You can't delete a book with outstanding borrow record");
            throw new Error("You can't delete a book with outstanding borrow record");
        }
        await http.delete(`/books/${isbn}`)
    },


};

export default bookApi;
