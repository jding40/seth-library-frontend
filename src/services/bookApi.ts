// src/api/bookApi.ts
import http from "./http";
//import axios from "axios";
//import type {AxiosResponse} from "axios";

export interface IBook {
    _id?: string;
    ISBN: string;
    title: string;
    qtyOwned: number;
    borrowedBooksCount: number;
    subtitle?: string;
    authors?: string[];
    publishDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLink?: string;
    language?: string;
    pdfTokenLink?: string;
    webReaderLink?: string;
    shelfLocation?: string;
    isRecommended?: boolean;
    isWishList?: boolean;
    notes?: string;
}

const bookApi = {
    // 获取所有书籍
    //getAll: (): Promise<AxiosResponse<IBook[]>> => http.get<IBook[]>("/books"),
    getAll: async (): Promise<IBook[]> => {
        const res   = await http.get<IBook[]>("/books");
        const books:IBook[] = res.data;
        console.log("books in bookApi.getAll: ",books) //undefined
        return books;
    },

    // 获取单本书籍
    getById: (id: string) => http.get<IBook>(`/books/${id}`),

    // 创建书籍
    create: (data: IBook) => http.post<IBook>("/books", data),

    // 更新书籍
    update: (id: string, data: Partial<IBook>) =>
        http.put(`/books/${id}`, data),

    // 删除书籍
    remove: (id: string) => http.delete(`/books/${id}`),
};

export default bookApi;
