import axios from "axios";
import toast from "react-hot-toast"; // Import hot-toast
import Router from "next/router";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Create a separate Axios instance for the refresh token request
const refreshAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Function to refresh the token
const refreshToken = async () => {
  try {
    const response = await refreshAxiosInstance.post("/auth/refresh-token", {
      refresh_token: getCookie("refresh_token"),
    });
    setCookie("token", response.data.token, { maxAge: 60 * 60 * 24 * 7 }); // Set new token
    return response.data.token;
  } catch (error) {
    deleteCookie("token");
    deleteCookie("refresh_token");
    Router.push("/login");
    return null;
  }
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }
    if (error.response && error.response.status === 403) {
      deleteCookie("token");
      toast.error("Your session has expired. Please log in again.");
      Router.push("/login");
    } else if (error.response) {
      const errorMessage =
        error.response.data?.error || "An error occurred while calling the API";
      toast.error(errorMessage);
    } else {
      toast.error(
        "Unable to connect to the server. Please check your internet connection."
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
