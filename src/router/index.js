import Vue from "vue";
import VueRouter from "vue-router";

// Pages
const Home = () => import("../pages/Home");
const PageNotFound = () => import("../pages/PageNotFound.vue");

// Pages modules
import auth from "./modules/auth";
import debug from "./modules/debug";
import user from "./modules/user";

Vue.use(VueRouter);

const routes = [
  {
    path: "/index.html",
    alias: "/",
    component: Home
  },
  {
    path: "/",
    name: "home",
    component: Home
  },
  ...auth,
  ...debug,
  ...user,
  {
    path: "**",
    name: "PageNotFound",
    component: PageNotFound
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

/**
 * Handle routes that need authentication
 */
router.beforeEach((to, from, next) => {
  if (!Vue.prototype.$auth.isAuthenticated) {
    if (to.matched.filter(r => r.meta.auth).length > 0) {
      next({
        name: "home",
        query: {
          redirect: to.path
        }
      });
      return;
    }
  } else {
    if (to.name === "home" || (!to.name && to.fullPath === "/")) {
      next({ name: "dashboard" });
      return;
    } else {
      if (
        to.matched.filter(r => r.meta.access !== undefined && r.meta.access !== Vue.prototype.$auth.access).length > 0
      ) {
        next({ name: "home" });
        return;
      }
    }
  }
  next();
});

/**
 * Disable debug routes on production
 */
router.beforeEach((to, from, next) => {
  if (to.matched.filter(r => r.meta.debug).length > 0) {
    if (!Vue.prototype.$config.debug) {
      next({ name: "home" });
      return;
    }
  }
  next();
});

export default router;
