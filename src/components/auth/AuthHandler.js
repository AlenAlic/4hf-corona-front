import store from "../../store";
import { LOGIN, LOGOUT, RENEW, CHANGE_PASSWORD } from "../../store/modules/auth";
import { authApi } from "../../api/auth";

const AuthHandler = {
  install(Vue) {
    Vue.prototype.$auth = {
      get user() {
        return store.state.auth.user;
      },
      get access() {
        return store.getters.access;
      },
      get isAuthenticated() {
        return !!this.user;
      },

      signIn(email, password, remember_me) {
        return store.dispatch(LOGIN, { email, password, remember_me });
      },
      renew() {
        return store.dispatch(RENEW);
      },
      signOut() {
        return store.dispatch(LOGOUT);
      },
      changePassword(current_password, new_password, repeat_password) {
        return store.dispatch(CHANGE_PASSWORD, { current_password, new_password, repeat_password });
      },
      activate(token, password, repeat_password) {
        return authApi.activate(token, password, repeat_password);
      },
      resetPassword(token, new_password, repeat_password) {
        return authApi.resetPassword(token, new_password, repeat_password);
      }
    };
  }
};

export default AuthHandler;
