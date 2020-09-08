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
  }
};
</script>

<style src="./assets/css/styles.scss" lang="scss"></style>
