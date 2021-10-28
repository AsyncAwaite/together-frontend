<template>
  <div>
    <h3 class="mb-4">{{ $t("view_titles.my_favourites") }}</h3>
    <div class="row">
      <template>
        <div class="col-12">
          <template v-if="!isloading && items.length < 1">
            <message>
              <slot>
              {{$t("labels.no_favourites")}}
              </slot>
            </message>
          </template>
          <template v-ele>
            <div class="row">
              <div
                class="col-12 col-sm-6 col-md-4"
                v-for="p in items"
                :key="p.id"
              >
                <productListCard :p="p" />
              </div>
            </div>
          </template>

          <template v-if="isloading">
            <div class="row">
              <div
                class="col-12 col-sm-6 col-md-4 mb-4"
                v-for="n in 6"
                :key="n"
              >
                <productCardSkeleton />
              </div>
            </div>
          </template>
          <b-pagination
            v-if="totalRows > perPage"
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import productListCard from "@/components/lists/product-list-card.vue";
import { productCardSkeleton } from "@/components/skeletons";
import { mapActions, mapGetters } from "vuex";
import { PRODUCTS_BY_IDS } from "@/constants/graphql";
export default {
  data() {
    return {
      isloading: false,
      perPage: 6,
      currentPage: 1,
      items: [],
    };
  },
  watch: {
    currentPage: {
      handler() {
        const state = { page: this.currentPage };
        const title = "";
        const url = this.$route.path + "?page=" + this.currentPage;
        window.history.pushState(state, title, url);
        this.getFavouriteProducts();
      },
    },
  },
  computed: {
    ...mapGetters({
      user: "sanctum/getUser",
    }),
    totalRows() {
      return this.user.favourites.length;
    },
    itemsToDisplay() {
      var indexes = {};
      var startIndex = 0;
      var page = this.currentPage;
      var perPage = this.perPage;
      var endIndex = this.perPage;

      if (page > 1) {
        startIndex = perPage * (page - 1);
        endIndex = perPage * page;
      }

      indexes["start"] = startIndex;
      indexes["end"] = endIndex;

      return indexes;
    },
  },
  components: {
    productListCard,
    productCardSkeleton,
  },
  methods: {
    ...mapActions({
      fetchUser: "sanctum/fetchUser",
    }),
    getFavouriteProducts() {
      this.items = [];
      this.isloading = true;
      if (this.user) {
        var all_favourites = this.user.favourites.slice(
          this.itemsToDisplay.start,
          this.itemsToDisplay.end
        );
      }
      this.$apollo
        .query({
          query: PRODUCTS_BY_IDS,
          update: (data) => {
            return data.products;
          },
          variables: {
            ids: all_favourites,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          //Scroll to top
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          this.items = data.data.products;
          this.isloading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isloading = false;
        });
    },
    addToFavourites() {
      if (this.user.id) {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($id: ID!) {
                productLikedOrDisLiked(id: $id)
              }
            `,
            variables: {
              id: this.product.id,
            },
          })
          .then((data) => {
            this.fetchUser();
            this.getFavouriteProducts();
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.$store.dispatch("switchToLogin");
        this.$bvModal.show("auth-modal");
      }
    },
  },
  mounted() {
    this.getFavouriteProducts();
    if (this.$route.query.page) {
      this.currentPage = Number(this.$route.query.page);
    }
  },
};
</script>

<style lang="scss" scoped></style>
