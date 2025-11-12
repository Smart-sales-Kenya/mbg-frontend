import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Sends cookies, required for CSRF
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to set CSRF token dynamically
export const setCsrfToken = (token: string) => {
  apiClient.defaults.headers["X-CSRFToken"] = token;
};

export default apiClient;
