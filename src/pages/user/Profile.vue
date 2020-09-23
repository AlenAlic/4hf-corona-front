<template>
  <v-container class="py-0">
    <v-row>
      <v-col col="12" md="6" lg="4" xl="3">
        <profile-card v-if="$store.state.auth.profile" />
        <v-boilerplate
          v-else-if="$store.state.auth.loadingProfile"
          :skeletons="['card-heading', 'list-item-two-line', 'list-item-two-line', 'actions']"
        ></v-boilerplate>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import VBoilerplate from "../../components/Vuetify/VBoilerplate";
import ProfileCard from "../../components/user/ProfileCard";
export default {
  components: {
    VBoilerplate,
    ProfileCard
  }
};
</script>
