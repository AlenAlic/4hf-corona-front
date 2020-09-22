import Vue from "vue";

const SET_COUPLES = "SET_COUPLES";
const CLEAR_COUPLES = "CLEAR_COUPLES";
const UPDATE_COUPLE = "UPDATE_COUPLE";

const COUPLES = "COUPLES";
const COUPLES_REQUEST = "COUPLES: Request sent.";
const COUPLES_SUCCESS = "COUPLES: Successful request.";
const COUPLES_ERROR = "COUPLES: Failed request.";

const CREATE_COUPLE = "CREATE_COUPLE";
const EDIT_COUPLE = "EDIT_COUPLE";
const DELETE_COUPLE = "DELETE_COUPLE";

export { COUPLES, CREATE_COUPLE, EDIT_COUPLE, DELETE_COUPLE, UPDATE_COUPLE, SET_COUPLES };

export default {
  state: {
    couples: [],
    loading: false
  },
  mutations: {
    [SET_COUPLES](state, classes) {
      state.couples = classes;
    },
    [CLEAR_COUPLES](state) {
      state.couples = [];
    },
    [UPDATE_COUPLE](state, dancing_class) {
      const index = state.couples.findIndex(c => c.id === dancing_class.id);
      let newArr = state.couples.map(c => c);
      newArr[index] = dancing_class;
      state.couples = newArr;
    },
    [DELETE_COUPLE](state, id) {
      state.couples = state.couples.filter(c => c.id !== id);
    },

    [COUPLES_REQUEST](state) {
      state.loading = true;
    },
    [COUPLES_SUCCESS](state) {
      state.loading = false;
    },
    [COUPLES_ERROR](state) {
      state.loading = false;
    }
  },
  actions: {
    [SET_COUPLES]: ({ commit }, token) => {
      commit(SET_COUPLES, token);
    },
    [CLEAR_COUPLES]: ({ commit }) => {
      commit(CLEAR_COUPLES);
    },
    [COUPLES]({ commit }) {
      commit(COUPLES_REQUEST);
      return Vue.axios
        .get("couple")
        .then(response => {
          commit(COUPLES_SUCCESS);
          commit(SET_COUPLES, response.data);
        })
        .catch(error => {
          commit(COUPLES_ERROR);
          throw error;
        });
    },
    [CREATE_COUPLE]({ commit }, { lead_id, follow_id }) {
      commit(COUPLES_REQUEST);
      return Vue.axios
        .post("couple", { lead_id: lead_id, follow_id: follow_id })
        .then(response => {
          commit(COUPLES_SUCCESS);
          commit(SET_COUPLES, response.data);
        })
        .catch(error => {
          commit(COUPLES_ERROR);
          throw error;
        });
    },
    [EDIT_COUPLE]({ commit }, { id, lead_id, follow_id }) {
      commit(COUPLES_REQUEST);
      return Vue.axios
        .put(`couple/${id}`, {
          lead_id: lead_id,
          follow_id: follow_id
        })
        .then(response => {
          commit(COUPLES_SUCCESS);
          commit(UPDATE_COUPLE, response.data);
          return id;
        })
        .catch(error => {
          commit(COUPLES_ERROR);
          throw error;
        });
    },
    [DELETE_COUPLE]({ commit }, { id }) {
      commit(COUPLES_REQUEST);
      return Vue.axios
        .delete(`couple/${id}`)
        .then(() => {
          commit(COUPLES_SUCCESS);
          commit(DELETE_COUPLE, id);
          return id;
        })
        .catch(error => {
          commit(COUPLES_ERROR);
          throw error;
        });
    }
  }
};
