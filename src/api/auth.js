import { backendServer } from "./backend";

export const authApi = {
  /**
   * Starts a new authenticated user session
   * @param {string} email - The email of the user that identifies them.
   * @param {string} password - The password to login with.
   * @param {boolean} remember_me - Toggle if the user should be remembered (longer lasting token)
   * @returns {Promise<void>}
   */
  async login(email, password, remember_me = false) {
    return await backendServer.post("/auth/login", {
      email: email,
      password: password,
      remember_me: remember_me
    });
  },
  /**
   * Ends the active user session
   * The interceptors are expected to inject the session token of the session that will be ended.
   * @returns {Promise<void>}
   */
  async logout() {
    await backendServer.delete("/auth/logout");
  },
  /**
   * Renews the authenticated user session, returns an updated token
   * @returns {Promise<void>}
   */
  async renew() {
    return await backendServer.get("/auth/renew");
  },
  /**
   * Register a user
   * @param {string} first_name
   * @param {string} last_name
   * @param {string} email
   * @returns {Promise<void>}
   */
  async register(first_name, last_name, email) {
    return await backendServer.post("/auth/register", {
      first_name: first_name,
      last_name: last_name,
      email: email
    });
  },
  /**
   * Activates a user's account with a given activation token.
   * @param {string} token
   * @param {string} password
   * @param {string} repeat_password - Repeat of the new password.
   * @returns {Promise<void>}
   */
  async activate(token, password, repeat_password) {
    return await backendServer.post(`/auth/activate/${token}`, {
      password: password,
      repeat_password: repeat_password
    });
  },
  /**
   * Sends a request for to reset a user's password.
   * @param {string} email
   * @returns {Promise<void>}
   */
  async resetPasswordRequest(email) {
    return await backendServer.post("/auth/password/reset", {
      email: email
    });
  },
  /**
   * Reset a user's password with a given token.
   * @param {string} token
   * @param {string} new_password
   * @param {string} repeat_password - Repeat of the new password.
   * @returns {Promise<void>}
   */
  async resetPassword(token, new_password, repeat_password) {
    return await backendServer.post(`/auth/password/reset/${token}`, {
      new_password: new_password,
      repeat_password: repeat_password
    });
  },
  /**
   * Reset a user's password with a given token.
   * @param {string} current_password - Current password.
   * @param {string} new_password - New password.
   * @param {string} repeat_password - Repeat of the new password.
   * @returns {Promise<void>}
   */
  async changePassword(current_password, new_password, repeat_password) {
    return await backendServer.patch("/auth/password/change", {
      current_password: current_password,
      new_password: new_password,
      repeat_password: repeat_password
    });
  }
};
