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
    if (error.response && error.response.status === 403) {
      // Token is expired or invalid
      deleteCookie("token"); // Remove the expired token
      toast.error("Your session has expired. Please log in again."); // Use hot-toast
      Router.push("/login"); // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
