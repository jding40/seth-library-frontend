// src/api/userApi.ts
import http from "./http";

export interface IUser {
    _id?: string;
    email: string;
    password?: string;
    role: "admin" | "user"| "guest";
    firstName?: string;
    lastName?: string;
    tel?: string;
}

const userApi = {
    // Sign up
    register: (data: Record<string, string>) =>
        http.post<IUser>("/user/register", data),

    // Log in
    login: (data: { email: string; password: string }) =>
        http.post<{ token: string; user: IUser }>("/user/login", data),

    // ger all users（user role has to be admin）
    getAll: () => http.get<IUser[]>("/user"),

    // delete a user（user role has to be admin）
    delete: (id: string) => http.delete(`/user/${id}`),

    // update a user（user role has to be admin）
    update: (id: string, data: Partial<IUser>) =>
        http.put(`/user/${id}`, data),

    switchRole: (userId:string)=>http.get(`/user/switch-role/${userId}`),
};

export default userApi;
