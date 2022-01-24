<template>
  <div class="app-wrapper" v-show="translationsLoaded">
    <div class="header-area">
      <icons />
      <appHeader :key="$route.fullPath + 0" />
    
    </div>
    <div class="content-area">
      <router-view :key="$route.fullPath" />
    </div>
    <div class="footer-area">
      <authModal ref="auth-modal" />
      <appFooter :key="$route.fullPath + 3" />
    </div>
  </div>
</template>

<script>
import appHeader from "@/layout/Header.vue";
import appFooter from "@/layout/Footer.vue";
import icons from "@/layout/icons/iconsCollection.vue";
import authModal from "@/components/modals/authModal.vue";
import { mapGetters, mapActions } from "vuex";
import { INITIAL_DATA_QUERY } from "@/constants/graphql";

export default {
   name: 'App',
   
  data() {
    return {
      translationsLoaded: false,
      categories: null,
      translations: null,
      initialData: {},
      sellerTerms: null,
      buyerTerms: null,
      newProducts: null,
      recomendedProdutcs: null,
      loadibg: 0,
    };
  },
  components: {
    appHeader,
    appFooter,
    authModal,
    icons,
  },
  computed: {
    ...mapGetters({
      role: "role",
      user: "sanctum/getUser",
      isAuthenticated: "sanctum/isAuthenticated",
    }),
  },
  watch: {
    $route() {
      //Scroll to top
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    user(oldVal, newVal) {
      if (newVal) {
        this.setInitialRoleOnLogin();
      }
    },
    isAuthenticated(newVal) {
      if (newVal == false && this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
  },
  methods: {
    ...mapActions({
      tryAutoLogin: "sanctum/tryAutoLogin",
    }),
    preservedRoleInArray(role) {
      var found = false;
      for (var i = 0; i < this.user.roles.length; i++) {
        if (this.user.roles[i].name == role) {
          found = true;
        }
      }
      return found;
    },
    getCookie(name) {
      var match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      if (match) return match[2];
    },
    getTerms() {
      var sellerTerms = this.initialData.sellerTerms;
      this.$store.dispatch("setSellerTerms", sellerTerms);
      var buyerTerms = this.initialData.buyerTerms;
      this.$store.dispatch("setBuyerTerms", buyerTerms);
    },
    getStats() {
      var stats = this.initialData.stats;
      this.$store.dispatch("setHomeStats", stats);
    },
    getNewProducts() {
      let newProducts = this.initialData.newProducts;
      this.$store.dispatch("setNewProducts", newProducts);
    },
    getRecomendedProducts() {
      let recomendedProducts = this.initialData.recomendedProducts;
      this.$store.dispatch("setRecomendedProducts", recomendedProducts);
    },
    async getTranslations() {
      // let messages = this.initialData.buyerTerms;
      let messages = this.initialData.translations.strings;
      var i = 0;
      for (const [key, value] of Object.entries(messages)) {
        if (key !== "__typename") {
          this.$root.$i18n.setLocaleMessage(key, JSON.parse(value));
          i++;
        }
        if (i == 3) {
          this.$store.dispatch("updateTranstalionsStatus", true);
        }
      }
    },
    getOrders() {
      var orders = this.initialData.orders;
      this.$store.dispatch("setOrders", orders);
    },
    getCategories() {
      var categories = this.initialData.categories;
      var globalCategories = [];
      for (var key in categories) {
        globalCategories.push(categories[key]);
      }
      this.$store.dispatch("setCategories", globalCategories);
    },
    setInitialRoleOnLogin() {
      var role;
      if (this.user && this.user.roles) {
        for (var i = 0; i < this.user.roles.length; i++) {
          if (this.user.roles[i].name !== "Admin") {
            role = this.user.roles[i].name;
          }
        }
        if (!this.role) {
          this.$store.dispatch("setCurrentUserRole", role);
        } else if (this.role && this.preservedRoleInArray(this.role) == false) {
          this.$store.dispatch("setCurrentUserRole", role);
        } else if (this.role && this.preservedRoleInArray(this.role)) {
          this.$store.dispatch("setCurrentUserRole", this.role);
        }
      }
    },
    async getInitialData() {
      this.$apollo
        .query({
          query: INITIAL_DATA_QUERY,
          update: (data) => {
            return {
              categories: data.categories,
              translations: data.translations,
              sellerTerms: data.sellerTerms,
              buyerTerms: data.buyerTerms,
              newProducts: data.newProducts,
              recomendedProducts: data.recomendedProducts,
              stats: data.stats,
            };
          },
          fetchPolicy: "no-cache",
        })
        .then(async (data) => {
          this.initialData = {};
          this.initialData["categories"] = data.data.categories;
          this.initialData["translations"] = data.data.translations;
          this.initialData["sellerTerms"] = data.data.sellerTerms;
          this.initialData["buyerTerms"] = data.data.buyerTerms;
          this.initialData["newProducts"] = data.data.newProducts;
          this.initialData["recomendedProducts"] = data.data.recomendedProducts;
          this.initialData["stats"] = data.data.stats;
          this.initialData["orders"] = data.data.orders;
          this.getOrders();
          // await this.getTranslations();
          this.getCategories();
          this.getTerms();
          this.getNewProducts();
          this.getRecomendedProducts();
          this.getStats();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async beforeCreate() {
    let messages = {};
    await this.$api.get("/api/translate/static-keys").then((response) => {
      messages = response.data.strings;
      for (const [key, value] of Object.entries(messages)) {
        this.$i18n.setLocaleMessage(key, value);
      }
      this.translationsLoaded = true;
    });
  },
  mounted() {
 
    this.setInitialRoleOnLogin();

    let token = this.getCookie("XSRF-TOKEN");
    window.localStorage.setItem("token", token);
  },
  async created() {
    await this.getInitialData();

    await this.tryAutoLogin();
  },
   metaInfo () {
  
    return {
      title: this.$t('pages.main_title'),     
      titleTemplate: `%s | ${this.$t('pages.main_title')}`,
      meta: [
     { name: 'description', content:  `${this.$t('pages.main_meta_descr')}` }
    ]
     
    }
    
  },
};
</script>

<style lang="scss">
@import "@/scss/vars.scss";
@import "@/scss/global.scss";

.app-wrapper {
  @media (min-width: 1025px) {
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-gap: 0px;
    height: 100vh;
    grid-template-areas:
      "header header header"
      "content content content "
      "footer footer footer";
  }
}
.content-area {
  grid-area: content;
  @media (min-width: 1024px) {
    padding-top: 140px;
  }
  @media (max-width: 1024px) {
    padding-top: 120px;
  }
}

.footer-area {
  grid-area: footer;
}
.header-area {
  grid-area: header;
}
</style>
