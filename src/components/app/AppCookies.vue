<template>
  <cookie-banner v-if="showCookies && type === 'banner'" :cookies="cookies" />
  <cookie-modal v-else-if="showCookies && type === 'modal'" :cookies="cookies" />
</template>

<script>
import { loadItem, STORAGE } from "../../api/util/token-storage";
import CookieBanner from "../cookies/CookieBanner";
import CookieModal from "../cookies/CookieModal";
export default {
  components: {
    CookieModal,
    CookieBanner
  },
  computed: {
    enabled() {
      return this.$config.cookies.enabled;
    },
    type() {
      return this.$config.cookies.type;
    },
    cookies() {
      const cookiesObject = loadItem(STORAGE.COOKIES);
      return cookiesObject ? cookiesObject : {};
    },
    accepted() {
      return this.cookies.accepted;
    },
    showCookies() {
      return this.enabled && !this.accepted;
    }
  }
};
</script>
