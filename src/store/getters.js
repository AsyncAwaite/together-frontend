const getters = {
  authModal: (state) => {
    return state.authModal;
  },
  api: (state) => {
    return state.api;
  },
  role: (state) => {
    return state.user_current_role;
  },
  isAuthenicated: (state) => {
    return state.isAuthenicated;
  },
  categories: (state) => {
    return state.categories;
  },
  sellerTerms: (state) => {
    return state.sellerTerms;
  },
  buyerTerms: (state) => {
    return state.buyerTerms;
  },
  loggedIn: (state) => {
    return state.sanctum.isAuthenticated;
  },
  recomendedProducts: (state) => {
    return state.recomendedProducts;
  },
  newProducts: (state) => {
    return state.newProducts;
  },
  homeStats: (state) => {
    return state.statistics;
  },
  translationsLoaded: (state)=>{
    return state.translationsLoaded;
  },
  orders: (state)=>{
    return state.orders
  },
  events: (state)=>{
    return state.events
  },
  viewedProducts: (state)=>{
    return state.viewedProducts
  },
  orderId: (state)=>{
    return state.orderId;
  },

};

export default getters;
