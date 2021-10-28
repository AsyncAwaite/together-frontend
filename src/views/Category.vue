<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-3">
          <div
            class="category__filter mt-md-2"
            :class="{ show: showMobileFilter }"
          >
            <h2
              class="mb-4 d-flex d-md-none align-items-center justify-content-between"
            >
              <strong>{{ $t("labels.filtering") }}</strong>
              <div v-show="!isloading">
                <b-button
                  size="sm"
                  variant="light"
                  @click="showMobileFilter = false"
                  ><icon variant="close"
                /></b-button>
              </div>
            </h2>
            <div class="subcategory-filter filter-group">
              <h4 class="filter-title mb-3" v-show="!isloading">
                {{ $t("labels.category") }}
              </h4>
              <Subcategories :category="category" :loading="isloading" />
            </div>
            <div class="price-filter filter-group pt-2" v-show="!isloading && products.length">
              <h4 class="filter-title mb-4 pb-3" v-show="!isloading">
                {{ $t("labels.price") }}
              </h4>
              <div class="px-2" >
                <PriceFilter
                  :categoryPriceRange="categoryPriceRange"
                  @change="doFiltering"
                  @input="manualPriceInput"
                  :range="filter.price.range"
                />
              </div>
            </div>
            <div class="fitler-group mt-4 pt-3 d-block d-md-none filter-button">
              <b-overlay
                id="overlay-auth-modal"
                :show="productsLoading"
                variant="white"
                opacity="0.8"
                spinner-variant="#f00"
                blur="none"
              >
                <div class="text-center mb-1">
                  {{ $t("labels.items_found") }}
                  <strong>{{ totalFound }}</strong>
                </div>
                <b-button
                  block
                  variant="primary"
                  @click="showMobileFilter = false"
                >
                  {{ $t("buttons.close") }}
                </b-button>
              </b-overlay>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-9">
          <div class="row">
            <div class="col-12">
              <categoryTitleSkeleton v-if="isloading" />
              <template v-else>
                <h1 v-html="categoryTitleByLang(category)">
                  {{ category.title }}
                </h1>
                <p v-html="categoryDescrByLang(category)"></p>
              </template>
            </div>
          </div>
          <div
            class="category__filter-holder d-block d-md-none  mb-2"
            ref="filterButton"
          >
            <b-button
              block
              class="d-block d-md-none filter-toggle"
              :class="{ fixed: filterFixed }"
              variant="outline-dark"
              @click="showMobileFilter = true"
              ><span>{{ $t("labels.filtering") }}</span>
              <icon class="ml-2" variant="filter"
            /></b-button>
          </div>
          <Sorting
            v-show="!isloading && products.length"
            :orderBy="orderBy"
            @update="applySorting"
          />
          <b-card class="mb-4">
            <div class="row">
              <template v-if="!productsLoading && !products.length">
                <div class="col w-100">
                  <message>
                    {{ $t("message.no_product_found") }}
                  </message>
                </div>
              </template>
              <template v-if="productsLoading">
                <div
                  class="col-12 col-sm-6 col-md-4 mb-4"
                  v-for="n in 18"
                  :key="n"
                >
                  <productCardSkeleton />
                </div>
              </template>
              <template v-else>
                <div
                  v-for="p in products"
                  :key="p.id"
                  class="col-12 col-sm-6 col-md-4"
                >
                  <productListCard :p="p" />
                </div>
              </template>
            </div>
            <b-pagination
              align="center"
              class="mt-4"
              v-show="!isloading && totalProducts / perPage > 1"
              first-number
              last-number
              v-model="currentPage"
              :total-rows="totalProducts"
              :per-page="perPage"
              :key="paginationKey"
              :limit="10"
              @change="getProductsOnFiltering"
            ></b-pagination>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CATEGORY_BY_SLUG, PRODUCTS_IN_CATEGORY } from "@/constants/graphql";
