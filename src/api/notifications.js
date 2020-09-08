/* eslint-disable no-console */

import { backendServer } from "./backend";

export const checkForNotificationSupport = () => {
  return "PushManager" in window && "Notification" in window;
};

export const askPermission = () => {
  // Check permission with support for old and new API
  // https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#requesting_permission
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission(result => {
      resolve(result);
    });
    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(permissionResult => {
    if (permissionResult !== "granted") {
      throw new Error("Notification permission denied.");
    }
  });
};

export const swRegistration = async () => {
  return await navigator.serviceWorker.getRegistration();
};

export const pmSubscription = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
};

export const subscribeUserToPush = async () => {
  // Get public key
  const response = await notificationsApi.publicKey();
  // Subscription options
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: response.data
  };
  // Get registration
  const registration = await swRegistration();
  return await registration.pushManager.subscribe(subscribeOptions).catch(e => {
    if (Notification.permission === "denied") {
      console.warn("Permission for notifications was denied");
    } else {
      console.error("Failed to subscribe the user: ", e);
    }
  });
};

export const unsubscribeUserFromPush = () => {
  const subscription = pmSubscription();
  if (subscription) return subscription.unsubscribe();
  notificationsApi.unsubscribe();
};

export const notificationsApi = {
  /**
   * Gets the public key
   * @returns {Promise<void>}
   */
  async publicKey() {
    return await backendServer.get("/notifications/public_key");
  },
  /**
   * Subscribe to notifications
   * @param {Object} subscription
   * @returns {Promise<void>}
   */
  async subscribe(subscription) {
    const subscriptionObject = JSON.parse(JSON.stringify(subscription));
    return await backendServer.post("/notifications/subscribe", subscriptionObject);
  },
  /**
   * Unsubscribe from notifications
   * @returns {Promise<void>}
   */
  async unsubscribe(endpoint) {
    return await backendServer.post("/notifications/unsubscribe", {
      endpoint: endpoint
    });
  }
};
