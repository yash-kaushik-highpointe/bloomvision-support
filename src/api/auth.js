import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/**
 * Authenticates user with Google OAuth code
 * @param {string} code - The authorization code from Google OAuth
 * @returns {Promise<Object>} - Response containing the authentication token
 */
export const authenticateWithCode = async (code) => {
  try {
    const response = await api.post("users/support/login/", { code });
    return response.data;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};
