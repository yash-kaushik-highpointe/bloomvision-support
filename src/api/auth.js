import axios from "axios";

/**
 * Authenticates user with Google OAuth code
 * @param {string} baseURL - The base URL for the API
 * @param {string} code - The authorization code from Google OAuth
 * @returns {Promise<Object>} - Response containing the authentication token
 */
export const authenticateWithCode = async (baseURL, code) => {
  try {
    // For login requests, we don't want to include the token
    // So we'll use axios directly for this specific endpoint
    const response = await axios.post(`${baseURL}users/support/login/`, {
      code,
    });
    return response.data;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};
