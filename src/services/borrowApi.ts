import http from "./http";

import {type IBorrowRecord} from "../types";

const borrowApi = {
    getAll: () => http.get<IBorrowRecord[]>("/borrow-record"),
    getById: (id: string) => http.get<IBorrowRecord>(`/borrow-record/${id}`),
    create: (data: IBorrowRecord) => http.post<IBorrowRecord>("/borrow-record", data),
    update: (data: Partial<IBorrowRecord>) =>
        http.put(`/borrow-record/${data._id}`, data),
    remove: (id: string) => http.delete(`/borrow-record/${id}`),
    toggleBadDebt: (id: string) => http.patch(`/borrow-record/toggle-bad-debt/${id}`),
    handleReturn: (id: string) => http.patch(`/borrow-record/toggle-returned/${id}`),

}

export default borrowApi;