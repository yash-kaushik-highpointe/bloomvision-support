import { setToken, getToken, removeToken } from "../utils/auth";

class AuthService {
  /**
   * Login the user and store the token
   * @param {string} token - The authentication token
   */
  login(token) {
    setToken(token);
  }

  /**
   * Logout the user and remove the token
   */
  logout() {
    removeToken();
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated() {
    return !!getToken();
  }

  /**
   * Get the current authentication token
   * @returns {string|null} - The authentication token
   */
  getCurrentToken() {
    return getToken();
  }
}

export const authService = new AuthService();
