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
const EDIT_CLASS = "EDIT_CLASS";
const DELETE_CLASS = "DELETE_CLASS";

const CLASSES_ADD_ATTENDEE = "CLASSES_ADD_ATTENDEE";
const CLASSES_EDIT_ATTENDEE = "CLASSES_EDIT_ATTENDEE";
const CLASSES_DELETE_ATTENDEE = "CLASSES_DELETE_ATTENDEE";

const CLASSES_ADD_COUPLE = "CLASSES_ADD_COUPLE";
const CLASSES_EDIT_COUPLE = "CLASSES_EDIT_COUPLE";
const CLASSES_DELETE_COUPLE = "CLASSES_DELETE_COUPLE";

const CLASSES_CREATE_COUPLE = "CLASSES_CREATE_COUPLE";

export {
  CLASSES,
  CREATE_CLASS,
  EDIT_CLASS,
  DELETE_CLASS,
  CLASSES_ADD_ATTENDEE,
  CLASSES_EDIT_ATTENDEE,
  CLASSES_DELETE_ATTENDEE,
  CLASSES_ADD_COUPLE,
  CLASSES_EDIT_COUPLE,
  CLASSES_DELETE_COUPLE,
  CLASSES_CREATE_COUPLE
};

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
      state.classes = newArr;
    },
    [DELETE_CLASS](state, id) {
      state.classes = state.classes.filter(p => p.id !== id);
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
          commit(CLASSES_SUCCESS);
          commit(SET_CLASSES, response.data);
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
          commit(CLASSES_SUCCESS);
          commit(SET_CLASSES, response.data);
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    },
    [EDIT_CLASS]({ commit }, { id, name, datetime }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .put(`dancing_class/${id}`, { name: name, datetime: datetime })
        .then(response => {
          commit(CLASSES_SUCCESS);
          commit(UPDATE_CLASS, response.data);
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    },
    [DELETE_CLASS]({ commit }, { id }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .delete(`dancing_class/${id}`)
        .then(() => {
          commit(CLASSES_SUCCESS);
          commit(DELETE_CLASS, id);
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    },
    [CLASSES_ADD_ATTENDEE]({ commit }, { id, person_id, notes }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .post(`dancing_class/${id}/add_attendee`, {
          person_id: person_id,
          notes: notes
        })
        .then(response => {
          commit(CLASSES_SUCCESS);
          return response;
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    },
    [CLASSES_EDIT_ATTENDEE]({ commit }, { id, dancing_class_person_id, person_id, notes }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .put(`dancing_class/${id}/attendee/${dancing_class_person_id}`, {
          person_id: person_id,
          notes: notes
        })
        .then(response => {
          commit(CLASSES_SUCCESS);
          return response;
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    },
    [CLASSES_DELETE_ATTENDEE]({ commit }, { id, dancing_class_person_id }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .delete(`dancing_class/${id}/attendee/${dancing_class_person_id}`)
        .then(response => {
          commit(CLASSES_SUCCESS);
          return response;
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    },
    [CLASSES_ADD_COUPLE]({ commit }, { id, couple_id }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .post(`dancing_class/${id}/add_couple`, {
          couple_id: couple_id
        })
        .then(response => {
          commit(CLASSES_SUCCESS);
          return response;
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    },
    [CLASSES_DELETE_COUPLE]({ commit }, { id, dancing_class_couple_id }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .delete(`dancing_class/${id}/couple/${dancing_class_couple_id}`)
        .then(response => {
          commit(CLASSES_SUCCESS);
          return response;
        })
        .catch(error => {
          commit(CLASSES_ERROR);
          throw error;
        });
    },
    [CLASSES_CREATE_COUPLE]({ commit }, { id, person_id, partner_id }) {
      commit(CLASSES_REQUEST);
      return Vue.axios
        .post(`dancing_class/${id}/create_couple`, {
          person_id: person_id,
          partner_id: partner_id
        })
        .then(response => {
          commit(CLASSES_SUCCESS);
          return response;
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
