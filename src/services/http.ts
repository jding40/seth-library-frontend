// src/api/http.ts
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// const token = localStorage.getItem("token");
// const authHeader = `Bearer ${token}`;

// create an axios instance
const http: AxiosInstance = axios.create({
  //baseURL: import.meta.env.PROD?"https://sethlibrary.vercel.app/api" : "https://localhost:5000/api", // 统一后端 API 前缀
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    //"Authorization": "Bearer " + localStorage.getItem("token"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// request interceptor: add token information in the request header
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      const authHeader = `Bearer ${token}`;

      if (token && config.headers) {
      config.headers.Authorization = authHeader;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unified Error Handling
http.interceptors.response.use(
  //(response: AxiosResponse) => response.data,
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 Not logged in / token expired
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login"; // 跳转登录页
    }
    return Promise.reject(error);
  }
);

export default http;
