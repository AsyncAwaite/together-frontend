<template>
  <div class="header-component">
    <header class="header" :class="{ hideTop: hideTop }">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-4 order-1 col-lg-2 d-flex align-items-center">
            <router-link :to="{ name: 'home' }" class="header__logo">
              <img src="@/assets/img/logo_dark.svg" alt="" />
            
            </router-link>
             <span class="header__beta">beta</span>
          </div>
               <headerSearch />
          <div class="col-6 col-lg-3 order-2">
            <div class="header__links ">
              <ul>
                <li>
                  <router-link
                    :to="{ name: 'page', params: { slug: 'pro-servis' } }"
                  >
                    {{ $t("view_titles.about") }}
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'page', params: { slug: 'kontakti' } }"
                  >
                    {{ $t("view_titles.contacts") }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-2 col-lg-3 order-3 ">
            <div>
              <header-user />
            </div>
          </div>
        </div>
      </div>
      <div class="header__subheader">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-3 d-none d-lg-block">
              <div
                class="header__catalog"
                :class="{ active: showCatalog }"
                v-on:mouseover="showCatalog = true"
                v-on:mouseleave="showCatalog = false"
              >
                <div
                  class="toggle"
                  @click="toggleCatalog"
                  :class="{ home: $route.path == '/' }"
                >
                  <icon variant="menu" />
                  <span>
                    {{ $t("labels.catalogue") }}
                  </span>
                </div>
                <div
                  class="header__catalog-list"
                  :class="{ active: showCatalog }"
                >
                  <catalog-list
                    v-if="categories"
                    :categories="sortedCategories"
                  />
                </div>
              </div>
            </div>
            <div class="col-9 col-lg-6 d-flex align-items-center">
              <div
                class="header__mobile-menu--toggle d-flex d-lg-none"
                @click="showMobileDrawer = true"
              >
                <icon variant="menu" />
              </div>
         
            </div>
            <div class="col-3">
              <div class="header__language text-right">
                <header-language />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <header-mobile-drawer
      :show="showMobileDrawer"
      @close="showMobileDrawer = false"
      ref="mobileDrawer"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import headerSearch from "@/layout/header-components/header-search.vue";
import headerUser from "@/layout/header-components/header-user.vue";
import catalogList from "@/layout/header-components/header-catalog.vue";
import _ from "lodash";
import headerLanguage from "./header-components/header-language.vue";
import HeaderMobileDrawer from "./header-components/header-mobile-drawer.vue";
export default {
  data() {
    return {
      showMobileDrawer: false,
      showCatalog: false,
      isSeller: true,
      hideTop: false,
    };
  },
  watch: {
    $route() {
      this.showCatalog = false;
      this.showMobileDrawer = false;
      this.$refs.mobileDrawer.showCatalog = false;
    },
  },
  computed: {
    sortedCategories() {
      return _.orderBy(this.categories, ["position"], ["asc"]);
    },

    ...mapGetters({
      translationsLoaded: "translationsLoaded",
      isAuthenticated: "sanctum/isAuthenticated",
      user: "sanctum/getUser",
      role: "role",
      categories: "categories",
    }),
  },
  components: {
    headerSearch,
    catalogList,
    headerUser,
    headerLanguage,
    HeaderMobileDrawer,
  },
  mounted() {
    this.detectScrollDirection();
  },
  methods: {
    toggleCatalog() {
      this.showCatalog = !this.showCatalog;
    },
    detectScrollDirection() {
      //Show hide partly header on scroll
      var lastScrollTop = 0;
      window.addEventListener(
        "scroll",
        () => {
          var st = window.pageYOffset || document.documentElement.scrollTop;
          if (st > lastScrollTop && st > 60) {
            this.hideTop = true;
          } else {
            this.hideTop = false;
          }
          lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        },
        false
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding-top: 8px;
  background: #1bc1a1;
  margin-bottom: 30px;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  transition: 0.4s;
  &.hideTop {
    transition: 0.6s;
    transform: translate(0, -52px);
    @media (min-width: 1025px) {
      transform: translate(0, -68px);
    }
  }

  .btn {
    height: 36px;
  }
  &__mobile-menu--toggle {
    padding: 6px;
    margin-right: 10px;
    border-radius: 3px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      background-color: rgba(#fff, 0.2);
      transition: 0.3s;
    }
    & > svg {
      fill: #fff;
      height: 26px;
      width: 26px;
    }
  }
  &__logo {
    @media (max-width: 768px) {
      text-align: center;
      display: block;
    }
    img {
      transform: translateY(-4px);
      max-width: 100%;
      @media (max-width: 768px) {
        transform: translateY(-2px);
        height: 36px;
      }
    }
  
  }
  &__beta {
    font-weight: 100;
    color: #000;
  align-self: flex-start;
font-size: 12px;
margin-top: 5px;

  }

  &__links {
   
    ul {
      list-style: none;
      display: flex;
justify-content: space-around;
      padding: 0;
      margin: 0; width: 100%;
      li {  display: flex;
          align-items: center;
            text-align: center;
        a {
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
        width: 100%;
      
          color: #000000;
          text-transform: uppercase;
          // margin-right: 40px;
        }
      }
    }
  }
  &__login-btn {
    border-color: transparent;
  }
  &__subheader {
    margin-top: 8px;
    background: var(--secondary-color);
    height: 44px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  &__language {
    color: #e7e7e7;
    font-size: 13px;
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      justify-content: flex-end;
      li {
        &:last-child {
          .separator {
            display: none;
          }
        }
      }
    }
    .separator {
      font-style: normal;
      margin: 0px 6px;
    }
    span {
      color: #fff;
    }
    a {
      color: var(--primary-color);
    }
  }

  &__catalog {
    position: relative;
    &-list {
      position: absolute;
      background: #fff;
      top: 100%;
      left: 0;
      right: 0;
      box-shadow: 0px 6px 16px 0px rgba(#000, 0.2);
      padding: 20px 0px;
      visibility: hidden;
      opacity: 0;
      transform: translateY(-20px);
      transition: 0.3s;
      z-index: 30;
      &.active,
      &.home {
        visibility: visible;
        opacity: 1;
        transform: translateY(0px);
        transition: 0.3s;
      }
      &.home {
        box-shadow: 0px 6px 8px 0px rgba(#000, 0.1);
      }
      .catalog-item {
        a {
          color: #000;
          text-decoration: none;
          display: flex;
          padding: 3px 8px;
          align-items: center;
          justify-content: flex-start;
          & > span {
            font-weight: 600;
          }
          & > .cat-icon {
            width: 18px;
            height: 18px;
            margin-right: 16px;
            margin-left: 6px;
          }
          & > svg:not(.cat-icon) {
            transform: rotate(-90deg);
            margin-left: auto;
            width: 13px;
            height: 13px;
          }
          &:hover {
            background: #e7e7e7;
          }
        }
        .children-items {
          box-shadow: 0px 6px 6px 0px rgba(#000, 0.1);
          padding: 20px 0px;
          position: absolute;
          min-width: 400px;
          top: 0;
          min-height: 100%;
          background: #fff;
          position: absolute;
          box-sizing: border-box;
          border: 1px solid rgba(#1ac1a1, 0.2);
          left: 100%;
          visibility: hidden;
          opacity: 0;
          transition: 0.3s;
        }
        &:hover {
          & > a {
            background: rgba(#1ac1a1, 0.2);
          }
          & > .children-items {
            visibility: visible;
            opacity: 1;
            transition: 0.3s;
          }
        }
      }
    }
    .toggle {
      padding: 8px;
      height: 44px;
      display: flex;
      align-items: center;
      transition: 0.3s;

      &:hover,
      &.active,
      &.home {
        background: rgba(#fff, 0.1);
        transition: 0.3s;
      }
      svg {
        fill: #fff;
        margin-right: 20px;
        margin-left: 6px;
      }
      cursor: pointer;
      color: #fff;
    }
  }
}
</style>
