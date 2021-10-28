<template>
  <div>
    <b-modal
      id="create-order-modal"
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
                  <b-input type="number" size="sm" v-model="qty"> </b-input>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <h4 class="bordered-title">
              <span>
                {{ $t("labels.shipment") }}
              </span>
            </h4>
       <b-form-radio-group
              class="mb-2 mt-3 w-100"
              id="delivery-type"
              v-model="delivery.type"
              :options="[
                { text: $t('labels.delivery_department'), value: 2 },
                { text: $t('labels.delivery_courier'), value: 3 },
              ]"
              button-variant="outline-primary"
              name="delivery-type"
              buttons
            ></b-form-radio-group>

            <!-- <b-form-group>
              <b-form-radio
                v-model="shipment"
                name="shipment-method"
                value="У відділенні"
                checked="checked"
                >У відділенні</b-form-radio
              >
              <b-form-radio
                v-model="shipment"
                name="shipment-method"
                value="Кур'єром"
                >Кур'єром</b-form-radio
              >
            </b-form-group> -->
            <b-form-select v-model="selectedRegion" class="mb-2">
              <b-form-select-option :value="null">{{
                $t("labels.choose_region")
              }}</b-form-select-option>
              <b-form-select-option
                v-for="r in formattedRegions"
                :key="r.value.id"
                :value="r.value"
                autocomplete="on"
              >
                {{ r.text }}
              </b-form-select-option>
            </b-form-select>
            <v-select
              :filter="fuseSearch"
              :options="city"
              v-model="selectedCity"
              :loading="isloading"
              :clearable="false"
              @option:selecting="selectCity"
              class="mb-2"
              :class="{ spinner: isloading }"
            >
              <template #no-options="{ search }">
                <div v-if="search">
                  {{ $t("labels.no_results-1") }}
                  <strong>
                    {{ search }}
                  </strong>
                  {{ $t("labels.no_results-2") }}
                </div>
                <div v-else>
                  {{ $t("labels.choose_region") }}
                </div>
              </template>
              <template #selected-option="{ title_ua, title_ru }">
                <div>
                  <span v-if="$i18n.local == 'ua'">
                    {{ title_ua }}
                  </span>
                  <span v-if="$i18n.local == 'ru'">
                    {{ title_ru }}
                  </span>
                  <span v-else>
                    {{ title_ua }}
                  </span>
                </div>
              </template>
              <template #option="{ title_ua, title_ru }">
                <span v-if="$i18n.local == 'ua'">
                  {{ title_ua }}
                </span>
                <span v-if="$i18n.local == 'ru'">
                  {{ title_ru }}
                </span>
                <span v-else>
                  {{ title_ua }}
                </span>
              </template>
            </v-select>
            <template v-if="delivery.type === 2">
              <v-select
                :filter="fuseSearch"
                :options="selectedCity ? selectedCity.warehouses : []"
                v-model="selectedWarehouse"
                :clearable="false"
                :loading="isloading"
                autocomplete="on"
                @option:selecting="selectWarehouse"
              >
                <template #no-options="{ search }">
                  <div v-if="search">
                    {{ $t("labels.no_results-1") }}
                    <strong>
                      {{ search }}
                    </strong>
                    {{ $t("labels.no_results-2") }}
                  </div>
                  <div v-else>
                    {{ $t("labels.choose_city") }}
                  </div>
                </template>
                <template #selected-option="{ title_ua, title_ru }">
                  <div>
                    <span v-if="$i18n.local == 'ua'">
                      {{ title_ua }}
                    </span>
                    <span v-if="$i18n.local == 'ru'">
                      {{ title_ru }}
                    </span>
                    <span v-else>
                      {{ title_ua }}
                    </span>
                  </div>
                </template>
                <template #option="{ title_ua, title_ru }">
                  <span v-if="$i18n.local == 'ua'">
                    {{ title_ua }}
                  </span>
                  <span v-if="$i18n.local == 'ru'">
                    {{ title_ru }}
                  </span>
                  <span v-else>
                    {{ title_ua }}
                  </span>
                </template>
              </v-select>
            </template>
            <template v-else>
              <!-- Подвязка улицы -->
              <v-select
                :filter="fuseSearch"
                :options="selectedCity ? selectedCity.address : []"
                v-model="selectedAdress"
                :clearable="false"
                :loading="isloading"
                autocomplete="on"
                @option:selecting="selectAdress"
              >
                <template #no-options="{ search }">
                  <div v-if="search">
                    {{ $t("labels.no_results-1") }}
                    <strong>
                      {{ search }}
                    </strong>
                    {{ $t("labels.no_results-2") }}
                  </div>
                  <div v-else>
                    {{ $t("labels.choose_city") }}
                  </div>
                </template>
                <template #selected-option="{ title_ua, title_ru }">
                  <div>
                    <span v-if="$i18n.local == 'ua'">
                      {{ title_ua }}
                    </span>
                    <span v-if="$i18n.local == 'ru'">
                      {{ title_ru }}
                    </span>
                    <span v-else>
                      {{ title_ua }}
                    </span>
                  </div>
                </template>
                <template #option="{ title_ua, title_ru }">
                  <span v-if="$i18n.local == 'ua'">
                    {{ title_ua }}
                  </span>
                  <span v-if="$i18n.local == 'ru'">
                    {{ title_ru }}
                  </span>
                  <span v-else>
                    {{ title_ua }}
                  </span>
                </template>
              </v-select>
            </template>
          </div>
          <div class="form-group">
            <h4 class="bordered-title">
              <span>
                {{ $t("labels.payment") }}
              </span>
            </h4>
         
            <!-- <b-form-group>
              <b-form-radio
                v-model="userPayment"
                name="delivery-pay"
                value="У відділенні"
                >У відділенні (наложений платіж)</b-form-radio
              >
              <b-form-radio
                v-model="userPayment"
                name="card-pay"
                value="Оплата картой"
                >Оплата картой</b-form-radio
              >
            </b-form-group> -->
            <!-- на карту у выддыленны -->
             <b-form-radio-group
            class="mb-2 mt-3 w-100"
            id="delivery-payment"
            v-model="delivery.payment"
            :options="[
              { text: $t('labels.payment_department'), value: 2 },
              { text: $t('labels.payment_online'), value: 3 },
            ]"
            button-variant="outline-primary"
            name="delivery-payment"
            buttons
          ></b-form-radio-group>
            <template v-if="delivery.payment=== 3">
              <div v-show="cards.length < 1">
                <b-alert show variant="warning" class="py-1 px-2">
                  {{ $t("warnings.no_added_cards") }}
                  <div class="mt-2 d-flex mb-1">
                    <b-button variant="warning" size="sm" @click="addCard">{{
                      $t("buttons.add_card")
                    }}</b-button>
                  </div>
                </b-alert>
              </div>
              <v-select
                v-if="cards && cards.length > 0"
                :options="cards"
                v-model="selectedPayment"
                :clearable="false"
                autocomplete="on"
                :loading="isloading"
                @option:selecting="selectPayment"
              >
                <template #no-options="{}">
                  <div>
                    {{ $t("labels.no_payments") }}
                  </div>
                </template>
                <template #selected-option="{ masked_card, card_type }">
                  <div class="d-flex align-items-center">
                    <div class="card-type mr-2">
                      <icon v-if="card_type == 'VISA'" variant="visa" />
                      <icon v-else variant="mc" />
                    </div>
                    {{ masked_card }}
                  </div>
                </template>
                <template #option="{ masked_card, card_type }">
                  <div class="d-flex align-items-center">
                    <div class="card-type mr-2">
                      <icon v-if="card_type == 'VISA'" variant="visa" />
                      <icon v-else variant="mc" />
                    </div>
                    {{ masked_card }}
                  </div>
                </template>
              </v-select>
            </template>
            <!-- Оплата по ссылке с бека -->
          </div>
          <div class="for-group mb-4">
            <h4 class="bordered-title">
              <span>
                {{ $t("labels.reciever") }}
              </span>
            </h4>
            <div class="input-group"></div>
            <h6>
              {{ user.name }}
            </h6>
            <vue-tel-input
              :input-options="telOptions"
              @validate="validateTel"
              v-model="phone"
            ></vue-tel-input>
          </div>
          <div class="form-group">
            <h4 class="bordered-title">
              <span>
                {{ $t("labels.comment") }}
              </span>
            </h4>
            <b-form-textarea
              id="textarea"
              v-model="orderComment"
              placeholder=""
              rows="2"
              max-rows="6"
            ></b-form-textarea>
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
import Fuse from "fuse.js";
import { NP_REGIONS, NP_CITY, ORDER_CREATE } from "@/constants/graphql";
import { mapGetters } from "vuex";
import _ from "lodash";
export default {
  props: ["product", "user", "qty", "open"],
  apollo: {
    regions: {
      query: NP_REGIONS,
      update: (data) => {
        return data.npRegions;
      },
    },
  },
  data() {
    return {
      telOptions: {
        placeholder: "Номер телефону",
      },
      isloading: false,
      //Data for order
      selectedPayment: null,
      selectedRegion: null,
      selectedCity: null,
      selectedWarehouse: null,
      selectedAdress: null,
      finalQty: 1,
      phone: "",
      firstName: "",
      lastName: "",
      email: "",
      orderComment: "",
        delivery: {
        type: 2,
        payment: 2
      },
      userPayment: "У відділенні",
      shipment: "У відділенні",

      //source data
      city: [],
      cards: [],
      gettingCardsTimer: null,

      //validation
      phoneValid: false,
    };
  },
  watch: {
    cards: {
      handler() {
        if (this.gettingCardsTimer !== null && this.cards.length) {
          clearInterval(this.gettingCardsTimer);
        }
      },
    },
    selectedRegion: {
      deep: true,
      handler() {
        this.getNpCity();
      },
    },
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
      if (!this.selectedRegion) {
        valid = false;
      }
      if (!this.selectedCity) {
        valid = false;
      }
      if (!this.selectedWarehouse) {
        valid = false;
      }
      if (!this.phoneValid) {
        valid = false;
      }
      // if (!this.selectedPayment) {
      //   valid = false;
      // }
      if (!this.user.id) {
        if (!this.firstName) {
          valid = false;
        }
        if (!this.lastName) {
          valid = false;
        }
        if (!this.email) {
          valid = false;
        }
      }
      return valid;
    },
    formattedRegions() {
      var regions = [];
      for (var key in this.regions) {
        var lang = this.$i18n.locale;
        var item = {
          value: {
            id: this.regions[key].id,
            sync_code: this.regions[key].sync_code,
          },
          text: "",
        };
        if (lang == "en") {
          item.text = this.regions[key].title_ua;
        } else {
          item.text = this.regions[key]["title_" + lang];
        }

        regions.push(item);
      }
      return regions;
    },
  },
  methods: {
    openNoPaymentModal() {
      this.emitClose();
      this.$bvModal
        .msgBoxOk(
          "Замовлення створено, проте нам не вдалося отримати платіж. Товари зарезервовані на 10 хв. Будь ласка, спробуйте сплатии замовлення ще раз",
          {
            title: "Майже там!",
            size: "lg",
            buttonSize: "md",
            okVariant: "warning",
            okTitle: this.$t("view_titles.my_orders"),
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          console.log(value);
          if (value == true) {
            this.$router.push({ name: "my", params: { tab: "orders" } });
          }
        })
        .catch((error) => {
          // An error occurred
          console.log(error);
        });
    },
    openSuccessModal() {
      this.emitClose();
      this.$bvModal
        .msgBoxOk("Замовлення успішно створено і оплачено", {
          title: "Вітаємо!",
          size: "lg",
          buttonSize: "md",
          okVariant: "success",
          okTitle: "Ok",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
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
    fuseSearch(options, search) {
      var keys = ["title_ua"];
      if (this.$i18n.locale == "ru") {
        keys = ["title_ru"];
      }
      if (this.$i18n.locale == "ua" || this.$i18n.locale == "en") {
        keys = ["title_ua"];
      }
      const fuse = new Fuse(options, {
        keys: keys,
        shouldSort: true,
      });
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list;
    },
    selectCity(city) {
      this.selectedCity = city;
      this.selectedWarehouse = null;
      this.selectedAdress = null;
    },
    selectWarehouse(warehouse) {
      this.selectedWarehouse = warehouse;
    },
    selectAdress(adress) {
      this.selectedAdress = adress;
    },
    selectPayment(payment) {
      //Проверка на оплату
      if (this.userPayment.value === "Оплата картой") {
        this.selectedPayment = payment;
      } else {
        this.selectedPayment = payment;
      }
    },
    getNpCity() {
      this.selectedCity = null;
      this.selectedWarehouse = null;
      this.selectedAdress = null;
      this.isloading = true;
      this.$apollo
        .query({
          query: NP_CITY,
          update: (data) => {
            return data.city;
          },
          variables: {
            region_id: this.selectedRegion.id,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          this.city = data.data.npCity;
          this.isloading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isloading = false;
        });
    },
    getUserCards() {
      //Update trigger event in store
      this.$store.dispatch("setEvents", { card_added: false });
      // this.isloading = true;
      if (this.user.id) {
        var url = "/api/get-user-cards";
        this.$api
          .get(url)
          .then((data) => {
            let cards = data.data.data;
            if (Array.isArray(cards) == true) {
              for (var key in cards) {
                this.cards.push(cards[key]);
              }
            } else {
              this.cards.push(cards);
              this.cards.push(cards);
            }
            this.isloading = false;
          })
          .catch((error) => {
            this.isloading = false;
            console.log(error);
          });
      }
    },
    emitClose() {
      this.$emit("close");
    },
    placeOrder() {
      this.isloading = true;

      var order = {
        product_id: Number(this.product.id),
        seller_id: this.product.user_id,
        buyer_id: this.user.id,
        card_id: this.selectedPayment.id,
        buyer_name: this.user.name
          ? this.user.name
          : this.lastName + " " + this.firstName,
        buyer_phone: this.phone, //СВЯЗАТЬ С ДАННЫМИ ПОЛЬЗОВАТЕЛЯ
        start_price: Number(this.start_price),
        count: Number(this.qty),
        start_total: Number(this.start_price * this.qty),
        comment: this.orderComment,
        delivery_type: 1,
        delivery_region: this.selectedRegion.sync_code,
        delivery_city: this.selectedCity.sync_code,
        delivery_warehouse: this.selectedWarehouse.sync_code,
        delivery_comment: "",
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
          this.checkIfOrderPayed(id);
        })
        .catch((error) => {
          this.isloading = false;
          console.error(error);
        });
    },
    checkIfOrderPayed(id) {
      this.$api
        .get("/api/payment-status/" + id)
        .then((response) => {
          if (response.data.result == true) {
            this.openSuccessModal();
            // this.openNoPaymentModal();
          } else {
            this.openNoPaymentModal();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addCard() {
      var target = "";
      var callback_url =
        window.location.protocol +
        "//" +
        window.location.host +
        "/redirect-payment-added";
      var url = "/api/get-form-verification?callback_url=" + callback_url;
      this.$api
        .get(url)
        .then((data) => {
          this.getUserCards();
          target = data.data.data.checkout_url;
          window.open(target, "_blank");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showAuth() {
      this.$bvModal.show("auth-modal");
    },
  },
  mounted() {
    //Set initial qty
    this.getUserCards();
    setInterval(() => {
      if (this.selectedPayment == null && !this.cards.length) {
        this.getUserCards();
      }
    }, 1500);

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
