import { AUTH } from "../config/constants";

/**
 * Stores the authentication token in localStorage
 * @param {string} token - The authentication token to store
 */
export const setToken = (token) => {
  localStorage.setItem(AUTH.TOKEN_KEY, token);
};

/**
 * Retrieves the authentication token from localStorage
 * @returns {string|null} - The stored token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(AUTH.TOKEN_KEY);
};

/**
 * Removes the authentication token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(AUTH.TOKEN_KEY);
};

/**
 * Checks if user is authenticated
 * @returns {boolean} - True if token exists, false otherwise
 */
export const isAuthenticated = () => {
  return !!getToken();
};

export const constructGoogleAuthUrl = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  const scope = "email profile";
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
};

export const redirectToGoogle = (url) => {
  window.location.href = url;
};
