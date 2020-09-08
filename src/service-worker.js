/* eslint-disable no-undef */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// install new service worker when ok, then reload page.
self.addEventListener("message", msg => {
  if (msg.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", () => {
  // it can be empty if you just want to get rid of that error
});

self.addEventListener("push", event => {
  const opts = event.data.json();
  const options = {
    body: opts.body
  };
  event.waitUntil(self.registration.showNotification(opts.title, options));
});

// self.addEventListener("push", event => {
//   const opts = event.data.json();
//   const options = {
//     body: opts.message,
//     icon: "https://image.flaticon.com/icons/png/512/573/573168.png,
//     actions: [
//       { action: "explore", title: "Go to the site", icon: "https://image.flaticon.com/icons/png/512/573/573168.png" },
//       { action: "close", title: "Close the notification", icon: "https://image.flaticon.com/icons/png/512/573/573168.png" }
//     ]
//   };
//   event.waitUntil(self.registration.showNotification(opts.title, options));
// });
