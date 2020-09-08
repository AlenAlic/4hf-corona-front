<template>
  <v-dialog persistent v-model="show" :max-width="dialogWidth">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="result"
        v-on="on"
        readonly
      >
      </v-text-field>
    </template>

    <v-card class="dtp-tweak">
      <v-card-text class="px-0 py-0">
        <v-tabs fixed-tabs v-model="activeTab">
          <v-tab key="calendar">
            <v-icon>mdi-calendar</v-icon>
          </v-tab>
          <v-tab key="timer" :disabled="!dateSelected">
            <v-icon>mdi-clock</v-icon>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              v-model="date"
              class="dtp-tweak"
              color="primary dtp-tweak"
              @input="showTimePicker"
              full-width
              first-day-of-week="1"
              :min="minDate"
              v-bind="datePickerProps"
            ></v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              class="dtp-tweak"
              v-model="time"
              format="24hr"
              full-width
              color="primary"
              :allowed-minutes="allowedMinutes(5)"
              :min="minTime"
              v-bind="timePickerProps"
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-btn color="accent" text @click="clearHandler">{{ clearText }}</v-btn>
        <v-spacer />
        <v-btn color="primary" text @click="okHandler">{{ okText }}</v-btn>
        <v-btn text @click="cancelHandler">{{ cancelText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { DateTime } from "luxon";
const DEFAULT_DATE = "";
const DEFAULT_TIME = "";
const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
const DEFAULT_TIME_FORMAT = "HH:mm";
const DEFAULT_DIALOG_WIDTH = 360;
const DEFAULT_OK_TEXT = "OK";
const DEFAULT_CANCEL_TEXT = "CANCEL";
const DEFAULT_CLEAR_TEXT = "CLEAR";
export default {
  model: {
    prop: "datetime",
    event: "input"
  },
  props: {
    datetime: { type: String, default: null },
    disabled: { type: Boolean },
    loading: { type: Boolean },
    label: { type: String, default: "" },
    zone: { type: String, default: "Europe/Amsterdam" },
    dialogWidth: { type: Number, default: DEFAULT_DIALOG_WIDTH },
    dateFormat: { type: String, default: DEFAULT_DATE_FORMAT },
    timeFormat: { type: String, default: DEFAULT_TIME_FORMAT },
    okText: { type: String, default: DEFAULT_OK_TEXT },
    cancelText: { type: String, default: DEFAULT_CANCEL_TEXT },
    clearText: { type: String, default: DEFAULT_CLEAR_TEXT },
    textFieldProps: { type: Object },
    datePickerProps: { type: Object },
    timePickerProps: { type: Object },
    min: { type: String }
  },
  data: function() {
    return {
      show: false,
      activeTab: 0,
      date: DEFAULT_DATE,
      time: DEFAULT_TIME
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    result() {
      return this.date && this.time ? `${this.date} ${this.time}` : "";
    },
    resultDatetime() {
      return this.result ? DateTime.fromFormat(this.result, "yyyy-LL-dd HH:mm").setZone(this.zone) : null;
    },
    utcDatetime() {
      return this.resultDatetime ? this.resultDatetime.toUTC().toISO() : null;
    },
    dateSelected() {
      return !!this.date;
    },
    minDate() {
      if (this.min) return this.min.substring(0, 10);
      return null;
    },
    minTime() {
      if (this.min && this.date === this.minDate) return this.min.substring(11, 16);
      return null;
    }
  },
  methods: {
    init() {
      if (this.datetime) {
        this.date = this.datetime.substring(0, 10);
        this.time = this.datetime.substring(11, 16);
      }
    },
    okHandler() {
      this.resetPicker();
      this.$emit("input", this.utcDatetime);
      this.show = false;
    },
    cancelHandler() {
      this.resetPicker();
      this.show = false;
    },
    clearHandler() {
      this.resetPicker();
      this.date = DEFAULT_DATE;
      this.time = DEFAULT_TIME;
      this.$emit("input", null);
    },
    resetPicker() {
      this.activeTab = 0;
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true;
      }
    },
    showTimePicker() {
      this.activeTab = 1;
    },
    allowedMinutes(delimiter) {
      let res = [];
      for (let i = 0; i <= 59; i += delimiter) res.push(i);
      return res;
    }
  }
};
</script>

<style scoped lang="scss">
.dtp-tweak {
  border-radius: 0 !important;
}
</style>
