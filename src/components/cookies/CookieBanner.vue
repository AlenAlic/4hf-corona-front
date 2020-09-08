<template>
  <div class="text-center">
    <v-bottom-sheet v-model="sheet" inset persistent>
      <v-sheet class="text-center">
        <v-card>
          <v-card-text class="title">{{ $t("cookies.not_using.title") }}</v-card-text>
          <v-card-text>{{ $t("cookies.not_using.text") }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="acceptCookies" id="cookies-ok-btn">
              {{ $t("general.ok") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { saveItem, STORAGE } from "../../api/util/token-storage";
export default {
  props: {
    cookies: { type: Object, default: () => {} }
  },
  data: function() {
    return {
      sheet: false
    };
  },
  mounted() {
    this.$nextTick(function() {
      if (!this.accepted) {
        setTimeout(() => {
          this.sheet = !this.accepted;
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
      this.sheet = false;
    }
  }
};
</script>
