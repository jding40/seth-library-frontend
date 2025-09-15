import http from "./http";

export interface IBorrowRecord {
    _id?: string;
    ISBN: string;
    qty: number;
    borrowerName: string;
    borrowDate:Date;
    isReturned?: boolean;
    returnDate?:Date,
    isBadDebt?: boolean;
    notes?: string;
}

const borrowApi = {
    getAll: () => http.get<IBorrowRecord[]>("/borrow"),
    getById: (id: string) => http.get<IBorrowRecord>(`/borrow/${id}`),
    create: (data: IBorrowRecord) => http.post<IBorrowRecord>("/borrow", data),
    update: (id: string, data: Partial<IBorrowRecord>) =>
        http.put(`/borrow/${id}`, data),
    remove: (id: string) => http.delete(`/borrow/${id}`),

}

export default borrowApi;