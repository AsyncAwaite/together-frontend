// /////////////////////////////////////////////
// Helper
// /////////////////////////////////////////////

const api = {
  baseUrl: "https://api.together.biz.ua/",
  endpoints: {
    registration: "api/register",
    login: "api/login",
    logout: "api/logout",
    forgot: "api/forgot-password",
    reset: "api/password/reset",
  },
};

// /////////////////////////////////////////////
// State
// /////////////////////////////////////////////

const state = {
  bodyOverlay: false,
  events:{
    card_added:false,
  },
  scrollY: 0,
  authModal: {
    usecase: "registration",
    open: false,
  },
  api: api,
  orders:[],
  translationsLoaded:false,
  user_current_role: null,
  categories: [],
  sellerTerms: {},
  buyerTerms: {},
  newProducts:{},
  recomendedProducts:{},
  statistics:{},
  viewedProducts:[]
};

export default state;
