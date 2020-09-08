<template>
  <modal
    v-model="modal"
    :show-close-button="false"
    :title="$t('cookies.not_using.title')"
    :text="$t('cookies.not_using.text')"
    :accept="$t('general.ok')"
    accept-id="cookies-ok-btn"
    @agree="acceptCookies"
  />
</template>

<script>
import { saveItem, STORAGE } from "../../api/util/token-storage";
import Modal from "../../components/modal/Modal";
export default {
  components: { Modal },
  props: {
    cookies: { type: Object, default: () => {} }
  },
  data: function() {
    return {
      modal: false
    };
  },
  mounted() {
    this.$nextTick(function() {
      if (!this.accepted) {
        setTimeout(() => {
          this.modal = !this.accepted;
        }, 600);
      }
    });
  },
  computed: {
    accepted() {
      return this.cookies.accepted;
    }
  },
  methods: {
    acceptCookies() {
      saveItem(STORAGE.COOKIES, { accepted: true });
      this.modal = false;
    }
  }
};
</script>
