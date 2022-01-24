const mutations = {
  // ////////////////////////////////////////////
  // UI
  // ////////////////////////////////////////////

  TOGGLE_CONTENT_OVERLAY(state, val) {
    state.bodyOverlay = val;
  },
  SET_AUTH_CASE(state, val) {
    state.authModal.usecase = val;
  },
  TOGGLE_AUTH_MODAL(state, val) {
    state.authModal = val;
  },
  UPDATE_USER_INFO(state, val) {
    state.user = val;
  },

  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////
  SET_CURRENT_USER_ROLE(state, val) {
    state.user_current_role = val;
  },
 

  // /////////////////////////////////////////////
  // Global fetched data
  // /////////////////////////////////////////////
  SET_CATEGORIES(state, val) {
    state.categories = val;
  },

  // /////////////////////////////////////////////
  // Set terms pages
  // /////////////////////////////////////////////
  SET_SELLER_TERMS(state, val) {
    state.sellerTerms = val;
  },
  SET_BUYER_TERMS(state, val) {
    state.buyerTerms = val;
  },

  // /////////////////////////////////////////////
  // Set homepage products
  // /////////////////////////////////////////////
  SET_NEW_PRODUCTS(state, val) {
    state.newProducts = val;
  },
  SET_RECOMENDED_PRODUCTS(state, val) {
    state.recomendedProducts = val;
  },

  // /////////////////////////////////////////////
  // Set homepage stats
  // /////////////////////////////////////////////
  SET_HOME_STATS(state, val) {
    state.statistics = val;
  },

  // /////////////////////////////////////////////
  // Set orders
  // /////////////////////////////////////////////
  SET_ORDERS(state, val) {
    state.orders = val;
  },
  // /////////////////////////////////////////////
     // OrderId
  // /////////////////////////////////////////////
  SET_ORDER_ID(state, val) {
    state.orderId = val;
  },
  // Set event
  // /////////////////////////////////////////////
  SET_EVENTS(state, val) {
    for(var key in val){
      state.events[key] = val[key];
    }
  },
  // /////////////////////////////////////////////
  // Set Translations status
  // /////////////////////////////////////////////
  UPDATE_TRANSLATIONS_STATUS(state, val) {
    state.translationsLoaded = val;
  },
   // /////////////////////////////////////////////
  // Set Viewed items
  // /////////////////////////////////////////////
  UPDATE_VIEWED_PRODUCTS(state, val) {
    state.viewedProducts = val;
  },
};

export default mutations;
