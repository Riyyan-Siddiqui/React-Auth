import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
} from "./tokenService";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true, // Sends httpOnly cookies with every request
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

// Request Interceptor - Attach access Token to every request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor - Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try to refresh if:
    // - We got 401 (unauthorized)
    // - Haven't already retried this request
    // - Not on auth endpoints (avoid infinite loops)

    if (error.response?.status === 429) {
      console.log("🚫 Rate limited (429) - NOT logging out user");
      return Promise.reject(error);
    }

    // handling authentication failures
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/signup")
    ) {
      // if already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the access token
        const res = await api.post("/auth/refresh");

        // Store the new access token

        if (res.data.accessToken) {
          setAccessToken(res.data.accessToken);
          console.log(res.data.accessToken)
        }

        //process all queued requests.
        processQueue();

        //retry the original request with new token
        return api(originalRequest);
      } catch (err) {
        // refresh failed - user session expired
        processQueue(err as Error);

        // Clear tokens and trigger logout
        setAccessToken(null);

        // Dispatch custom event that AuthContext can listen to
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
