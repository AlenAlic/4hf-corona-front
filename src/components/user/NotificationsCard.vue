<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="updateNotificationPreferences">
    <v-card>
      <v-card-title>{{ $t("user.profile.notification_preference.title") }}</v-card-title>
      <v-card-text>
        <v-checkbox
          id="user-profile-notifications-email"
          v-model="email_notifications"
          :label="$t('user.profile.notification_preference.email')"
          hide-details
        />
        <v-checkbox
          id="user-profile-notifications-push"
          v-model="push_notifications"
          :label="$t('user.profile.notification_preference.push')"
          hide-details
        />
        <template v-if="$store.state.auth.profile.push_notifications">
          <template v-if="!subscribed">
            <v-card-text class="px-0 pb-0">
              {{ $t("user.profile.notification_preference.device_not_subscribed") }}
            </v-card-text>
            <v-card-actions class="px-0">
              <v-spacer />
              <v-btn text small color="primary" :loading="loading" @click="subscribeDevice">
                {{ $t("user.profile.notification_preference.subscribe") }}
              </v-btn>
            </v-card-actions>
          </template>
          <template v-else>
            <v-card-text class="px-0 pb-0">
              {{ $t("user.profile.notification_preference.device_subscribed") }}
            </v-card-text>
            <v-card-actions class="px-0">
              <v-spacer />
              <v-btn text small color="primary" :loading="loading" @click="unsubscribeDevice">
                {{ $t("user.profile.notification_preference.unsubscribe") }}
              </v-btn>
            </v-card-actions>
          </template>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          id="user-profile-notifications-accept"
          :disabled="!valid"
          :loading="loading"
          color="primary"
          text
          type="submit"
        >
          {{ $t("general.save_changes") }}
        </v-btn>
        <v-btn id="user-profile-notifications-cancel" text @click="resetForm()">
          {{ $t("general.cancel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { UPDATE_NOTIFICATION_PREFERENCE, SET_PROFILE } from "../../store/modules/auth";
import {
  pmSubscription,
  checkForNotificationSupport,
  askPermission,
  subscribeUserToPush
} from "../../api/notifications";
import { notificationsApi } from "../../api/notifications";

export default {
  data: function() {
    return {
      valid: false,
      loading: false,
      email_notifications: this.$store.state.auth.profile.email_notifications,
      push_notifications: this.$store.state.auth.profile.push_notifications,
      pushSubscription: null
    };
  },
  created() {
    this.setPushSubscription();
  },
  computed: {
    subscribed() {
      const profile = this.$store.state.auth.profile;
      let subscriptions = [];
      if (profile) subscriptions = profile.notifications.map(n => n.endpoint);
      if (this.pushSubscription) {
        return subscriptions.includes(this.pushSubscription.endpoint);
      } else {
        return false;
      }
    }
  },
  methods: {
    setPushSubscription() {
      pmSubscription().then(s => {
        this.pushSubscription = s;
      });
    },
    resetForm() {
      this.email_notifications = this.$store.state.auth.profile.email_notifications;
      this.push_notifications = this.$store.state.auth.profile.push_notifications;
      this.$refs.form.resetValidation();
    },
    updateNotificationPreferences() {
      this.loading = true;
      this.$store
        .dispatch(UPDATE_NOTIFICATION_PREFERENCE, {
          email_notifications: this.email_notifications,
          push_notifications: this.push_notifications
        })
        .then(() => {
          if (this.push_notifications) {
            if (checkForNotificationSupport()) {
              askPermission().then(() => {
                subscribeUserToPush().then(pushSubscription => {
                  this.pushSubscription = pushSubscription;
                  notificationsApi.subscribe(pushSubscription).then(response => {
                    this.$store.commit(SET_PROFILE, response.data);
                    this.loading = false;
                  });
                });
              });
            }
          } else {
            this.loading = false;
          }
          this.resetForm();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    subscribeDevice() {
      this.loading = true;
      if (checkForNotificationSupport()) {
        askPermission().then(() => {
          subscribeUserToPush().then(pushSubscription => {
            this.pushSubscription = pushSubscription;
            notificationsApi.subscribe(pushSubscription).then(response => {
              this.$store.commit(SET_PROFILE, response.data);
              this.loading = false;
            });
          });
        });
      }
    },
    unsubscribeDevice() {
      this.loading = true;
      notificationsApi.unsubscribe(this.pushSubscription.endpoint).then(response => {
        this.$store.commit(SET_PROFILE, response.data);
        this.loading = false;
      });
    }
  }
};
</script>
