<template>
  <div>
    <b-modal
      id="items-in-cart"
      v-model="open"
      hide-footer
      hide-header-close
      v-b-modal.modal-lg
      no-close-on-backdrop
      no-close-on-esc
      class="order-modal"
    >
      <template #modal-title>
        <icon variant="shopping-cart" color="#666" class="mr-2" />{{
          $t("labels.create_order")
        }}
      </template>
      <b-overlay
        id="overlay-order-create"
        :show="isloading"
        variant="white"
        opacity="0.8"
        spinner-variant="#f00"
        blur="none"
      >
        <div class="order-modal__content">
          <div class="form-group">
            <div class="product d-flex">
              <div
                class="thumb"
                :style="{
                  backgroundImage: 'url(' + product.images_url[0] + ')',
                }"
              >
                <img
                  class="dummy"
                  v-if="!product.images_url[0]"
                  src="@/assets/img/no_image.png"
                  height="48"
                  alt=""
                />
              </div>
              <div class="text">
                <h5 class="bordered-title">
                  {{ product.title }}
                </h5>
                <div class="qty d-flex align-items-center">
                  <div>{{ $t("labels.quantity") }}:</div>
                  <b-input
                    type="number"
                    size="sm"
                    v-model="qty"
                    @change="emitQty"
                  >
                  </b-input>
                </div>
              </div>
            </div>
          </div>

        
        </div>
        <div class="order-modal__footer pt-3">
          <div
            class="
              order-modal__total
              d-flex
              align-items-center
              justify-content-between
              py-2
            "
          >
            <span>{{ $t("labels.total") }}:</span>
            <strong>
              {{ Number(qty) * Number(start_price) }}
              {{ $t("labels.uah") }}</strong
            >
          </div>
          <b-button
            block
            variant="primary"
            :disabled="!orderDataValid"
            @click="placeOrder"
            >{{ $t("labels.approve_order") }}</b-button
          >
          <b-button block variant="outline-danger" @click="emitClose">{{
            $t("labels.cancel")
          }}</b-button>
        </div>
      </b-overlay>
    </b-modal>
    <b-modal> </b-modal>
  </div>
</template>

