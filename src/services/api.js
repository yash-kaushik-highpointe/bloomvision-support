import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create();

let isRedirecting = false;

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      if (isRedirecting) {
        return Promise.reject(error);
      }

      isRedirecting = true;

      localStorage.removeItem("support_access_token");
      localStorage.removeItem("support_refresh_token");
      localStorage.removeItem("support_role");

      toast.error("Session Expired. Please Login again");

      window.dispatchEvent(new CustomEvent("sessionExpired"));
    }
    return Promise.reject(error);
  }
);

export default api;
