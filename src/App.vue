<template>
  <v-app>
    <app-header v-if="$auth.isAuthenticated" :breakpoint="breakpoint" @toggleDrawer="drawer = !drawer" />
    <app-navigation-drawer v-if="$auth.isAuthenticated" :breakpoint="breakpoint" v-model="drawer" />
    <v-content>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </v-content>
    <app-footer />
  </v-app>
</template>

<script>
import AppHeader from "./components/app/AppHeader";
import AppFooter from "./components/app/AppFooter";
import AppNavigationDrawer from "./components/app/AppNavigationDrawer";
import { DELETE_PERSON, SET_PEOPLE, UPDATE_PERSON } from "@/store/modules/people";
import { DELETE_CLASS, SET_CLASSES, UPDATE_CLASS } from "@/store/modules/classes";
import { DELETE_COUPLE, SET_COUPLES, UPDATE_COUPLE } from "@/store/modules/couples";
export default {
  components: {
    AppNavigationDrawer,
    AppHeader,
    AppFooter
  },
  data: function() {
    return {
      drawer: null
    };
  },
  created() {
    this.$nextTick(function() {
      this.$auth.renew();
    });
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.lgAndUp;
    }
  },
  sockets: {
    person_created(people) {
      this.$store.commit(SET_PEOPLE, people);
    },
    person_updated(person) {
      this.$store.commit(UPDATE_PERSON, person);
    },
    person_deleted(id) {
      this.$store.commit(DELETE_PERSON, id);
    },
    couple_created(couples) {
      this.$store.commit(SET_COUPLES, couples);
    },
    couple_updated(couple) {
      this.$store.commit(UPDATE_COUPLE, couple);
    },
    couple_deleted(id) {
      this.$store.commit(DELETE_COUPLE, id);
    },
    dancing_class_updated(dancing_class) {
      this.$store.commit(UPDATE_CLASS, dancing_class);
    },
    dancing_class_created(dancing_classes) {
      this.$store.commit(SET_CLASSES, dancing_classes);
    },
    dancing_class_deleted(id) {
      this.$store.commit(DELETE_CLASS, id);
    }
  }
};
</script>

<style src="./assets/css/styles.scss" lang="scss"></style>
