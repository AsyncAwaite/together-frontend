<template>
  <div class="search__input-group" v-click-outside="hide">
    <input
      type="text"
      :placeholder="$t('labels.search')"
      v-model="searchTerm"
    />
    <button class="d-none d-lg-inline-flex">
      <icon variant="search" />
    </button>
    <div class="search__results" v-show="showSearchResults">
      <div class="bg">
        <b-overlay
          id="overlay-auth-modal"
          :show="isLoading"
          variant="white"
          opacity="0.8"
          spinner-variant="#f00"
          blur="none"
        >
          <div class="item" v-for="p in products.slice(0, 8)" :key="p.id">
            <router-link :to="{ name: 'product', params: { slug: p.slug } }">
              <div
                class="thumb"
                :class="{ no_image: !p.images_url[0] }"
                :style="{ 'background-image': 'url(' + thumb_url(p) + ')' }"
              ></div>
              {{ p.title }}
            </router-link>
          </div>
        </b-overlay>
      </div>
    </div>
  </div>
</template>

<script>
import { SEARCH_PRODUCTS } from "@/constants/graphql";
import ClickOutside from "vue-click-outside";
export default {
  data() {
    return {
      searchTerm: "",
      isLoading: false,
      products: [],
      no_image: require("@/assets/img/no_image.png"),
    };
  },
  directives: {
    ClickOutside,
  },
  computed: {
    showSearchResults() {
      var show = false;
      if (this.searchTerm && this.products.length > 0) {
        show = true;
      }

      return show;
    },
  },
  watch: {
    searchTerm: {
      handler() {
        var timeout;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (this.searchTerm.length > 0) {
            this.doSearch();
          }
        }, 600);
      },
    },
  },
  methods: {
    hide() {
      this.searchTerm = "";
      this.products = [];
    },
    thumb_url(p) {
      var url = this.no_image;
      if (p.images_url[0]) {
        url = p.images_url[0];
      }
      return url;
    },
    doSearch() {
      this.isLoading = true;
      this.$apollo
        .query({
          query: SEARCH_PRODUCTS,
          update: (data) => {
            return data.products;
          },
          variables: {
            search: this.searchTerm,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          console.log(data);
          this.products = data.data.products.data;
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = true;
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  &__results {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    .bg {
      background: #fff;
      margin-top: 10px;
      box-shadow: 0px 10px 24px 0px rgba(#000, 0.3);
      border-radius: 4px;
      padding: 8px 0px;
      min-height: 64px;
      .item {
        border-bottom: 1px solid #e7e7e7;
        &:last-child {
          border-bottom: none;
        }
        a {
          padding: 5px 10px;
          display: flex;
          .thumb {
            height: 42px;
            width: 42px;
            min-width: 42px;
            margin-right: 10px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
          &:hover {
            background: rgba(#e7e7e7, 0.5);
          }
        }
      }
    }
  }
  &__input-group {
    display: flex;
    flex-grow: 2;
    position: relative;
    * {
      outline: none !important;
    }
    input {
      flex-grow: 2;
      height: 32px;
      border: none;
      padding: 0px 8px;
      font-size: 14px;
      border-bottom-left-radius: 3px;
      border-top-left-radius: 3px;
      @media (max-width: 1024px) {
        border-radius: 3px;
      }
    }
    button {
      height: 32px;
      border: none;
      width: 40px;
      background: #aeabab;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-bottom-right-radius: 3px;
      border-top-right-radius: 3px;
      svg {
        fill: #fff;
      }
    }
  }
}
</style>
