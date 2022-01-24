<template>
  <div>
    <label for=""
      >{{ $t("labels.price") }} {{ $t("labels.per") }} 1
      {{ $t("labels.pcs") }}</label
    >
    <div class="d-flex justify-content-between">
      <div class="product__price">
        {{ currentPrice }} {{ $t("labels.uah") }}
      </div>
      <!-- <b-button variant="light" size="sm" class="shopping-cart">
        <icon variant="shopping-cart" />
   
     
      </b-button> -->
      <product-add-to-cart v-if="productAvailable" :isProductList='isProductList' :product="product"  />
    </div>

    <div class="product__buy-meta mt-4">
      <div class="item d-flex align-items-center" v-if="productAvailable">
        <label for="">{{ $t("labels.enter_quantity") }}</label>
        <b-input
          type="number"
          @change="emitQty"
          v-model="qty"
          class="qty-input"
        />
      </div>
      <div class="item d-flex align-items-center" v-if="productAvailable">
        <label for="">
          {{ $t("labels.total_cost") }}
        </label>
        <span class="product__subtotal">
          {{ currentPrice * qty }} {{ $t("labels.uah") }}
        </span>
      </div>
    </div>
    <div class="d-flex mt-2 mb-3">
      <div class="product__buy product__buy-one mr-2">
        <!-- :class="{ 'w-100': !this.user.id }" -->
        <b-button
          variant="success"
          block
          @click="initOneClickCreation"
          :disabled="!productAvailable"
          class="d-flex align-items-center justify-content-center"
        >
          <span v-if="!productAvailable">
            {{ $t("buttons.sold_out") }}
          </span>
          <span v-else>
            {{ $t("buttons.one_click") }}
          </span>
        </b-button>
      </div>
      <div class="product__buy product__buy-now">
        <b-button
          variant="success"
          block
          @click="initOrderCreation"
          :disabled="!productAvailable"
          class="d-flex align-items-center justify-content-center"
        >
          <span v-if="!productAvailable">
            {{ $t("buttons.sold_out") }}
          </span>
          <span v-else> {{ $t("buttons.buy_now") }} </span>
        </b-button>
      </div>
      <template v-if="this.user.id">
        <div class="product__favourites">
          <b-button
            @click="addToFavourites"
            variant="light"
            class="ml-2"
            :disabled="$apollo.loading"
          >
            <span v-if="isFavourite">
              <icon variant="like-filled" color="#ffc108" />
            </span>
            <span v-else>
              <icon variant="like" color="#1bc1a1" />
            </span>
          </b-button>
        </div>
      </template>
    </div>
    <div class="product__buy">
      <b-button block @click="awaitPrice">
        <span v-if="!productAvailable">
          {{ $t("buttons.sold_out") }}
        </span>
        <span v-else>
          {{ $t("buttons.await_price") }}
        </span>
      </b-button>
    </div> 
    <create-order-modal
      v-if="isAuthenticated"
      :product="product"
      :qty="qty"
      :user="user"
      :open="orderModalOpen"
      @close="orderModalOpen = false"
    /> 
    <create-order-modal-buy-now
      :product="product"
      :qty="qty"
      :user="user"
      :open="orderModalBuyNow"
      @close="orderModalBuyNow = false"
      :payment='payment'
    />
    <create-one-click-order
      :product="product"
      :qty="qty"
      :user="user"
      :open="orderOneClickOpen"
      @close="orderOneClickOpen = false"
    />
  </div>
</template>

