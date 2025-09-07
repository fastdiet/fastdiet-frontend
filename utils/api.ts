import axios from "axios";
import { getAccessToken } from "./secureTokens";
import { refreshAccessToken } from "@/services/refresh";
import { getBackendUrl } from "@/utils/getBackendUrl";
import i18n from "@/i18n";

const api = axios.create({
  baseURL: getBackendUrl(),
  timeout: 30000
});

api.interceptors.request.use(
  async (config) => {
    if (
      !config.url?.includes("/login") &&
      !config.url?.includes("/verify-google-token") &&
      !config.url?.includes("/refresh-token")
    ) {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const currentLanguage = i18n.language;
    if (currentLanguage) {
      config.headers["Accept-Language"] = currentLanguage;
    }

    if (config.data instanceof URLSearchParams) {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    return config;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.code = "TIMEOUT";
      return Promise.reject(error);
    }
    if (!error.response) {
      error.code = "ERR_NETWORK";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry &&
       !originalRequest.url?.includes("/login") &&
       !originalRequest.url?.includes("/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    if (error.response?.status >= 500) {
      throw new Error("serverError");
    }
    
    return Promise.reject(error);
  }
);

export default api;
