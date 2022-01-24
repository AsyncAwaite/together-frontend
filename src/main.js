import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
import App from "./App.vue";

//Cookies
import VueCookies from "vue-cookies";
Vue.use(VueCookies);

import VueSanctum from "vue-sanctum";
import axios from "axios";

import store from "./store/store.js";
import router from "./router";

//Vue-select
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";

//vue-tel-input
import VueTelInput from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";
Vue.use(VueTelInput);

//Bootstrap
import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

//Overriding with custom styles
import "@/scss/global.scss";
import "@/scss/buttons.scss";


import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY,
    libraries: 'places', 
  },
})

Vue.use(BootstrapVue);
//Gtag
import VueGtag from "vue-gtag";
Vue.use(VueGtag, {
  config: { id: "UA-209360271-1" }
});

//Icons utility
import icon from "@/layout/icons/icon";
Vue.component("icon", icon);


//Messages rounded background
import message from "@/components/ui/message-background";
Vue.component("message", message);

//moment
const moment = require("moment");
require("moment/locale/ru");
require("moment/locale/uk");
Vue.use(require("vue-moment"), {
  moment,
});

Vue.config.productionTip = false;

//Sanctum auth
const axiosApi = axios.create({
  baseURL: "https://api.together.biz.ua/",
  // baseURL: "https://devapi.together.biz.ua/",
 
  withCredentials: true,
});
axiosApi.defaults.withCredentials = true;
Vue.prototype.$api = axiosApi;

//Languages
import i18n from "@/translations/index.js";
// /Load translations remotelly
// let loadLocaleMessages = async () => {
//   let messages = {};
//   await axiosApi.get("/api/translate/static-keys").then((response) => {
//     messages = response.data.strings;
//     for (const [key, value] of Object.entries(messages)) {
//       i18n.setLocaleMessage(key, value);
//     }
//   });
// };
// loadLocaleMessages();

//Apollo
import VueApollo from "vue-apollo";
Vue.use(VueApollo);
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";

const cache = new InMemoryCache({
  addTypename: false,
});
const link = createHttpLink({
  uri: "https://api.together.biz.ua/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = window.localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "x-xsrf-token": token,
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(link),
  cache,
  defaultOptions: {
    fetchPolicy: "no-cache",
  },
});
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueSanctum, {
  axios: axiosApi,
  routes: {
    login: "api/login",
    logout: "api/logout",
    me: "api/me",
  },

  store,
});
console.log(process.env.VUE_APP_GOOGLE_API_KEY)
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload);

import { ContentLoader } from "vue-content-loader";
Vue.component("ContentLoader", ContentLoader);

new Vue({
  i18n,
  router,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");

import VueMeta from 'vue-meta';
  Vue.use(VueMeta);