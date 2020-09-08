import Vue from "vue";

const SET_PEOPLE = "SET_PEOPLE";
const CLEAR_PEOPLE = "CLEAR_PEOPLE";

const PEOPLE = "PEOPLE";
const PEOPLE_REQUEST = "PEOPLE: Request sent.";
const PEOPLE_SUCCESS = "PEOPLE: Successful request.";
const PEOPLE_ERROR = "PEOPLE: Failed request.";

const CREATE_PERSON = "CREATE_PERSON";

export { PEOPLE, CREATE_PERSON };

export default {
  state: {
    people: [],
    loading: false
  },
  mutations: {
    [SET_PEOPLE](state, classes) {
      state.people = classes;
    },
    [CLEAR_PEOPLE](state) {
      state.people = [];
    },

    [PEOPLE_REQUEST](state) {
      state.loading = true;
    },
    [PEOPLE_SUCCESS](state) {
      state.loading = false;
    },
    [PEOPLE_ERROR](state) {
      state.loading = false;
    }
  },
  actions: {
    [SET_PEOPLE]: ({ commit }, token) => {
      commit(SET_PEOPLE, token);
    },
    [CLEAR_PEOPLE]: ({ commit }) => {
      commit(CLEAR_PEOPLE);
    },
    [PEOPLE]({ commit }) {
      commit(PEOPLE_REQUEST);
      return Vue.axios
        .get("person")
        .then(response => {
          commit(SET_PEOPLE, response.data);
          commit(PEOPLE_SUCCESS);
        })
        .catch(error => {
          commit(PEOPLE_ERROR);
          throw error;
        });
    },
    [CREATE_PERSON]({ commit }, { first_name, last_name, email, student_number }) {
      commit(PEOPLE_REQUEST);
      return Vue.axios
        .post("person", { first_name: first_name, last_name: last_name, email: email, student_number: student_number })
        .then(response => {
          commit(SET_PEOPLE, response.data);
          commit(PEOPLE_SUCCESS);
        })
        .catch(error => {
          commit(PEOPLE_ERROR);
          throw error;
        });
    }
  }
};
