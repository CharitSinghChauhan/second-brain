import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  timeout: 1000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface retryAxiosConfig extends InternalAxiosRequestConfig {
  _retry: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalReq = error.config as retryAxiosConfig;

    if (error.response?.status === 400 && !originalReq._retry) {
      originalReq._retry = true;
      try {
        console.log("inside the interceptors refreshToken");
        await api.get("/auth/refreshToken");
        return api(originalReq);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
