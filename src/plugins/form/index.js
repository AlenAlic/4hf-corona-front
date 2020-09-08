import i18n from "../../languages";
import { isEmail } from "../utilities";

const FormRulesHandler = {
  install(Vue) {
    Vue.prototype.$form = {
      get fieldRequired() {
        return fieldRequired;
      },
      get fieldIsEmail() {
        return fieldIsEmail;
      },
      minNumber(n) {
        return v => minNumber(v, n);
      },
      maxNumber(n) {
        return v => maxNumber(v, n);
      },
      get charactersAreLetters() {
        return charactersAreLetters;
      },
      minCharacterCount(o) {
        return minCharacterCount(o);
      },
      maxCharacterCount(o) {
        return maxCharacterCount(o);
      },
      exactCharacterCount(n) {
        return v => exactCharacterCount(v, n);
      },
      get pfdFile() {
        return pfdFile;
      }
    };
  }
};

export default FormRulesHandler;

export const fieldRequired = v => !!v || i18n.t("form.errors.required");
export const fieldIsEmail = v => isEmail(v) || i18n.t("form.errors.valid_email");
export const minNumber = (v, o) => v >= o || i18n.t("form.errors.min", { number: o });
export const maxNumber = (v, o) => v <= o || i18n.t("form.errors.max", { number: o });
export const charactersAreLetters = v => (v && !!v.match("^[A-Za-z]+$")) || i18n.t("form.errors.letters");
export const minCharacterCount = (v, o) => (v && v.length >= o) || i18n.t("form.errors.min_character", { number: o });
export const maxCharacterCount = (v, o) => v.length <= o || i18n.t("form.errors.max_character", { number: o });
export const exactCharacterCount = (v, o) =>
  (v && v.length === o) || i18n.t("form.errors.exact_character", { number: o });
export const pfdFile = v => (!!v && v.type === "application/pdf") || i18n.t("form.errors.file_type.pdf");
