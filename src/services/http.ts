// src/api/http.ts
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const token = localStorage.getItem("token");
const authHeader = `Bearer ${token}`;

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  //baseURL: import.meta.env.PROD?"https://sethlibrary.vercel.app/api" : "https://localhost:5000/api", // 统一后端 API 前缀
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    //"Authorization": "Bearer " + localStorage.getItem("token"),
    Authorization: authHeader,
  },
});

// 请求拦截器：在请求头中加 token
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token"); // 登录时存储的 JWT
    if (token && config.headers) {
      config.headers.Authorization = authHeader;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一错误处理
http.interceptors.response.use(
  //(response: AxiosResponse) => response.data,
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 未登录 / token 过期
      alert("登录已过期，请重新登录");
      localStorage.removeItem("token");
      window.location.href = "/login"; // 跳转登录页
    }
    return Promise.reject(error);
  }
);

export default http;
