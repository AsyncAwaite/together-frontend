import Vue from "vue";
import VueI18n from "vue-i18n";
// import axios from "axios";

Vue.use(VueI18n);

let locale = window.localStorage.locale;

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || locale || "ua",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "ua",
  messages: {},
});
