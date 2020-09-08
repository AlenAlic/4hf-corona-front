<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <div class="text-center">
        <h1>{{ $route.name }}</h1>
        <h3 v-if="message">{{ message }}</h3>
        <img alt="Vue logo" src="../assets/logo-vue.png" style="height: 180px;" />
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    message: { type: String, default: "" }
  }
};
</script>
