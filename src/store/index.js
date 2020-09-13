import Vue from "vue";
import Vuex from "vuex";
// modules
import auth from "./modules/auth";
import classes from "./modules/classes";
import people from "./modules/people";
import couples from "./modules/couples";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: auth,
    classes: classes,
    people: people,
    couples: couples
  }
});
