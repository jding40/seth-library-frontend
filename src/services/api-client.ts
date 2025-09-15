// src/services/api-client.ts
import axiosInstance from "./http";

class ApiClient<T> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll = async (): Promise<T[]> => {
        const res = await axiosInstance.get<T[]>(this.endpoint);
        return res.data;
    };

    get = async (id: number | string): Promise<T> => {
        const res = await axiosInstance.get<T>(`${this.endpoint}/${id}`);
        return res.data;
    };

    post = async (data: T): Promise<T> => {
        const res = await axiosInstance.post<T>(this.endpoint, data);
        return res.data;
    };

    put = async (id: number | string, data: Partial<T>): Promise<T> => {
        const res = await axiosInstance.put<T>(`${this.endpoint}/${id}`, data);
        return res.data;
    };

    delete = async (id: number | string): Promise<void> => {
        await axiosInstance.delete(`${this.endpoint}/${id}`);
    };
}

export default ApiClient;