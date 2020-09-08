import Vue from "vue";
import { dateTimeToday, nowString } from "@/plugins/utilities";

const SET_CLASSES = "SET_CLASSES";
const CLEAR_CLASSES = "CLEAR_CLASSES";
const UPDATE_CLASS = "UPDATE_CLASS";

const CLASSES = "CLASSES";
const CLASSES_REQUEST = "CLASSES: Request sent.";
const CLASSES_SUCCESS = "CLASSES: Successful request.";
const CLASSES_ERROR = "CLASSES: Failed request.";

const CREATE_CLASS = "CREATE_CLASS";

export { CLASSES, CREATE_CLASS };

export default {
  state: {
    classes: [],
    loading: false
  },
  mutations: {
    [SET_CLASSES](state, classes) {
      state.classes = classes;
    },
    [CLEAR_CLASSES](state) {
      state.classes = [];
    },
    [UPDATE_CLASS](state, dancing_class) {
      const index = state.classes.findIndex(c => c.id === dancing_class.id);
      let newArr = state.classes.map(c => c);
      newArr[index] = dancing_class;
      state.classes[index] = newArr;
    },

    [CLASSES_REQUEST](state) {
      state.loading = true;
    },
    [CLASSES_SUCCESS](state) {
      state.loading = false;
    },
    [CLASSES_ERROR](state) {
      state.loading = false;
    }
  },
  actions: {
    [SET_CLASSES]: ({ commit }, token) => {
      commit(SET_CLASSES, token);
    },
    [CLEAR_CLASSES]: ({ commit }) => {
      commit(CLEAR_CLASSES);
    },
    [CLASSES]({ commit }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .get("dancing_class")
        .then(response => {
          commit(SET_CLASSES, response.data);
          commit(CLASSES_SUCCESS);
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    },
    [CREATE_CLASS]({ commit }, { name, datetime }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .post("dancing_class", { name: name, datetime: datetime })
        .then(response => {
          commit(SET_CLASSES, response.data);
          commit(CLASSES_SUCCESS);
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    }
  },
  getters: {
    todays_classes: state => {
      return state.classes.filter(c => dateTimeToday(c.datetime) === dateTimeToday(nowString()));
    }
  }
};
