const actions = {
  // /////////////////////////////////////////////
  // UI
  // /////////////////////////////////////////////

  toggleContentOverlay({ commit }) {
    commit("TOGGLE_CONTENT_OVERLAY");
  },

  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  setCurrentUserRole({ commit }, payload) {
    commit("SET_CURRENT_USER_ROLE", payload);
  },

  updateManagerInfo({ commit }, payload) {
    commit("UPDATE_MANAGER_INFO", payload);
  },

  updateUserInfo({ commit }, payload) {
    commit("UPDATE_USER_INFO", payload);
  },

  toggleAuthModal({ commit }, payload) {
    commit("TOGGLE_AUTH_MODAL", payload);
  },
  switchToLogin({ commit }) {
    commit("SET_AUTH_CASE", "login");
  },

  switchToRecovery({ commit }) {
    commit("SET_AUTH_CASE", "recovery");
  },
  switchToRegistration({ commit }) {
    commit("SET_AUTH_CASE", "registration");
  },

  // /////////////////////////////////////////////
  //  Global fetched data
  // /////////////////////////////////////////////
  setCategories({ commit }, payload) {
    commit("SET_CATEGORIES", payload);
  },

  // /////////////////////////////////////////////
  // Set terms pages
  // /////////////////////////////////////////////
  setBuyerTerms({ commit }, payload) {
    commit("SET_BUYER_TERMS", payload);
  },
  setSellerTerms({ commit }, payload) {
    commit("SET_SELLER_TERMS", payload);
  },
  setOrderId({ commit }, payload) {
    commit("SET_ORDER_ID", payload);
  },

  // /////////////////////////////////////////////
  // Set homepage products
  // /////////////////////////////////////////////
  setNewProducts({ commit }, payload) {
    commit("SET_NEW_PRODUCTS", payload);
  },
  setRecomendedProducts({ commit }, payload) {
    commit("SET_RECOMENDED_PRODUCTS", payload);
  },

  // /////////////////////////////////////////////
  // Set home stats
  // /////////////////////////////////////////////
  setHomeStats({ commit }, payload) {
    commit("SET_HOME_STATS", payload);
  },

  // /////////////////////////////////////////////
  // Set orders
  // /////////////////////////////////////////////
  setOrders({ commit }, payload) {
    commit("SET_ORDERS", payload);
  },
  // /////////////////////////////////////////////
  // Set Events
  // /////////////////////////////////////////////
  setEvents({ commit }, payload) {
    commit("SET_EVENTS", payload);
  },

  // /////////////////////////////////////////////
  // Set translations state
  // /////////////////////////////////////////////
  updateTranstalionsStatus({ commit }, payload) {
    commit("UPDATE_TRANSLATIONS_STATUS", payload);
  },

  // /////////////////////////////////////////////
  // Set Viewed Products
  // /////////////////////////////////////////////
  setViewedProducts({ commit }, payload) {
    commit("UPDATE_VIEWED_PRODUCTS", payload);
  },
};

export default actions;
