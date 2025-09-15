// src/api/userApi.ts
import http from "./http";

export interface IUser {
    _id?: string;
    email: string;
    password?: string;
    role: "admin" | "guest";
    firstName?: string;
    lastName?: string;
    tel?: string;
}

const userApi = {
    // 注册
    register: (data: { email: string; password: string; role?: string }) =>
        http.post<IUser>("/user/register", data),

    // 登录
    login: (data: { email: string; password: string }) =>
        http.post<{ token: string; user: IUser }>("/user/login", data),

    // 获取所有用户（需要 admin）
    getAll: () => http.get<IUser[]>("/user"),

    // 删除用户（需要 admin）
    delete: (id: string) => http.delete(`/user/${id}`),

    // 更新用户（需要 admin）
    update: (id: string, data: Partial<IUser>) =>
        http.put(`/user/${id}`, data),
};

export default userApi;
