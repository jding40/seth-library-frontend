// src/api/bookApi.ts
import http from "./http";
//import axios from "axios";
//import type {AxiosResponse} from "axios";
import {type IBook} from "../types"


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
    remove: (id: string) => http.delete(`/books/${id}`),
};

export default bookApi;
