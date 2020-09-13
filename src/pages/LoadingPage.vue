<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" class="text-center">
      <v-col cols="12">
        <v-progress-circular color="primary" :size="80" :width="8" indeterminate />
      </v-col>
      <v-col cols="12">
        <h3>{{ $t("general.loading") }}</h3>
      </v-col>
    </v-row>
  </v-container>
</template>
