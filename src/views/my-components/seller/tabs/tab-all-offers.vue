<template>
  <div>
    <h3 class="d-flex justify-content-between mb-4">
      {{ $t("view_titles.my_lots") }}

      <!-- <b-button size="sm" variant="primary" @click="checkIfUserHasCard">
        <icon variant="plus" color="#fff" class="mr-2" />{{ $t("buttons.add") }}
        
      </b-button> -->
      <b-button
            size="sm" variant="primary" 
            @click="openAddingModal"
          >
           <icon variant="plus" color="#fff" class="mr-2" />{{ $t("buttons.add") }} 
          </b-button>
        
    </h3>
    <template v-if="!isloading && !my_products.length">
      <message>
        {{$t('message.no_lots')}}
      </message>
    </template>
    <template v-if="isloading">
      <myLotSkeleton v-for="n in 18" :key="n" />
    </template>
    <template v-else>
      <div class="my__item" v-for="item in my_products" :key="item.id">
        <div class="thumb">
          <router-link :to="{ name: 'product', params: { slug: item.slug } }">
            <div
              class="bg"
              :style="{ 'background-image': 'url(' + item.images_url[0] + ')' }"
            ></div>
          </router-link>
        </div>
        <div class="text">
          <router-link :to="{ name: 'product', params: { slug: item.slug } }">
            <h4 class="mt-0">
              {{ item.title }}
            </h4>
          </router-link>
          <div class="data flex-wrap">
            <div class="colunn pr-4">
              <div class="data-item">
                <span> {{ $t("labels.quantity") }}: </span> {{ item.total }}
                {{ $t("labels.pcs") }}
              </div>
              <div class="data-item">
                <span> {{ $t("labels.amount_sold") }}: </span>
                {{ item.total_bought }}
                {{ $t("labels.pcs") }}
              </div>
              <div class="data-item">
                <span> {{ $t("labels.amount_views") }}: </span> {{ item.views }}
              </div>
            </div>
            <div class="column pr-4">
              <div class="data-item">
                <span> {{ $t("labels.creation_date") }}: </span>
                {{ item.created_at | moment("calendar") }}
              </div>
              <div class="data-item">
                <span> {{ $t("labels.sale_start") }}: </span>
                {{ item.date_start | moment("calendar") }}
              </div>
              <div class="data-item">
                <span> {{ $t("labels.sale_end") }}: </span>
                {{ item.date_end | moment("calendar") }}
              </div>
            </div>
            <div class="column pr-4">
              <div class="data-item">
                <span> {{ $t("labels.current_price") }}: </span>
                {{ item.created_at | moment("calendar") }}
              </div>
              <div class="data-item">
                <span> {{ $t("labels.price_range") }}: </span>
                {{ item.prices[0].price }} -
                {{ item.prices[item.prices.length - 1].price }}
                {{ $t("labels.uah") }}/{{ $t("labels.pcs") }}
              </div>
              <div class="data-item">
                <span>{{ $t("labels.lot_status") }}: </span>
                <b-badge class="d-inline-block mt-1" v-if="item.status == 3">
                  {{ $t("labels.lot_status-1") }}
                </b-badge>
                <b-badge
                  class="d-inline-block mt-1"
                  v-if="item.status == 0"
                  variant="warning"
                >
                  {{ $t("labels.lot_status-2") }}
                </b-badge>
                <b-badge
                  class="d-inline-block mt-1"
                  v-if="item.status == 1"
                  variant="success"
                >
                  {{ $t("labels.lot_status-3") }}
                </b-badge>
                <b-badge
                  class="d-inline-block mt-1"
                  v-if="item.status == 4"
                  variant="danger"
                >
                  {{ $t("labels.lot_status-4") }}
                </b-badge>
              </div>
            </div>
          </div>
          <b-alert show v-if="item.moderation_message" variant="warning">{{
            item.moderation_message
          }}</b-alert>
        </div>
        <div class="actions d-flex justify-content-end w-100 pt-2">
          <b-button
            variant="outline-danger"
            size="sm"
            @click="openRemoveingModal(item.id)"
          >
            {{ $t("buttons.delete") }}
          </b-button>
        </div>
      </div>
    </template>
    <b-pagination
      align="center"
      class="mt-4"
      v-show="!isloading && totalOrders / perPage > 1"
      first-number
      last-number
      v-model="currentPage"
      :total-rows="totalOrders"
      :per-page="perPage"
      :key="paginationKey"
      :limit="10"
      @change="fetchItems"
    ></b-pagination>
    <b-modal id="product-removing-modal" hide-header hide-footer>
      <b-overlay
        id="overlay-remove-modal"
        :show="$apollo.loading"
        variant="white"
        opacity="0.8"
        spinner-variant="#f00"
        blur="none"
      >
        <h4>
          Видалити товар остаточно?
        </h4>
        <template slot:modal-footer>
          <div class="d-flex">
            <b-button   @click="cancelRemove()">
              Cancel
            </b-button>
            <b-button @click="removeProduct">
              Confirm remove
            </b-button>
          </div>
        </template>
      </b-overlay>
    </b-modal>
      <b-modal id="product-adding-modal" hide-header hide-footer>
      <b-overlay
        id="overlay-adding-modal"
        :show="$apollo.loading"
        variant="white"
        opacity="0.8"
        spinner-variant="#f00"
        blur="none"
      >
        <h4>
  Оберіть метод додавання лоту(лотів)
        </h4>
        <template slot:modal-footer>
          <div class="d-flex">
            <b-button class="mr-3" variant="outline-primary" @click="checkIfUserHasCard" >
              Додати 1 лот
            </b-button>
            <b-button  variant="primary" @click="addingLots">
              Масова загрузка
            </b-button>
          </div>
        </template>
      </b-overlay>
    </b-modal>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { PRODUCT_BY_USER_ID } from "@/constants/graphql";
