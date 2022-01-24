<template>
  <div>
    <b-button
      variant="light"
      size="sm"
      @click="add"
      class="shopping-cart"
      :disabled="qtyLimit"
    >
      <icon variant="shopping-cart" />

      <span v-if="count > 0" class="count">{{ count }} </span>
      <span v-if="!isProductList" class="text" v-show="!qtyLimit">
        {{ $t("buttons.add_2-cart") }}
      </span>
    </b-button>
  </div>
</template>
<script>
export default {
  props: ["product", "isProductList"],
  data() {
    return {
      cart: [],
      newProduct: {
        id: "",
        qty: 0,
      },
      qtyLimit: false,
      localCart: "",
      count: 0,
    };
  },
  created() {
         
    if (this.localStorageCart) {
      this.cart = JSON.parse(window.localStorage.getItem("cart"));
      this.localStorageCart.forEach((item) => {
        if (this.product.id == item.id) {
          this.count = item.qty;
        }
      });
    }
  },
  computed: {
    localStorageCart() {
      return  JSON.parse(localStorage.getItem("cart"));
    },
  },

  methods: {
    add() {
      this.cart = JSON.parse(window.localStorage.getItem("cart"));

      // this.showCount();
      if (this.cart) {
        if (this.cart.length) {
          let inCart = false;
          this.cart.map((item) => {
            if (this.product.id == item.id) {
              item.qty++;
              inCart = true;
            }
          });
          if (!inCart) {
            this.newProduct.id = this.product.id;
            this.newProduct.qty++;
            this.cart.push(this.newProduct);
          }
        } else {
          this.cart = [];
          this.newProduct.id = this.product.id;
          this.newProduct.qty++;
          this.cart.push(this.newProduct);
        }
      } else {
        this.cart = [];
        this.newProduct.id = this.product.id;
        this.newProduct.qty++;
        this.cart.push(this.newProduct);
      }
      this.showCount();
    
    },

    // addProductInCart() {
    //   if (this.qty) {
    //     this.addFromPriceAndPurchase();
    //   } else {
    //     this.addFromProductList();
    //   }
    // },
    // addFromPriceAndPurchase() {
    //   this.cart = JSON.parse(window.localStorage.getItem("cart"));
    //   if (this.cart) {
    //     if (this.cart.length) {
    //       let inCart = false;
    //       this.cart.map((item) => {
    //         if (this.product.id == item.id) {
    //           item.qty = +item.qty;
    //           let itemsLeft = +this.product.total - item.qty;

    //           if (this.qty > itemsLeft) {
    //             this.qty = itemsLeft;
    //             item.qty += +this.qty;
    //             inCart = true;
    //           } else {
    //             item.qty = +item.qty;
    //             item.qty += +this.qty;
    //             inCart = true;
    //           }

    //           this.saveCart();
    //         }
    //       });
    //       if (!inCart) {
    //         this.newProduct.id = this.product.id;
    //         this.newProduct.qty = this.qty;
    //         this.cart.push(this.newProduct);
    //         this.saveCart();
    //       }
    //     }
    //   } else {
    //     this.cart = [];
    //     this.newProduct.id = this.product.id;
    //     this.newProduct.qty = this.qty;
    //     this.cart.push(this.newProduct);
    //     this.saveCart();
    //   }
    //   this.showCount();
    // },
    // addFromProductList() {
    //   this.cart = JSON.parse(window.localStorage.getItem("cart"));
    //   if (this.cart) {
    //     if (this.cart.length) {
    //       let inCart = false;
    //       this.cart.map((item) => {
    //         if (this.product.id == item.id) {
    //           item.qty++;
    //           inCart = true;
    //           this.saveCart();
    //         }
    //       });
    //       if (!inCart) {
    //         this.newProduct.id = this.product.id;
    //         this.newProduct.qty++;
    //         this.cart.push(this.newProduct);
    //         this.saveCart();
    //       }
    //     }
    //   } else {
    //     this.cart = [];
    //     this.newProduct.id = this.product.id;
    //     this.newProduct.qty++;
    //     this.cart.push(this.newProduct);
    //     this.saveCart();
    //   }
    //   this.showCount();
    // },
    // emitQty() {
    //   if (this.product) {
    //     var total = Number(this.product.total);
    //     var purchased = Number(this.product.total_bought);
    //     var itemsLeft = total - purchased;
    //     // console.log(itemsLeft);
    //     if (this.qty > itemsLeft) {
    //       this.qty = itemsLeft;
    //     }
    //     if (this.qty <= 0) {
    //       this.qty = 1;
    //     }
    //   }
    //   this.$emit("update", this.qty);
    // },

    // saveCart() {
    //   localStorage.setItem("cart", JSON.stringify(this.cart));
    //   // this.showCount();
    // },
    showCount() {
     
      if (+this.count !== +this.product.total) {
         
        this.cart.forEach((item) => {
          if (item.id === this.product.id) {
            this.count = item.qty;
          }
        });
      } else {
        this.qtyLimit = true;
      }
    },
    event() {
      const event = new Event("addToCart", { detail: this.count });
      window.dispatchEvent(event);
    },
  },

  mounted() {
    window.addEventListener("addToCart", () => {
      this.cart = JSON.parse(localStorage.getItem("cart"));
      this.cart.forEach((item) => {
        if (item.id === this.product.id) {
          this.count = item.qty;
        }
      });
    });
    window.addEventListener("deleteFromCart", () => {
   
     
      this.newProduct = {
        id: "",
        qty: 0,
      };
       this.count = 0;
   
      
    });
  },
  watch: {
    cart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    count() {

      this.showCount();
      this.event();
    },
  },
};
</script>
<style lang='scss' scoped>
.shopping-cart {
  background: transparent;
  border: none;

  &.btn-light {
    position: relative;
    border-radius: 0.25rem;
    width: 2.5rem;
    height: 2.5rem;
    padding: 10px 8px !important;
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
    &.shopping-cart {
      svg {
        opacity: 0.8;
      }
    }
  }
  svg {
    height: 28px;
    width: 28px;
    fill: var(--primary-color);
    opacity: 0.5;
  }
  .count {
    display: flex !important;
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
    font-weight: bold;
  }
  .text {
    position: absolute;
    bottom: -4px;
    font-size: 9px;
  }
}
</style>