<script>
import gql from "graphql-tag";
import { ORDERS_MINI } from "@/constants/graphql";
// import VueCountdown from "@chenfengyuan/vue-countdown";
import createOrderModal from "@/components/modals/create-order-modal.vue";
// import createOrderModalBuyNowNoUser from "@/components/modals/create-order-modal-buy-now-no-user.vue";
import createOrderModalBuyNow from "@/components/modals/create-order-modal-buy-now.vue";
import createOneClickOrder from "@/components/modals/create-one-click-order.vue";
import productAddToCart from "@/views/product-components/product-add-to-cart.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    // VueCountdown,
    createOrderModal,
    // createOrderModalBuyNowNoUser,
    createOrderModalBuyNow,
    createOneClickOrder,
    productAddToCart,
  },
  props: ["product"],
  data() {
    return {
      qty: 1,
      orderModalOpen: false,
      orderModalBuyNowNoUser: false,
      orderModalBuyNow: false,
      orderOneClickOpen: false,
      isProductList: false,
      payment: 1
    };
  },
  computed: {
    ...mapGetters({
      user: "sanctum/getUser",
      isAuthenticated: "sanctum/isAuthenticated",
    }),
    productAvailable() {
      var available = true;
      if (this.product.total_bought >= this.product.total) {
        available = false;
      }
      return available;
    },
    isFavourite() {
      var status = false;
      if (this.user) {
        var all_favourites = this.user.favourites;
      }
      var id = Number(this.product.id);

      if (all_favourites && all_favourites.includes(id)) {
        status = true;
      }
      return status;
    },
    isInCart() {
      let status = false;
      if (this.user) {
        var all_orders = this.user.orders;
      }
      var id = Number(this.product.id);

      if (all_orders && all_orders.includes(id)) {
        status = true;
      }
      return status;
    },
    dateEndInSecods() {
      if (this.product && this.product.date_end) {
        var date = new Date(this.product.date_end);
        var now = new Date();
        var seconds = date - now;
      }
      return seconds;
    },
    currentPrice() {
      var price = Math.random();
      if (this.product) {
        var index = Number(this.product.prices.length) - 1;
        price = this.product.prices[index].price;
        var prices = this.product.prices;
        var total = Number(this.product.total_bought) + Number(this.qty);
        for (var key in prices) {
          if (total >= prices[key].min && total <= prices[key].max) {
            price = prices[key].price;
          } else if (total == prices[key].min && total == prices[key].max) {
            price = prices[key].price;
          }
        }
      }
      if (price == 0) {
        price = this.getStartingPrice(this.product.prices);
      }
      return price;
    },
  },
  methods: {
    ...mapActions({
      fetchUser: "sanctum/fetchUser",
    }),
    initOneClickCreation() {
      this.orderOneClickOpen = true;
  
    },
    initOrderCreation() {
        this.orderModalBuyNow = true;
        if (this.user.id) {
          this.payment = 1;
        } else {
          this.payment = 2;
        }

    },
    emitQty() {
      if (this.product) {
        var total = Number(this.product.total);
        var purchased = Number(this.product.total_bought);
        var itemsLeft = total - purchased;
        // console.log(itemsLeft);
        if (this.qty > itemsLeft) {
          this.qty = itemsLeft;
        }
        if (this.qty <= 0) {
          this.qty = 1;
        }
      }
      this.$emit("update", this.qty);
    },
    getStartingPrice(prices) {
      var price = 0;
      for (var key in prices) {
        if (price < prices[key].price) {
          price = prices[key].price;
        }
      }

      return price;
    },
    addToFavourites() {
      if (this.user.id) {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation ($id: ID!) {
                productLikedOrDisLiked(id: $id)
              }
            `,
            variables: {
              id: this.product.id,
            },
          })
          .then((data) => {
            this.fetchUser();
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
    getOrders() {
      //добавление в корзину???
      this.$apollo
        .query({
          query: ORDERS_MINI,
          update: (data) => {
            return data.orders;
          },
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.orders = data.data.orders;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    addToOrders() {
      //добавление в корзину???
      this.$apollo
        .mutate({
          mutation: gql`
            mutation ($id: ID!) {
              productLikedOrDisLiked(id: $id)
            }
          `,
          variables: {
            id: this.product.id,
          },
        })
        .then((data) => {
          this.fetchUser();
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    awaitPrice() {
      if (this.user.id) {

        this.orderModalOpen = true;

      } else {
        this.$bvModal.show("auth-modal");
      }
    },
  },
  mounted() {
    
  },
};
</script>

<style lang="scss" scoped>
.product {
  &__time-remaining {
    font-size: 13px;
    span {
      font-weight: 600;
    }
  }
  &__favourites {
    min-width: 64px;
    button {
      min-width: 64px;
      &:focus,
      &:active {
        outline: none !important;
        background: #f8f9fa !important;
        box-shadow: none !important;
        border-color: transparent;
      }
      svg {
        width: 28px;
        height: 28px;
      }
    }
    * {
      outline: none !important;
    }
  }
 
  &__buy {
    min-width: calc(100% - 72px);
    &-one,
    &-now {
      min-width: auto;
      width: 100%;
    }
    &-one {
      button {
        background: none !important;
        color: var(--primary-color);
        transition: all 0.5s linear;
        border-color: var(--primary-color);
        &:hover {
          background: var(--primary-color) !important;
          color: #fff !important;
        }
      }
    }
    &-now {
      button {
        background: var(--primary-color);
        border-color: var(--primary-color);
        &:hover {
          background: var(--primary-color);
          border-color: var(--primary-color);
          filter: brightness(110%);
        }
      }
    }
  }

  &__buy-meta {
    .item {
      padding: 5px 0px;
      font-weight: 600;
      input {
        max-width: 120px !important;
        min-width: 120px !important;
        margin-left: auto;
        margin-right: auto;
      }
      label {
        min-width: 50%;
        max-width: 50%;
        padding-right: 10px;
        margin: 0;
        font-weight: 400;
        font-size: 15px;
      }
      :not(label) {
        min-width: 50%;
        max-width: 50%;
        text-align: center;
      }
    }
  }
  &__price {
    font-style: normal;
    font-weight: 600;
    font-size: 36px;
    line-height: 42px;
    color: #3e525b;
  }
  // .w-100 {
  //   width: 100%;
  // }
}
@media (max-width: 576px) {
.product__buy{
  
      button {
    font-size: 14px;
  }
  
}
}
</style>
