<template>
  <center-container>
    <v-form ref="form" v-model="valid" @submit.prevent="activate">
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>{{ $t("auth.activate.title") }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          {{ $t("auth.activate.set_password") }}
          <v-text-field
            v-model="password"
            :label="$t('auth.password')"
            :rules="[$form.fieldRequired]"
            type="password"
          />
          <v-text-field
            v-model="repeatPassword"
            :label="$t('auth.repeat_password')"
            :rules="[$form.fieldRequired]"
            type="password"
          />
          <password-requirements
            :password="password"
            :repeat_password="repeatPassword"
            @requirements="passwordRequirements"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="!isValid" :loading="loading" color="primary" text type="submit">
            {{ $t("auth.set_password") }}
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
import { ERROR_CODES, getNetworkErrorCode } from "../../api/util/network-errors";
import i18n from "../../languages";
import CenterContainer from "../containers/CenterContainer";
import PasswordRequirements from "../../components/auth/PasswordRequirements";
export default {
  components: {
    CenterContainer,
    PasswordRequirements
  },
  data: function() {
    return {
      valid: false,
      passwordValid: false,
      password: "",
      repeatPassword: "",
      loading: false
    };
  },
  computed: {
    isValid() {
      return this.valid && this.passwordValid;
    }
  },
  methods: {
    passwordRequirements(valid) {
      this.passwordValid = valid;
    },
    activate() {
      this.loading = true;
      this.$auth
        .activate(this.$route.params.token, this.password, this.repeatPassword)
        .then(() => {
          this.$toast.success(i18n.t("auth.activate.success"));
          this.$router.push({
            name: "home"
          });
        })
        .catch(error => {
          const status = getNetworkErrorCode(error);
          if (status === ERROR_CODES.BAD_REQUEST) this.$toast.error(i18n.t("auth.errors.unknown_activation_token"));
          this.loading = false;
        });
    }
  }
};
</script>