import { mapGetters } from "vuex";
import { myLotSkeleton } from "@/components/skeletons";
export default {
  data() {
    return {
      isloading: false,
      product_to_remove_id: null,
      my_products: [],
      currentPage: 1,
      totalPages: 0,
      perPage: 18,
      totalFound: 0,
      totalOrders: 0,
      paginationKey: 999,
    };
  },
  components: {
    myLotSkeleton,
  },
  computed: {
    ...mapGetters({
      user: "sanctum/getUser",
    }),
  },
  methods: {
    fetchItems(page = 1) {
      this.isloading = true;
      this.$apollo
        .query({
          query: PRODUCT_BY_USER_ID,
          update: (data) => {
            return data.products;
          },
          variables: {
            user_id: this.user.id,
            page: page,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          this.my_products = data.data.products.data;

          var paginator = data.data.products.paginatorInfo;

          //Scroll to top
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          this.currentPage = paginator.currentPage;
          this.perPage = paginator.perPage;
          this.totalPages = Number(paginator.lastPage);
          this.totalOrders = Number(paginator.total);
          this.isloading = false;
          this.totalFound = paginator.total;
          this.paginationKey++;
          this.isloading = false;
        })
        .catch((error) => {
          this.isloading = false;
          console.log(error);
        });
    },
    cancelRemove() {
      this.product_to_remove_id = null;
      this.$bvModal.hide("product-removing-modal");
    },
    openRemoveingModal(id) {
      this.product_to_remove_id = id;
      this.$bvModal.show("product-removing-modal");
    },
    openAddingModal(){
this.$bvModal.show("product-adding-modal");
    },
    addCardPopup() {
      this.$bvModal
        .msgBoxOk(this.$t("warnings.add_card_before_adding_a_lot"), {
          title: "Майже там!",
          size: "lg",
          buttonSize: "md",
          okVariant: "warning",
          okTitle: this.$t("view_titles.my_payment_methods"),
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          console.log(value);
          if (value == true) {
            this.$router.push({
              name: "my",
              params: { tab: "payment-methods" },
            });
          }
        })
        .catch((error) => {
          // An error occurred
          console.log(error);
        });
    },
    // checkIfUserHasCard() { Рабочий вариант с картами
    //   // this.initialLoading = true;
    //   var url = "/api/get-user-cards";
    //   this.$api
    //     .get(url)
    //     .then((data) => {
         
    //       let cards = data.data.data;
    //         this.$router.push({ name: "addLot" });
    //       // console.log(cards);
    //       // this.addCardPopup();
    //       if (Array.isArray(cards) == true) {
    //         if (cards.length && cards.length > 0) {
    //           this.$router.push({ name: "addLot" });
    //         } else {
    //           this.addCardPopup();
    //         }
    //       } else {
    //         if (cards != null) {
    //           this.$router.push({ name: "addLot" });
    //         } else {
    //           this.addCardPopup();
    //         }
    //       }
    //       this.initialLoading = false;
    //     })
    //     .catch((error) => {
    //       this.initialLoading = false;
    //       console.log(error);
    //     });
    // },
       checkIfUserHasCard() {
      // this.initialLoading = true;
    
       this.$router.push({ name: "addLot" });   
         this.addCardPopup();
       this.initialLoading = false;
    
    },
        addingLots() {
      // this.initialLoading = true;
    
       this.$router.push({ name: "addLots" });   
         this.addCardPopup();
       this.initialLoading = false;
    
    },
    removeProduct() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: ID!) {
              userProfileDeleteProduct(id: $id)
            }
          `,
          variables: {
            id: this.product_to_remove_id,
          },
        })
        .then((data) => {
          this.cancelRemove();
          this.fetchItems();
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.fetchItems();
  },
};
</script>

<style lang="scss" scoped>
.my__item {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
  flex-wrap: wrap;
  .text {
    padding: 0px 20px;
    flex-grow: 3;
  }
  .data-item {
    margin-bottom: 12px;
    span {
      font-size: 10px;
      display: block;
      line-height: 1;
      font-weight: 400;
    }
    color: #000;
    font-size: 14px;
    font-weight: 600;
  }
  .data {
    display: flex;
    justify-content: space-between;
    min-width: 100%;
    flex-wrap: wrap;
    .column {
      padding-right: 25px;
      flex: 1;
      &.delivery {
        min-width: 100%;
        .data-item {
          font-weight: 600;
          font-size: 13px;
        }
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
  .thumb {
    width: 200px;
    height: 160px;
    min-width: 200px;
    position: relative;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-position: center;
      background-size: cover;
    }
    img {
      max-width: 100%;
    }
  }
}
</style>
