import decode from "jwt-decode";
import { loadItem, STORAGE } from "../api/util/token-storage";

/**
 * User class. Generated from JWT token.
 * @property {number} id
 * @property {string} email
 * @property {Date} expiresAt
 * @property {Date} issuedAt
 * @property {EncodedJwtToken} token
 */
export class User {
  /** @member {EncodedJwtToken} */
  token;
  /** @member {number} */
  id;
  /** @member {string} */
  email;
  /** @member {Date} */
  expiresAt;
  /** @member {Date} */
  issuedAt;
  /** @member {number} */
  access;

  /**
   * @param {EncodedJwtToken} token
   */
  constructor(token) {
    if (token) {
      this.token = token;
      const data = decode(token);
      this.id = data.id;
      this.email = data.email;
      this.access = data.access;
      // Assumption: exp and iat fields are number of milliseconds since 1970
      this.expiresAt = new Date(data.exp * 1000);
      this.issuedAt = new Date(data.iat * 1000);
    }
  }

  /**
   * Indicates if the authenticated user instance is valid; requirements are:
   * - expiration moment is in the future
   * - issue moment before expiration moment
   * @returns {boolean}
   */
  get isValid() {
    return this.id && this.expiresAt > new Date() && this.expiresAt > this.issuedAt;
  }
}

export const getUser = () => {
  const token = loadItem(STORAGE.AUTH_TOKEN);
  const user = new User(token);
  return !!user && user.isValid ? user : null;
};
