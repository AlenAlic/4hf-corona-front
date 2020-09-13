import Vue from "vue";

const SET_PEOPLE = "SET_PEOPLE";
const CLEAR_PEOPLE = "CLEAR_PEOPLE";
const UPDATE_PERSON = "UPDATE_PERSON";

const PEOPLE = "PEOPLE";
const PEOPLE_REQUEST = "PEOPLE: Request sent.";
const PEOPLE_SUCCESS = "PEOPLE: Successful request.";
const PEOPLE_ERROR = "PEOPLE: Failed request.";

const CREATE_PERSON = "CREATE_PERSON";
const EDIT_PERSON = "EDIT_PERSON";
const DELETE_PERSON = "DELETE_PERSON";

export { PEOPLE, CREATE_PERSON, EDIT_PERSON, DELETE_PERSON };

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
    [UPDATE_PERSON](state, person) {
      const index = state.people.findIndex(p => p.id === person.id);
      let newArr = state.people.map(p => p);
      newArr[index] = person;
      state.people = newArr;
    },
    [DELETE_PERSON](state, id) {
      state.people = state.people.filter(p => p.id !== id);
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
          commit(PEOPLE_SUCCESS);
          commit(SET_PEOPLE, response.data);
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
          commit(PEOPLE_SUCCESS);
          commit(SET_PEOPLE, response.data);
        })
        .catch(error => {
          commit(PEOPLE_ERROR);
          throw error;
        });
    },
    [EDIT_PERSON]({ commit }, { id, first_name, last_name, email, student_number }) {
      commit(PEOPLE_REQUEST);
      return Vue.axios
        .put(`person/${id}`, {
          first_name: first_name,
          last_name: last_name,
          email: email,
          student_number: student_number
        })
        .then(response => {
          commit(PEOPLE_SUCCESS);
          commit(UPDATE_PERSON, response.data);
        })
        .catch(error => {
          commit(PEOPLE_ERROR);
          throw error;
        });
    },
    [DELETE_PERSON]({ commit }, { id }) {
      commit(PEOPLE_REQUEST);
      return Vue.axios
        .delete(`person/${id}`)
        .then(() => {
          commit(PEOPLE_SUCCESS);
          commit(DELETE_PERSON, id);
        })
        .catch(error => {
          commit(PEOPLE_ERROR);
          throw error;
        });
    }
  }
};