<script>
import { ORDER_CREATE } from "@/constants/graphql";
import _ from "lodash";
import { mapGetters } from "vuex";
export default {
  props: ["product", "user", "qty", "open"],

  data() {
    return {
      telOptions: {
        placeholder: "Номер телефону",
      },
      isloading: false,
      finalQty: 1,
      phone: "",
      firstName: "",
      buyer: this.user.id ? this.user.id : 0,
      //source data
      //validation
      phoneValid: false,
    };
  },
  computed: {
    ...mapGetters({
      events: "events",
    }),
    start_price() {
      var price = this.product.prices[0].price;
      var all_prices = this.product.prices;
      for (var key in all_prices) {
        if (all_prices[key].price > price) {
          price = all_prices[key].price;
        }
      }

      //Check if buyer covers first pricing step
      var sortedPrices = _.orderBy(this.product.prices, ["price"], ["desc"]);
      var firstRange = sortedPrices[1];
      if (Number(this.qty) >= Number(firstRange.min)) {
        price = firstRange.price;
      }

      return price;
    },
    orderDataValid() {
      var valid = true;

      if (!this.phoneValid) {
        valid = false;
      }
      if (!this.user.id) {
        if (!this.firstName) {
          valid = false;
        }
      }
      return valid;
    },
  },

  methods: {
    emitQty() {
      if (this.product) {
        var total = Number(this.product.total);
        var purchased = Number(this.product.total_bought);
        var itemsLeft = total - purchased;
        console.log(itemsLeft);
        if (this.qty > itemsLeft) {
          this.qty = itemsLeft;
        }
        if (this.qty <= 0) {
          this.qty = 1;
        }
      }
      this.$emit("update", this.qty);
    },

    openSuccessModal() {
      this.emitClose();
      this.$bvModal
        .msgBoxOk(
          "Замовлення успішно створено! Очікуйте дзвінок від менеджера",
          {
            title: "Вітаємо!",
            size: "lg",
            buttonSize: "md",
            okVariant: "success",
            okTitle: "Ok",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          console.log(value);
        })
        .catch((error) => {
          // An error occurred
          console.log(error);
        });
    },
    validateTel(e) {
      if (e.valid) {
        this.phoneValid = e.valid;
      }
    },

    emitClose() {
      this.$emit("close");
    },
    placeOrder() {
      this.isloading = true;
        this.$gtag.event('Купить в 1 клик', {
            'event_category': "покупка товара",
            'event_label': "Нажата кнопка подтвердить заказ",
            'value': 1,
      })

      var order = {
        product_id: Number(this.product.id),
        seller_id: this.product.user_id,
        buyer_id: this.buyer,
        card_id: 0,
        payment_type: 4,
        buyer_name: this.firstName,
        buyer_last_name: this.lastName ? this.lastName : "",
        buyer_email: this.email ? this.email : "",
        buyer_phone: this.phone, //СВЯЗАТЬ С ДАННЫМИ ПОЛЬЗОВАТЕЛЯ
        start_price: Number(this.start_price),
        count: Number(this.qty),
        start_total: Number(this.start_price * this.qty),
        comment: this.orderComment ? (this.orderComment = "test text") : "",
        delivery_type: 0,
        delivery_region: this.selectedRegion
          ? this.selectedRegion.sync_code
          : "",
        delivery_city: this.selectedCity ? this.selectedCity.sync_code : "",
        delivery_warehouse: this.selectedWarehouse
          ? this.selectedWarehouse.sync_code
          : "",
        delivery_street: this.selectedAdress
          ? this.selectedAdress.sync_code
          : "",
        delivery_house: this.selectedHouse ? this.selectedHouse : "",
        delivery_room: this.selectedRoom ? this.selectedRoom : "",
        delivery_comment: "",
         type: 2
      };
      this.$apollo
        .mutate({
          mutation: ORDER_CREATE,
          variables: {
            input: order,
          },
        })
        .then((data) => {
          var id = data.data.userOrderCreate.id;
          this.isloading = false;
          this.thankYou(id);
          console.log(id);
          // this.checkIfOrderPayed(id);
        })
        .catch((error) => {
          this.isloading = false;
          console.error(error);
        });
    },
     thankYou(id) {
      let orderId = id;
      let url =
        location.protocol + "//" + location.host + "/success?id=" + orderId;
      window.open(url, "_self");
    },
  },
  mounted() {
    //Set initial qty

    this.finalQty = this.qty;
  },
};
</script>

<style lang="scss" scoped>
@mixin label-top {
  transform: translateY(3px);
  transition: 0.2s;
  font-size: 10px;
  font-weight: 600;
  color: var(--primary-color);
}
.order-modal {
  &__content {
    .card-type {
      svg {
        height: 24px;
        width: 24px;
      }
    }
    .form-group {
      margin-bottom: 20px;
    }
    .bordered-title {
      position: relative;
      font-size: 16px;
      font-weight: 600;
    }
    .product {
      border-radius: 8px;
      overflow: hidden;
      background-color: lighten(#e7e7e7, 3%);
      padding: 4px;
      align-items: center;
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
        background-color: #fff;
        .dummy {
          max-height: 80%;
          max-width: 80%;
          height: auto;
        }
      }
      .text {
        padding-left: 12px;
        flex: 1;
        box-sizing: border-box;
        h5 {
          color: var(--primary-color);
          margin-bottom: 0px;
        }
        .qty {
          font-size: 13px;
          color: #666;
          input {
            width: 60px;
            text-align: center;
            margin-left: 10px;
          }
          strong {
            color: #000;
          }
        }
      }
    }
  }
  .input-group {
    label {
      &.hasValue {
        @include label-top;
      }
    }
  }
  // &__footer {
  // }
}
</style>
