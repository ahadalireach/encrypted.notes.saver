import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);

    if (error.response) {
      const message = error.response.data.message || "Something went wrong";
      if (error.response.status !== 401) {
        toast.error(message);
      }
    } else if (error.request) {
      toast.error(
        "No response from server. Please check your internet connection."
      );
    } else {
      toast.error("Error setting up request: " + error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
