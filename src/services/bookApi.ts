// src/api/bookApi.ts
import http from "./http";
//import axios from "axios";
//import type {AxiosResponse} from "axios";
import {type IBook} from "../types"


const bookApi = {
    // 获取所有书籍
    //getAll: (): Promise<AxiosResponse<IBook[]>> => http.get<IBook[]>("/books"),
    getAll: async (): Promise<IBook[]> => {
        const res   = await http.get<IBook[]>("/books");
        const books:IBook[] = res.data;
        console.log("books in bookApi.getAll: ",books)
        return books;
    },

    // 获取单本书籍
    getByIsbn: (isbn: string) => http.get<IBook>(`/books/${isbn}`),

    // 创建书籍
    create: (data: IBook) => http.post<IBook>("/books", data),

    // 更新书籍
    update: ( data: Partial<IBook>) =>
        http.put("/books", data),

    // 删除书籍
    remove: (id: string) => http.delete(`/books/${id}`),
};

export default bookApi;
