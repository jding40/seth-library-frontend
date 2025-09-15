// src/services/book-service.ts
import APIClient from "./api-client";

export interface Book {
    id: number;
    title: string;
    author: string;
}

const bookClient = new APIClient<Book>("/api/test");

export default bookClient;