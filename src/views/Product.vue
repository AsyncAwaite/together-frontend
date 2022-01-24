<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1>{{ product.title }}</h1>
          <b-card>
            <b-tabs pills>
              <b-tab active>
                <template #title>
                  {{ $t("view_titles.product_tab_one_title") }}
                </template>
                <div class="row pt-4">
                  <div class="col-12 col-md-6">
                    <productImagesSkeleton v-if="productIsLoading" />
                    <product-images
                      v-else
                      :product="product"
                      :purchased="alreadyPurchased"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <productAddCartSkeleton v-if="productIsLoading" />
                    <template v-else>
                      <product-purchase-graph
                        :product="product"
                        :purchased="alreadyPurchased"
                        :qty="qty"
                      />
                      <product-price-and-purchase
                        ref="purchaseBlock"
                        :product="product"
                        :purchased="alreadyPurchased"
                        @update="setQty"
                      />
                    </template>
                  </div>
                  <div class="col-12 mt-4">
                    <productDescription :product="product" />
                  </div>
                </div>
              </b-tab>
              <!-- <b-tab>
                <template #title>
                  {{ $t("view_titles.product_tab_two_title") }}
                </template>
              </b-tab>
              <b-tab>
                <template #title>
                  {{ $t("view_titles.product_tab_three_title") }}
                </template>
              </b-tab> -->
              <!-- <b-tab>
                <template #title>
                  {{ $t("view_titles.product_tab_four_title") }}
                </template>
              </b-tab> -->
            </b-tabs>
          </b-card>
          <b-card class="mt-4 mb-4">
            <h2 class="text-center mb-4">
              {{ $t("labels.product_sellers_other_lots") }}
            </h2>
            <template v-if="isloading">
              <div class="row">
                <div class="col-12 col-sm-6 col-md-3" v-for="n in 4" :key="n">
                  <productCardSkeleton />
                </div>
              </div>
            </template>
            <template v-else>
              <productListCarousel :products="sellers_products" />
            </template>
          </b-card>
          <b-card
            class="mt-4 mb-4"
            v-if="similar_products && similar_products.length > 0"
          >
            <h2 class="text-center mb-4">
              {{ $t("labels.product_simila_products_title") }}
            </h2>
            <template v-if="similar_is_loading">
              <div class="row">
                <div class="col-12 col-sm-6 col-md-3" v-for="n in 4" :key="n">
                  <productCardSkeleton />
                </div>
              </div>
            </template>
            <template v-else>
              <productListCarousel :products="similar_products" />
            </template>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productListCarousel from "@/components/lists/product-list-carousel.vue";
import productImages from "./product-components/product-images.vue";
import productDescription from "./product-components/product-description.vue";
import productPurchaseGraph from "./product-components/product-purchase-graph.vue";
import productPriceAndPurchase from "./product-components/product-price-and-purchase.vue";
import { mapGetters } from "vuex";
import {
  PRODUCT_BY_SLUG,
  PRODUCT_BY_USER_ID,
  SIMILAR_PRODUCTS,
  GET_SIMILAR_BY_IDS,
} from "@/constants/graphql";
import {
  productCardSkeleton,
  productImagesSkeleton,
  productAddCartSkeleton,
} from "@/components/skeletons";
export default {
  components: {
    productImages,
    productPurchaseGraph,
    productPriceAndPurchase,
    productListCarousel,
    productDescription,
    productCardSkeleton,
    productImagesSkeleton,
    productAddCartSkeleton,
  },
  data() {
    return {
      productIsLoading: false,
      isloading: false,
      product: {},
      sellers_products: {},
      qty: 1,
      alreadyPurchased: 45,
      similar_products: [],
      similar_is_loading: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "sanctum/getUser",
      isAuthenticated: "sanctum/isAuthenticated",
      viewedProducts: "viewedProducts",
    }),
  // orderInProgress() {
  //   let inProgress = false;
  //   if(this.$refs.purchaseBlock.orderModalOpen === true ||)
  //   return inProgress

  // }
  },
  watch: {
    $route(to, from) {
      console.log(to, from);
      this.getCategory();
    },
    product: {
      deep: true,
      handler() {
        if (this.product.user_id) {
          this.getSameSellerProducts();
          if (this.isAuthenticated) {
            if (this.similar_products.length < 1) {
              this.getSimilarProducts();
            }
          } else {
            this.addWatchedItem();
            if (this.similar_products.length < 1) {
              this.getSimilarForAnonymous();
            }
          }
        }
      },
    },
  },
  methods: {
    getProduct() {
      if (!this.product.total) {
        this.productIsLoading = true;
      }

      this.$apollo
        .query({
          query: PRODUCT_BY_SLUG,
          update: (data) => {
            return data.product;
          },
          variables: {
            slug: this.$route.params.slug,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          this.product = data.data.product;
          this.productIsLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.productIsLoading = false;
        });
    },
    setQty(value) {
      this.qty = value;
    },
    getSameSellerProducts() {
      this.isloading = true;

      this.$apollo
        .query({
          query: PRODUCT_BY_USER_ID,
          update: (data) => {
            return data.products;
          },
          variables: {
            user_id: this.product.user_id,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          this.sellers_products = data.data.products.data;
          this.isloading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isloading = false;
        });
    },
    getSimilarForAnonymous() {
      if (this.viewedProducts.length > 0) {
        this.similar_is_loading = true;
        this.$apollo
          .mutate({
            mutation: GET_SIMILAR_BY_IDS,
            variables: {
              ids: this.viewedProducts,
            },
          })
          .then((data) => {
            this.similar_is_loading = false;
            if (data.data.getSimilarProductsByIds) {
              this.similar_products = data.data.getSimilarProductsByIds;
            }
          })
          .catch((error) => {
            this.similar_is_loading = false;
            console.error(error);
          });
      }
    },
    getSimilarProducts() {
      this.isloading = true;

      this.$apollo
        .query({
          query: SIMILAR_PRODUCTS,
          update: (data) => {
            return data.products;
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          this.similar_products = data.data.products;
          this.isloading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isloading = false;
        });
    },
    addWatchedItem() {
      var items = Object.assign(this.viewedProducts);
      if (!items.includes(this.product.id)) {
        items.push(this.product.id);
      }
      if (items.length > 12) {
        items = items.slice(0, 11);
      }

      this.$store.dispatch("setViewedProducts", items);
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
  },
  mounted() {
    this.getProduct();

    //poll for purcahses while product is opened
    setInterval(() => {
      if (this.$refs.purchaseBlock && this.$refs.purchaseBlock.orderModalOpen !== true) {
        console.log('fetching product')
        this.getProduct();
      }
    }, 5000);
  },
    metaInfo () {
    return {
      title: this.product.title,
      titleTemplate: `%s | ${this.$t('pages.main_title')}`, 
         meta: [
      { name: "description", content: `${this.$t("pages.main_meta_descr")}` },
    ],
    }
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 576px) {
h1 {
  font-size: 1.5rem;
}
}
</style>
