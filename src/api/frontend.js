import axios from "axios";

/**
 * @typedef {Object} AppConfig
 * @property {boolean} debug
 * @property {Object} api
 * @property {string} api.url
 * @property {Object} cookies
 * @property {boolean} cookies.enabled
 * @property {string} cookies.type
 */

/**
 * The axios instance which can be used to communicate with the frontend that hosts the app.
 * @type {AxiosInstance}
 */
export const frontendServer = axios.create();
frontendServer.defaults.baseURL = "/";
frontendServer.defaults.headers.common["Content-Type"] = "application/json";

/**
 * Provides access to special files hosted on the frontend server
 */
export const frontendApi = {
  /**
   * Fetches the json config from the frontend server.
   * The fetch is env aware (dev, production, testing)
   *
   * Fetches: /public/config/<env>.json
   *
   * @returns {Object}
   */
  async fetchConfig() {
    const configFileName = process.env.NODE_ENV === "production" ? "config" : process.env.NODE_ENV;
    const response = await frontendServer.get(`config/${configFileName}.json`);
    return response.data;
  }
};
