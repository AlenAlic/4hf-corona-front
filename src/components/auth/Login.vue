<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-form ref="form" v-model="valid" @submit.prevent="login">
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ $t("auth.sign_in") }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              id="login-email"
              v-model="email"
              :rules="[$form.fieldRequired, $form.fieldIsEmail]"
              :label="$t('auth.email')"
              validate-on-blur
            />
            <v-text-field
              id="login-password"
              v-model="password"
              :rules="[$form.fieldRequired]"
              :label="$t('auth.password')"
              type="password"
            ></v-text-field>
            <v-checkbox id="login-remember_me" v-model="rememberMe" :label="$t('auth.remember_me')" required />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn id="login-sign_in" :disabled="!valid" :loading="loading" color="primary" text type="submit">
              {{ $t("auth.sign_in") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
    <v-col cols="12">
      <v-btn text :to="{ name: 'reset' }">
        {{ $t("auth.forgot_password") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { ERROR_CODES, getNetworkErrorCode } from "../../api/util/network-errors";
import i18n from "@/languages";
export default {
  data: function() {
    return {
      valid: false,
      email: "",
      password: "",
      rememberMe: false,
      loading: false
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.$auth
        .signIn(this.email, this.password, this.rememberMe)
        .then(() => {
          this.$router.push({
            name: "dashboard"
          });
        })
        .catch(error => {
          const status = getNetworkErrorCode(error);
          if (status === ERROR_CODES.UNAUTHORIZED) this.$toast.error(i18n.t("auth.errors.invalid_login"));
          else if (status === ERROR_CODES.FORBIDDEN) this.$toast.error(i18n.t("auth.errors.inactive_account"));
          this.loading = false;
        });
    }
  }
};
</script>
