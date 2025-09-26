// src/services/book-service.ts
import APIClient from "./api-client";

export interface ITestBook {
    id: number;
    title: string;
    author: string;
}

const bookClient = new APIClient<ITestBook>("/api/test");

export default bookClient;