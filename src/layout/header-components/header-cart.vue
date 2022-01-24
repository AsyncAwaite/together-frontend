<template>
  <div class="header__cart">
    <b-button
      variant="light"
      size="sm"
      class="has_new"
      @click="cartOpen = !cartOpen"
    >
      <icon variant="shopping-cart" />
      <div class="count" v-if="count">
        {{ count }}
      </div>
    </b-button>
    <template v-if="cartOpen && cart.length > 0">
      <div
        class="cart"
        :style="
          headerWidth > 578 ? { width: '450px' } : { width: headerWidth + 'px' }
        "
      >
        <b-overlay
          variant="white"
          opacity="0.8"
          spinner-variant="#f00"
          blur="none"
          :show="isloading"
        >
          <div
            v-for="p in products"
            :key="p.id"
            class="cart__item d-flex mb-2 align-items-center"
          >
            <div
              class="thumb mr-2"
              :style="{
                backgroundImage: 'url(' + p.images_url[0] + ')',
              }"
            >
              <img
                class="dummy"
                v-if="!p.images_url[0]"
                src="@/assets/img/no_image.png"
                height="48"
                alt=""
              />
            </div>
            <div class="cart__item-title mr-3 font-weight-bold">
              {{ p.title }}
            </div>
            <div
              class="
                cart__item-qty
                d-flex
                align-items-center
                justify-content-center
                mr-2
              "
            >
              {{ p.qty }}
            </div>
            <div class="cart__item-price font-weight-bold text-center">
              {{ p.qty * p.actual_price }}
            </div>
            <b-button
              variant="light"
              size="sm"
              @click="deleteItem(p.id)"
              class="ml-2 mb-2 cart__item-trash"
            >
              <icon variant="trash" />
            </b-button>
          </div>
          <hr />
          <div class="text-right font-weight-bold mb-3">
            Всього: {{ this.getSumm() }}грн.
          </div>
          <b-button block variant="primary" @click="initOrderCreation">{{
            $t("labels.approve_order")
          }}</b-button>
        </b-overlay>
      </div>
    </template>
    <!-- <create-order-modal-buy-now-no-user
      :product="product"
      :qty="qty"
      :user="user"
      :open="orderModalBuyNowNoUser"
      @close="orderModalBuyNowNoUser = false"
    />
    <create-order-modal-buy-now
      :product="product"
      :qty="qty"
      :user="user"
      :open="orderModalBuyNow"
      @close="orderModalBuyNow = false"
    /> -->
  </div>
</template>

