<template>
  <center-container>
    <v-card>
      <v-card-title>{{ $t("page_not_found.title") }}</v-card-title>
      <v-card-text>{{ $t("page_not_found.text") }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text exact color="primary" :to="{ name: 'home' }">
          {{ $t("general.back_to_home_page") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </center-container>
</template>

<script>
import CenterContainer from "../components/containers/CenterContainer";
export default {
  components: {
    CenterContainer
  }
};
</script>
