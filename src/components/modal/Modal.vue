<template>
  <v-dialog persistent v-model="show" :max-width="maxWidth">
    <v-card>
      <slot>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text class="text--wrap">
          {{ text }}
        </v-card-text>
      </slot>
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="!!accept" color="primary" text @click="closeModal(true)" :disabled="acceptDisabled" :id="acceptId">
          {{ accept }}
        </v-btn>
        <v-btn v-if="showCloseButton" text @click="closeModal(false)">
          {{ close }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import i18n from "../../languages";
export default {
  props: {
    show: { type: Boolean, default: false },
    size: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    accept: { type: String, default: "" },
    acceptDisabled: { type: Boolean, default: false },
    acceptId: { type: String, default: "" },
    showCloseButton: { type: Boolean, default: true },
    close: { type: String, default: i18n.t("general.close") }
  },
  model: {
    prop: "show",
    event: "close"
  },
  computed: {
    maxWidth() {
      switch (this.size) {
        case "sm":
          return "290";
        case "lg":
          return "890";
        case "xl":
          return "1390";
        default: {
          return "590";
        }
      }
    }
  },
  methods: {
    closeModal(flag) {
      if (flag) {
        this.$emit("agree");
      }
      this.$emit("close", false);
    }
  }
};
</script>
