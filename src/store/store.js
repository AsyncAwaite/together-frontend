/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Vuex from "vuex";

import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

// import createMultiTabState from 'vuex-multi-tab-state';

import VuexPersist from "vuex-persist";
const vuexPersist = new VuexPersist({
  key: "ToGether",
  storage: window.localStorage,
});

Vue.use(Vuex);

const store = new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  vuexPersist,
  strict: process.env.NODE_ENV !== "production",
  plugins: [vuexPersist.plugin],
});

export default store;
