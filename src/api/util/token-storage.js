// Prefix for token storage
const TOKEN_PREFIX = "vfb";

// Storage keys
export const STORAGE = {
  AUTH_TOKEN: "auth_token",
  COOKIES: "cookies"
};

/**
 * @typedef {string} EncodedJwtToken
 */

/**
 * Gets the key with a prefix
 * @param type
 * @returns {string}
 */
function getStorageKey(type) {
  return `${TOKEN_PREFIX}.${type}`;
}

/**
 * Gets item saved in localStorage
 * @param type
 * @returns {string}
 */
export function loadItem(type) {
  const key = getStorageKey(type);
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return localStorage.getItem(key);
  }
}

/**
 * Sets item in localStorage
 * @param type
 * @param item - The item, if null the saved token is removed.
 */
export function saveItem(type, item) {
  const key = getStorageKey(type);
  if (item) {
    localStorage.setItem(key, JSON.stringify(item));
  } else {
    localStorage.removeItem(key);
  }
}
