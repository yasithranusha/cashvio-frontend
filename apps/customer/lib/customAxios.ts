import { refreshToken } from "@/actions/auth";
import { getSession } from "@/lib/session";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { BACKEND_URL } from "@/lib/constants";

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface CustomAxiosConfig extends AxiosRequestConfig {
  _retry?: boolean;
  headers: AxiosRequestConfig["headers"];
}

const createAxiosClient = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
  });

  axiosInstance.interceptors.request.use(async (config) => {
    const session = await getSession();
    config.headers = config.headers || {};

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as CustomAxiosConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const session = await getSession();

        if (!session?.refreshToken) {
          throw new Error("Refresh token not found!");
        }

        const newAccessToken = await refreshToken(session.refreshToken);
        if (newAccessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const axiosClient = createAxiosClient();
