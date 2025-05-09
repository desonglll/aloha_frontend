import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Enable sending cookies with requests
});

// Add request/response interceptors if needed
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Handle errors globally
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

export default api;
