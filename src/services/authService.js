import { setToken, getToken, removeToken } from "../utils/auth";

class AuthService {
  /**
   * Login the user and store the token
   * @param {string} token - The authentication token
   */
  login(token) {
    setToken(token, "support_access_token");
  }

  /**
   * Logout the user and remove the token
   */
  logout() {
    removeToken("support_access_token");
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated() {
    return !!getToken("support_access_token");
  }

  /**
   * Get the current authentication token
   * @returns {string|null} - The authentication token
   */
  getCurrentToken() {
    return getToken("support_access_token");
  }
}

export const authService = new AuthService();
