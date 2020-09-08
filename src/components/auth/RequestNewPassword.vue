<template>
  <v-card>
    <transition name="fade" mode="out-in">
      <v-form ref="form" v-model="valid" v-if="!newPasswordSent" @submit.prevent="requestPassword">
        <v-card-title>{{ $t("auth.request_new_password") }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="email" :rules="[$form.fieldIsEmail]" :label="$t('auth.email')" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="!valid" :loading="loading" color="primary" text type="submit">
            {{ $t("auth.request_new_password") }}
          </v-btn>
          <v-btn text exact :to="{ name: 'home' }">
            {{ $t("general.cancel") }}
          </v-btn>
        </v-card-actions>
      </v-form>
      <div v-else>
        <v-card-title>{{ $t("auth.password_reset_email_sent.title") }}</v-card-title>
        <v-card-text>{{ $t("auth.password_reset_email_sent.text", { email: email }) }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" exact :to="{ name: 'home' }">
            {{ $t("general.back_to_home_page") }}
          </v-btn>
        </v-card-actions>
      </div>
    </transition>
  </v-card>
</template>

<script>
import { authApi } from "../../api/auth";
export default {
  data: function() {
    return {
      newPasswordSent: false,
      valid: false,
      email: "",
      loading: false
    };
  },
  methods: {
    requestPassword() {
      this.loading = true;
      authApi.resetPasswordRequest(this.email).then(() => {
        this.newPasswordSent = true;
      });
    }
  }
};
</script>
