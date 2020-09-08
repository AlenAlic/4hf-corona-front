<template>
  <center-container>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="updateProfile">
      <v-card>
        <v-card-title>{{ $t("auth.register.title") }}</v-card-title>
        <v-card-text>
          <v-text-field
            id="register-first_name"
            v-model="firstName"
            :label="$t('auth.register.first_name')"
            :rules="[$form.fieldRequired]"
          />
          <v-text-field
            id="register-last_name"
            v-model="lastName"
            :label="$t('auth.register.last_name')"
            :rules="[$form.fieldRequired]"
          />
          <v-text-field
            id="register-email"
            v-model="email"
            :label="$t('auth.email')"
            :rules="[$form.fieldRequired, $form.fieldIsEmail]"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="!valid" :loading="loading" color="primary" text type="submit">
            {{ $t("auth.register.btn") }}
          </v-btn>
          <v-btn text exact :to="{ name: 'home' }">
            {{ $t("general.cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </center-container>
</template>

<script>
import { authApi } from "../../api/auth";
import CenterContainer from "../containers/CenterContainer";
export default {
  components: { CenterContainer },
  data: function() {
    return {
      valid: false,
      firstName: "",
      lastName: "",
      email: ""
    };
  },
  methods: {
    resetForm() {
      this.$refs.form.reset();
    },
    register() {
      authApi.register(this.firstName, this.lastName, this.firstName).then(() => {
        this.resetForm();
      });
    }
  }
};
</script>
