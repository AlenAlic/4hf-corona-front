<template>
  <v-snackbar
    :timeout="timeout"
    :color="color"
    :bottom="y === 'bottom'"
    :top="y === 'top'"
    :left="x === 'left'"
    :right="x === 'right'"
    :multi-line="multiLine"
    :vertical="vertical"
    v-model="active"
    class="v-application"
    :dismissible="dismissible"
    role="alert"
  >
    <v-icon dark left v-if="!!icon" :color="iconColor">
      {{ icon }}
    </v-icon>

    <div class="text--wrap">{{ message }}</div>

    <v-btn :icon="!closeText" :text="!!closeText" v-if="showClose" @click="close" style="margin-right: -16px;">
      <v-icon v-if="closeText">{{ closeIcon }}</v-icon>
      <span v-if="!!closeText">{{ closeText }}</span>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    x: { type: String, default: "" },
    y: { type: String, default: "top" },
    color: { type: String, default: "info" },
    icon: { type: String, default: "" },
    iconColor: { type: String, default: "" },
    message: { type: String, default: "" },
    timeout: { type: Number, default: 6000 },
    dismissible: { type: Boolean, default: false },
    multiLine: { type: Boolean, default: false },
    vertical: { type: Boolean, default: false },
    showClose: { type: Boolean, default: true },
    closeText: { type: String, default: "close" },
    closeIcon: { type: String, default: "" }
  },
  data: () => ({
    active: false
  }),
  mounted() {
    this.$nextTick(() => this.show());
  },
  watch: {
    active(isActive, wasActive) {
      this.$emit("statusChange", isActive, wasActive);
    }
  },
  methods: {
    show() {
      this.active = true;
    },
    close() {
      this.active = false;
    }
  }
};
</script>
