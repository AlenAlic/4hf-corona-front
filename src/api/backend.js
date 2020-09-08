import Vue from "vue";
import axios from "axios";
import router from "../router";
import { ERROR_CODES, getNetworkErrorCode, localizeNetworkErrorCode } from "../api/util/network-errors";
import { loadItem, STORAGE } from "../api/util/token-storage";

/**
 * The axios instance which can be used to communicate with the backend.
 * @type {AxiosInstance}
 */
export const backendServer = axios.create();
// backendServer.defaults.withCredentials = true;
backendServer.defaults.headers.common["Content-Type"] = "application/json";
backendServer.interceptors.response.use(
  response => {
    return Promise.resolve(response);
  },
  error => {
    const errorCode = getNetworkErrorCode(error);
    if (errorCode === ERROR_CODES.NETWORK) {
      Vue.$toast.error(localizeNetworkErrorCode(errorCode));
      return Promise.reject(error);
    }
    if (errorCode === ERROR_CODES.UNAUTHORIZED && router.currentRoute.meta.auth) {
      router.push({ name: "home" }).then(() => {});
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
backendServer.interceptors.request.use(async request => {
  // Inject authorization token if present
  const token = loadItem(STORAGE.AUTH_TOKEN);
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
  return request;
});
