<template>
  <v-app-bar dark app :clipped-left="breakpoint" color="primary">
    <v-app-bar-nav-icon v-if="!breakpoint" @click.stop="$emit('toggleDrawer')"></v-app-bar-nav-icon>

    <v-toolbar-title>{{ $t("app.title") }}</v-toolbar-title>

    <v-spacer />

    <v-menu v-if="$auth.isAuthenticated" bottom left offset-y>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" id="header-menu-btn">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item :to="{ name: 'profile' }" id="header-menu-profile">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t("general.profile") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ name: 'security' }" id="header-menu-security">
          <v-list-item-icon>
            <v-icon>mdi-account-lock</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t("general.security") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="signOut" id="header-menu-sign_out">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t("auth.sign_out") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    breakpoint: { type: Boolean, default: false }
  },
  methods: {
    signOut() {
      this.$auth.signOut().then(() => {
        this.$router.push({
          name: "home"
        });
      });
    }
  }
};
</script>