<script>
import { PRODUCTS_BY_IDS } from "@/constants/graphql";
// import createOrderModalBuyNowNoUser from "@/components/modals/create-order-modal-buy-now-no-user.vue";
// import createOrderModalBuyNow from "@/components/modals/create-order-modal-buy-now.vue";
export default {
  components: {
    // createOrderModalBuyNow,
    // createOrderModalBuyNowNoUser,
  },
  data() {
    return {
      cart: [],
      isloading: false,
      count: 0,
      productsId: [],
      products: [],
      cartOpen: false,
      orderModalBuyNowNoUser: false,
      orderModalBuyNow: false,
      sum: 0,
    };
  },

  created() {
    if (this.localCart) {
      this.cart = JSON.parse(window.localStorage.getItem("cart"));
      this.count = this.cart.length;
      this.getProductsId();
      this.getProduct();
    }
  },
  computed: {
    localCart() {
      return JSON.parse(localStorage.getItem("cart"));
    },

    headerWidth() {
      const header = document.querySelector(".header");
      return header.scrollWidth;
    },
  },
  methods: {
    async getProduct() {
      try {
        this.isloading = true;
        const response = await this.$apollo.query({
          query: PRODUCTS_BY_IDS,
          update: (data) => {
            return data.products;
          },
          variables: {
            ids: this.productsId,
          },
          fetchPolicy: "network",
        });
        this.products = response.data.products;
        this.products.forEach((product) => {
          this.cart.forEach((item) => {
            if (product.id === item.id) {
              product.qty = item.qty;
            }
          });
        });
        this.isloading = false;
        return this.products;
      } catch (e) {
        throw new Error(e);
      }
    },
    getProductsId() {
      this.cart.forEach((product) => {
        this.productsId = [...this.productsId, product.id];
      });
    },
    deleteItem(id) {
      let idx;
      const localStorageCart = JSON.parse(localStorage.getItem("cart"));
      localStorageCart.forEach((item, index) => {
        if (item.id === id) {
          if (item.qty > 1) {
            item.qty--;
            return localStorage.setItem(
              "cart",
              JSON.stringify(localStorageCart)
            );
          } else {
            return (idx = index);
          }
        }
      });
      if (idx || idx === 0) {
        localStorageCart.splice(idx, 1);
        this.count = localStorageCart.length;
        this.cart = localStorageCart;
        this.productsId = [];
        this.getProductsId();
        this.getProduct();
        localStorage.setItem("cart", JSON.stringify(localStorageCart));
      }
      this.deleteEvent();
      this.getSumm();
    },
    getSumm() {
      let sum = 0;
      this.products.forEach((product) => {
        sum += product.qty * product.actual_price;

        return sum;
      });
      return sum;
    },

    deleteEvent() {
      const event = new Event("deleteFromCart");
      window.dispatchEvent(event);
    },
    getQty() {
      this.products.forEach((product) => {
        this.cart.forEach((item) => {
          if (product.id === item.id) {
            product.qty = item.qty;
          }
        });
      });
    },
    initOrderCreation() {
      // if (this.user.id) {
      //   this.orderModalBuyNow = true;
      // } else {
      this.orderModalBuyNowNoUser = true;

      // }
    },
  },
  mounted() {
    this.getSumm();
    window.addEventListener("addToCart", () => {
      const localStorageCart = JSON.parse(localStorage.getItem("cart"));
      if (localStorageCart.length !== this.cart) {
        this.count = localStorageCart.length;
        this.cart = localStorageCart;
        this.productsId = [];
        this.getProductsId();
        this.getProduct();
        this.getQty();
      }
    });
  },
  watch: {
    cart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
  },
};
</script>

<style lang="scss" scoped>
.header__cart {
  display: flex;
  margin-left: 12px;
  align-items: center;
  position: static;
  svg {
    height: 28px;
    width: 28px;
    fill: #464a53;
    opacity: 0.5;
  }
  .btn-light {
    background: transparent;
    border: none;
    position: relative;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    @media (max-width: 768px) {
      height: 32px;
      width: 32px;
      padding: 0;
      svg {
        height: 22px;
        width: 22px;
      }
    }
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: rgba(#464a53, 0.1) !important;
    }
    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
    &:active,
    &.show {
      background: rgba(#464a53, 0.2) !important;
      border: none !important;
      box-shadow: none !important;
    }
    &.has_new {
      svg {
        opacity: 0.8;
      }
      .count {
        display: flex !important;
      }
    }
    .count {
      //   display: none;
      min-width: 20px;
      height: 20px;
      background: #ffc108;
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 50%;
      color: #000;
      font-size: 12px !important;
      line-height: 1;
      align-items: center;
      justify-content: center;
    }
  }
  .cart {
    position: absolute;
    width: 450px;
    padding: 15px;
    font-size: 14px;
    height: auto;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.125);
    top: 54px;
    right: 0;
    z-index: 100;
    @media (max-width: 768px) {
      top: 42px;
    }
    @media (max-width: 576px) {
      top: 42px;
      right: 0;
    }
    &__item {
      width: 100%;
      &-title {
        font-size: 12px;
        flex: 1;
      }
      &-qty {
        font-size: 16px;
        height: 30px;
        width: 30px;

        padding: 5px;
        border: 1px solid rgba(0, 0, 0, 0.125);
      }
      &-trash {
        &:hover {
          cursor: pointer;
        }
      }
      &-price {
        min-width: 50px;
      }
    }
  }
  .thumb {
    flex: 1;
    height: 64px;
    width: 64px;
    min-width: 64px;
    max-width: 64px;
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    display: flex;
    border: 1px solid rgba(0, 0, 0, 0.125);
    .dummy {
      max-height: 80%;
      max-width: 80%;
      height: auto;
    }
  }
}
</style>
