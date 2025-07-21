import axios from "axios";

// Create axios instance with default config
const api = axios.create();

// Request interceptor to automatically add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("support_access_token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login if needed
      localStorage.removeItem("support_access_token");
      localStorage.removeItem("support_refresh_token");
      localStorage.removeItem("support_role");
      // You can add redirect logic here if needed
    }
    return Promise.reject(error);
  }
);

export default api;
