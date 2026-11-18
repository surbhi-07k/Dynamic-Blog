
import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach the correct authentication token
API.interceptors.request.use(
    (config) => {
        const token = config.useUserToken
            ? localStorage.getItem("userToken")
            : localStorage.getItem("adminToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }

        delete config.useUserToken;

        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
