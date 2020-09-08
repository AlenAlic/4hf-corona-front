<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="changePassword">
    <v-card>
      <v-card-title>{{ $t("auth.change_password") }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="password"
          :label="$t('auth.current_password')"
          :rules="[$form.fieldRequired]"
          type="password"
        />
        <v-text-field
          v-model="newPassword"
          :label="$t('auth.new_password')"
          :rules="[$form.fieldRequired]"
          type="password"
        />
        <v-text-field
          v-model="repeatPassword"
          :label="$t('auth.repeat_password')"
          :rules="[$form.fieldRequired]"
          type="password"
        ></v-text-field>
        <password-requirements
          ref="req"
          :password="newPassword"
          :repeat_password="repeatPassword"
          @requirements="passwordRequirements"
          :use-old-password="true"
          :old_password="password"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="!isValid" :loading="loading" color="primary" text type="submit">
          {{ $t("auth.change_password") }}
        </v-btn>
        <v-btn text @click="resetForm()">
          {{ $t("general.cancel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import PasswordRequirements from "../../components/auth/PasswordRequirements";
import { ERROR_CODES, getNetworkErrorCode } from "../../api/util/network-errors";
import i18n from "../../languages";
export default {
  components: { PasswordRequirements },
  data: function() {
    return {
      valid: false,
      passwordValid: false,
      password: "",
      newPassword: "",
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
    resetForm() {
      this.password = "";
      this.newPassword = "";
      this.repeatPassword = "";
      this.$refs.form.resetValidation();
    },
    changePassword() {
      this.loading = true;
      this.$auth
        .changePassword(this.password, this.newPassword, this.repeatPassword)
        .then(() => {
          this.$nextTick(function() {
            this.$toast.success(i18n.t("auth.new_password_set.security"), { timeout: 12000 });
            this.$router.push({
              name: "home"
            });
          });
        })
        .catch(error => {
          const status = getNetworkErrorCode(error);
          if (status === ERROR_CODES.FORBIDDEN) this.$toast.error(i18n.t("auth.errors.password_incorrect"));
          this.loading = false;
        });
    }
  }
};
</script>
