<template>
  <v-app-bar dark app :clipped-left="breakpoint" color="primary">
    <v-app-bar-nav-icon v-if="!breakpoint" @click.stop="$emit('toggleDrawer')"></v-app-bar-nav-icon>

    <v-toolbar-title v-if="breakpoint">{{ $t("app.title") }}</v-toolbar-title>
    <v-toolbar-title v-else class="pl-2">{{ $t("app.title_short") }}</v-toolbar-title>
    <v-icon class="ml-5" :color="$socket.connected ? 'success' : 'error'" @click="toggleConnection">
      mdi-checkbox-blank-circle
    </v-icon>

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
  // created() {
  //   this.connectSocket();
  // },
  methods: {
    signOut() {
      this.$auth.signOut().then(() => {
        this.$router.push({
          name: "home"
        });
      });
    },
    toggleConnection() {
      if (this.$socket.connected) {
        this.disconnectSocket();
      } else {
        this.connectSocket();
      }
    },
    connectSocket() {
      this.$socket.client.io.opts.query = { token: this.$store.state.auth.token };
      this.$socket.client.open();
    },
    disconnectSocket() {
      this.$socket.client.close();
    }
  },
  beforeDestroy() {
    this.disconnectSocket();
  }
};
</script>
