// Main components
import Vue from "vue";
import App from "./App.vue";
import AppNotLoaded from "./AppNotLoaded";

// Extensions
import router from "./router";
import store from "./store";
import i18n from "./languages";

// Service Worker
import "./registerServiceWorker";

// Install config independent modules
import vuetify from "./plugins/Vuetify";
import { frontendApi } from "./api/frontend";
import { backendServer } from "./api/backend";
import VueAxios from "vue-axios";
import AuthHandler from "./components/auth/AuthHandler";
Vue.use(AuthHandler);
import utilities from "./plugins/utilities";
Vue.use(utilities);
import form from "./plugins/form";
Vue.use(form);
import toast from "./plugins/toast";
Vue.use(toast);
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
Vue.use(VueSocketIOExt, io(process.env.SOCKET_URL, { autoConnect: false, transports: ["websocket"] }));

// External flag css
import "flag-icon-css/css/flag-icon.min.css";

// Turn off Vue Production tip
Vue.config.productionTip = false;

// Mount App function
async function main() {
  try {
    const config = await frontendApi.fetchConfig().catch(err => {
      throw err;
    });

    // Set config
    Vue.prototype.$config = config;
    Vue.prototype.$config.debug = config.debug || process.env.NODE_ENV === "development";

    // Set the baseURL according to the latest config and register the instance.
    backendServer.defaults.baseURL = Vue.prototype.$config.api.url;

    // Register the backend server as the Vue.axios instance.
    Vue.use(VueAxios, backendServer);

    new Vue({
      router,
      store,
      i18n,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  } catch (error) {
    new Vue({
      el: "#app",
      render: h => h(AppNotLoaded)
    }).$mount("#app");
  }
}

// Mount App
main().then(() => {});
