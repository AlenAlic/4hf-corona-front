import { DateTime, Duration } from "luxon";

const UtilitiesHandler = {
  install(Vue) {
    /**
     * Utilities used in multiple components
     */
    Vue.prototype.$util = {
      dateTime(date) {
        return dateTime(date);
      },
      /**
       * Get a default string representation from a DateTime object.
       * @returns {string}
       */
      dateTimeString(date) {
        return dateTimeString(date);
      },
      convertDateTimeStringToUTC(s) {
        return DateTime.fromFormat(s, "yyyy-LL-dd HH:mm:ss", { zone: "Europe/Amsterdam" }).toUTC();
      },
      convertDateTimeStringToUTCString(s) {
        return this.convertDateTimeStringToUTC(s).toFormat("yyyy-LL-dd HH:mm:ss");
      },
      /**
       * Get the duration between two DateTime objects.
       * @returns {Duration}
       */
      duration(startDate, endDate) {
        return Duration.fromObject({
          milliseconds: endDate.toMillis() - startDate.toMillis()
        }).shiftTo("hours", "minutes");
      },
      get now() {
        return now();
      },
      get nowString() {
        return nowString();
      }
    };
  }
};

export default UtilitiesHandler;

export const isEmail = email => {
  // eslint-disable-next-line no-useless-escape
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Get a DateTime object.
 * @returns {DateTime}
 */
export const dateTime = date => {
  return DateTime.fromISO(date, { zone: "utc" }).setZone("Europe/Amsterdam");
};
/**
 * Get a default string representation from a DateTime object.
 * @returns {string}
 */
export const dateTimeString = date => {
  return dateTime(date).toFormat("yyyy-LL-dd HH:mm:ss");
};
/**
 * Get a string representation from a DateTime object representing today's date.
 * @returns {string}
 */
export const dateTimeToday = date => {
  return dateTime(date).toFormat("yyyy-LL-dd");
};
/**
 * Get the current DateTime
 * @returns {DateTime}
 */
export const now = () => {
  return DateTime.local();
};
/**
 * Get the string representation of the current DateTime
 * @returns {String}
 */
export const nowString = () => {
  return now().toISO({ includeOffset: false });
};