import productListCard from "@/components/lists/product-list-card.vue";
import Subcategories from "./category-components/category-subcategories.vue";
import PriceFilter from "./category-components/category-price-filter.vue";
import Sorting from "./category-components/category-sorting.vue";
import {
  productCardSkeleton,
  categoryTitleSkeleton,
} from "@/components/skeletons";
export default {
  //  metaInfo: {
  //     title: this.data.category.title,
   
  //   },
  data() {
    return {
      filterFixed: false,
      category: {},
      products: [],
      isloading: false,
      productsLoading: false,
      currentPage: 1,
      totalPages: 0,
      paginationKey: 1,
      totalProducts: null,
      perPage: 18,
      categoryPriceRange: {
        min: 1,
        max: 100,
      },
      showMobileFilter: false,
      filter: {
        price: {
          range: [0, 1],
          min: null,
          max: null,
        },
      },
      orderBy: {
        order: "ASC",
        column: "CREATED_AT",
      },
      totalFound: 0,
    };
  },
  
  components: {
    productListCard,
    PriceFilter,
    Subcategories,
    productCardSkeleton,
    categoryTitleSkeleton,
    Sorting,
  },
  watch: {},
  methods: {
    checkIfFIlterButtonVisible() {
      var el = this.$refs.filterButton;
      var offsetTop;
      var windowScroll;
      window.addEventListener("scroll", () => {
        windowScroll = window.scrollY;
        offsetTop = el.offsetTop;
        if (windowScroll > offsetTop + 80) {
          this.filterFixed = true;
        } else {
          this.filterFixed = false;
        }
      });
    },
    manualPriceInput(value) {
      this.filter.price.min = Number(value.min);
      this.filter.price.max = Number(value.max);
      var range = [];
      range[0] = Number(value.min);
      range[1] = Number(value.max);
      this.filter.price.range = range;
      this.getProductsOnFiltering(1);
    },
    applySorting(value) {
      // alert(JSON.stringify(value));
      this.orderBy = value;
      var page = this.currentPage;
      this.getProductsOnFiltering(page);
    },
    doFiltering(value) {
      this.filter.price.min = value.value[0];
      this.filter.price.max = value.value[1];
      var range = [];
      range[0] = Number(value.value[0]);
      range[1] = Number(value.value[1]);
      this.filter.price.range = range;
      this.currentPage = 1;
      this.getProductsOnFiltering(this.currentPage);
    },
    getProductsOnFiltering(page) {
      this.products = [];
      this.productsLoading = true;
      var slug = this.$route.params.slug;

      var filter = {};
      if (this.filter.price.min !== null && this.filter.price.max !== null) {
        filter["price_from"] = Number(
          parseFloat(this.filter.price.min).toFixed(0)
        );
        filter["price_to"] = Number(
          parseFloat(this.filter.price.max).toFixed(0)
        );
      }

      var orderBy = [];
      this.$apollo
        .query({
          query: PRODUCTS_IN_CATEGORY,
          update: (data) => {
            return data.category;
          },
          variables: {
            slug: slug,
            page: page,
            filter: filter,
            orderBy: orderBy,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          Object.assign(this.products, data.data.productsForCategory.data);
          var paginator = data.data.productsForCategory.paginatorInfo;
          var newUrl =
            this.$route.path +
            "?page=" +
            page +
            "&price_from=" +
            filter.price_from +
            "&price_to=" +
            filter.price_to;
          window.history.pushState(
            {
              page: page,
              price_from: filter.price_from,
              price_to: filter.price_to,
            },
            "Title",
            newUrl
          );

          //Scroll to top
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          this.currentPage = paginator.currentPage;
          this.perPage = paginator.perPage;
          this.totalPages = Number(paginator.lastPage);
          this.totalProducts = Number(paginator.total);
          this.productsLoading = false;
          this.totalFound = paginator.total;
          this.paginationKey++;
        })
        .catch((error) => {
          console.log(error);
          this.productsLoading = false;
        });
    },
    getCategory() {
      this.isloading = true;
      this.productsLoading = true;
      var slug = this.$route.params.slug;
      var page = 1;
      if (this.$route.query.page) {
        page = Number(this.$route.query.page);
      }

      this.$apollo
        .query({
          query: CATEGORY_BY_SLUG,
          update: (data) => {
            return data.category;
          },
          variables: {
            slug: slug,
            page: page,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          //category price range
          this.categoryPriceRange.min = Number(
            parseFloat(data.data.category.price.min).toFixed(0)
          );
          this.categoryPriceRange.max = Number(
            parseFloat(data.data.category.price.max).toFixed(0)
          );
          var initial_price_range = [];
          if (!this.$route.query.price_from) {
            initial_price_range[0] = Number(
              parseFloat(data.data.category.price.min).toFixed(0)
            );
            initial_price_range[1] = Number(
              parseFloat(data.data.category.price.max).toFixed(0)
            );
            this.filter.price.range = initial_price_range;
          } else if (
            this.$route.query.price_from &&
            this.$route.query.price_to
          ) {
            if (
              !isNaN(
                Number(parseFloat(this.$route.query.price_from).toFixed(0))
              ) &&
              !isNaN(Number(parseFloat(this.$route.query.price_to)).toFixed(0))
            ) {
              //Check if price
              this.filter.price.min = Number(
                parseFloat(this.$route.query.price_from).toFixed(0)
              );
              this.filter.price.max = Number(
                parseFloat(this.$route.query.price_to)
              ).toFixed(0);

              this.filter.price.range = [];
              this.filter.price.range[0] = this.filter.price.min;
              this.filter.price.range[1] = this.filter.price.max;
            } else {
              initial_price_range = [];
              initial_price_range[0] = Number(
                parseFloat(data.data.category.price.min).toFixed(0)
              );
              initial_price_range[1] = Number(
                parseFloat(data.data.category.price.max).toFixed(0)
              );
              this.filter.price.range = initial_price_range;
            }
          }

          this.category = data.data.category;
          if (data.data.productsForCategory.data.length > 0) {
            this.products = [];
            var newProducts = data.data.productsForCategory.data;
            this.products = newProducts;
          }
          this.products = data.data.productsForCategory.data;
          var paginator = data.data.productsForCategory.paginatorInfo;
          this.currentPage = paginator.currentPage;
          this.perPage = paginator.perPage;
          this.totalPages = Number(paginator.lastPage);
          this.totalProducts = Number(paginator.total);
          this.totalFound = paginator.total;
          this.isloading = false;
          this.productsLoading = false;
          this.paginationKey++;
        })
        .catch((error) => {
          console.log(error);
          this.isloading = false;
          this.productsLoading = true;
        });
    },
    categoryTitleByLang(cat) {
      var title = "...";
      var locale = this.$i18n.locale;
      if (cat && cat.translations) {
        for (var i = 0; i < cat.translations.length; i++) {
          if (cat.translations[i].locale == locale) {
            title = cat.translations[i].title;
          }
        }
      }

      return title;
    },
    categoryDescrByLang(cat) {
      var title = "...";
      var locale = this.$i18n.locale;
      if (cat && cat.translations) {
        for (var i = 0; i < cat.translations.length; i++) {
          if (cat.translations[i].locale == locale) {
            title = cat.translations[i].description;
          }
        }
      }

      return title;
    },
  },
  mounted() {
    this.getCategory();
    this.checkIfFIlterButtonVisible();
  },
  metaInfo () {
    return {
      title: this.categoryTitleByLang(this.category),
      titleTemplate: `%s | ${this.$t('pages.main_title')}`,
    }
  }
};
</script>

<style lang="scss">
.category {
  &__filter-holder {
    height: 48px;
  }
  &__filter {
    margin-bottom: 80px;
    @media (max-width: 768px) {
      margin: 0px !important;
      margin-top: 0 !important;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(#fff, 0.92);
      backdrop-filter: blur(8px);
      z-index: 999;
      padding: 30px;
      transform: translateX(-100%);
      transition: 0.3s;
      &.show {
        transform: translateX(0%);
        transition: 0.3s;
      }
    }
  }
}
.subcategory-filter {
  margin-bottom: 50px;
  border-bottom: 1px solid #e7e7e7;
  padding-bottom: 10px;
}
// .price-filter {
// }
.filter-button {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  box-shadow: 0px 0px 16px 0px rgba(#000, 0.2);
}
.filter-toggle {
  transition: 0s !important;
  &.fixed {
    position: fixed;
    right: 0px;
    top: 110px;
    z-index: 50;
    width: 48px;
    background: var(--primary-color);
    border-color: var(--primary-color);
    box-shadow: 0px 0px 12px 0px rgba(#000, 0.2);
    span {
      display: none;
    }
    svg {
      margin-left: 0 !important;
    }
  }
  svg {
    fill: #000;
    transition: 0.3s;
  }
  &:hover {
    svg {
      fill: #fff;
      transition: 0.3s;
    }
  }
}
.filter-group {
  .filter-title {
    font-weight: 600;
    font-size: 16px;
  }
}
.page-item {
  margin: 0px 5px;
  button {
    border-radius: 6px;
    color: #000 !important;
  }
  &.active {
    button {
      box-shadow: 0px 3px 6px 0px rgba(#000, 0.2);
      background-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
      color: #fff !important;
    }
  }
}
</style>
