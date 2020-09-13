<template>
  <v-navigation-drawer :value="drawer" @input="toggleDrawer" :clipped="breakpoint" :permanent="breakpoint" app>
    <v-list dense>
      <v-row class="mb-3" justify="center">
        <v-img alt="Logo Vue" src="../../assets/logo-vuetify.svg" max-height="80" max-width="80" />
      </v-row>
      <v-list-item :to="{ name: 'dashboard' }">
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t("navigation_drawer.dashboard") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="{ name: 'classes' }">
        <v-list-item-icon>
          <v-icon>mdi-book-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t("navigation_drawer.classes") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="{ name: 'people' }">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t("navigation_drawer.people") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="{ name: 'couple' }">
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t("navigation_drawer.couples") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-1" />
      <v-list-item>
        <v-list-item-icon></v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $t("navigation_drawer.todays_classes") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-for="c in $store.getters.todays_classes" :key="c.id" :to="{ name: 'class', params: { id: c.id } }">
        <v-list-item-icon>
          <v-icon>mdi-book-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ c.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ $util.dateTimeString(c.datetime) }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { CLASSES } from "@/store/modules/classes";

export default {
  props: {
    breakpoint: { type: Boolean, default: false },
    drawer: { type: Boolean, default: null }
  },
  model: {
    prop: "drawer",
    event: "input"
  },
  data: function() {
    return {
      classes: []
    };
  },
  created() {
    this.$store.dispatch(CLASSES);
  },
  methods: {
    toggleDrawer(flag) {
      this.$emit("input", flag);
    }
  }
};
</script>
