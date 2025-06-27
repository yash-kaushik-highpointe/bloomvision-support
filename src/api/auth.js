import axios from "axios";

/**
 * Authenticates user with Google OAuth code
 * @param {string} baseURL - The base URL for the API
 * @param {string} code - The authorization code from Google OAuth
 * @returns {Promise<Object>} - Response containing the authentication token
 */
export const authenticateWithCode = async (baseURL, code) => {
  try {
    const api = axios.create({
      baseURL: baseURL,
    });
    const response = await api.post("users/support/login/", { code });
    return response.data;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};
