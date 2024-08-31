import axios from "axios";
import toast from "react-hot-toast"; // Import hot-toast
import Router from "next/router";
import { deleteCookie, getCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

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
  (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        // Token is expired or invalid
        deleteCookie("token");
        toast.error("Your session has expired. Please log in again.");
        Router.push("/login");
      } else {
        // Handle other API errors
        const errorMessage =
          error.response.data?.error ||
          "An error occurred while calling the API";
        toast.error(errorMessage);
      }
    } else {
      // Handle network errors or other issues
      toast.error(
        "Unable to connect to the server. Please check your internet connection."
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
