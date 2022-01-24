<template>
  <div class="add-lots" :class="{ notValid: isError }">
    <div class="container">
      <b-row>
        <b-col>
          <b-card>
            <b-overlay
              id="overlay-add-product"
              :show="isLoading"
              variant="white"
              opacity="0.8"
              spinner-variant="#f00"
              blur="none"
            >
              <h2 class="border-bottom pb-4 mb-4">Масова загрузка лотів</h2>
              <div v-show="cards && cards.length && cards.length < 1">
                <b-alert show variant="warning">{{
                  $t("warnings.add_card_before_adding_a_lot")
                }}</b-alert>
              </div>
              <b-tabs content-class="mt-4" pills fill v-model="tab_index">
                <b-tab active>
                  <template #title>
                    <!-- <icon
                      v-show="validateTabOne.tab_valid"
                      variant="check"
                      class="mr-2"
                    /> -->
                    Завантаження файлу, терміни лоту
                  </template>
                  <div
                    class="
                      d-flex
                      w-100
                      justify-content-center
                      align-items-center
                    "
                  >
                    <div class="add-lots__file form-group_file mb-4 mr-5">
                      <h5 class="tab-subtitle">Завантаження файлу*</h5>
                      <b-form-file
                        class="file-input mx-auto d-block"
                        placeholder="Завантажте файл..."
                        drop-placeholder="Перемістіть файл сюди...."
                        :browse-text="
                          file == null ? `Додати файл` : 'Змінити файл'
                        "
                        v-model="file"
                        :class="{ isValid: !isEmpty }"
                      />
                    </div>
                    <div class="form-group d-flex flex-column mt-4">
                      <div class="mb-2">
                        <label>{{ $t("labels.date_start") }}*</label>
                        <b-form-datepicker
                          id="product-start"
                          v-model="product.date_start"
                          :state="validateTabOne.date_start"
                          class="mb-2"
                        ></b-form-datepicker>
                      </div>
                      <div>
                        <label>{{ $t("labels.date_end") }}*</label>
                        <b-form-datepicker
                          id="product-end"
                          v-model="product.date_end"
                          :state="validateTabOne.date_end"
                          class="mb-2"
                        ></b-form-datepicker>
                      </div>
                    </div>
                  </div>
                </b-tab>

                <!-- /name-tab -->
                <b-tab :disabled="isEmpty">
                  <template #title>
                    <!-- <icon v-show="message != 0" variant="check" class="mr-2" /> -->
                    Статус завантаження</template
                  >
                  <div v-if="file != null" class="container">
                    <div class="row text-center">
                      <div class="col-md-3">
                        <strong>Файл</strong>
                        <div class="mt-2">{{ file.name }}</div>
                      </div>
                      <div class="col-md-3">
                        <strong>Дата завантаження </strong>
                        <div class="mt-2">{{ downloadDate }}</div>
                      </div>
                      <div class="col-md-3">
                        <strong> {{ $t("labels.date_start") }} </strong>
                        <div class="mt-2">{{ dateStart }}</div>
                      </div>
                      <div class="col-md-3">
                        <strong>{{ $t("labels.date_end") }}</strong>
                        <div class="mt-2">{{ dateEnd }}</div>
                      </div>
                    </div>

                    <b-button
                      variant="primary"
                      @click="downloadProduct()"
                      class="d-block mx-auto mt-5"
                    >
                      Завантажити
                    </b-button>
                  </div>
                  <div
                    class="
                      request
                      d-flex
                      justify-content-center
                      align-items-center
                      pt-4
                      mt-4
                      border-top
                    "
                    :class="{ notValid: !downloadStatus }"
                  >
                    {{ message }}
                  </div>
                </b-tab>
                <!-- /pricing-tab -->
              </b-tabs>

              <div
                class="
                  d-flex
                  justify-content-center
                  align-items-center
                  pt-4
                  mt-4
                  border-top
                "
              >
                <b-button
                  class="mr-2"
                  v-if="tab_index != 0"
                  @click="tab_index -= 1"
                >
                  Назад
                </b-button>
                <b-button
                  v-if="tab_index < 1"
                  variant="primary"
                  class="px-4"
                  :disabled="nextDisabled"
                  @click="nextTab()"
                >
                  Далі
                </b-button>
                <b-button
                  v-else
                  variant="primary"
                  @click="saveProduct"
                  :disabled="!downloadStatus"
                >
                  Зберегти
                </b-button>
              </div>
            </b-overlay>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      cards: [],
      isLoading: false,
      tab_index: 0,
      tab_completed: [false, false, false],
      downloadStatus: false,
      file: null,
      isError: false,
      message: "",
      product: {
        user_id: null,
        payment_type: 1,
        delivery_type: 1,
        date_start: "2021-04-02",
        date_end: "2021-04-27",
        location: 12,
        visible: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "sanctum/isAuthenticated",
      user: "sanctum/getUser",
      role: "role",
    }),


    validateTabOne() {
      var product = this.product;
      var valid = {
        date_start: true,
        date_end: true,
        tab_valid: false,
        has_cards: false,
        file: false,
      };
      if (this.file !== null) {
        valid.file = true;
      }
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!product.date_start || new Date(product.date_start) < today) {
        valid.date_start = false;
      }
      if (
        !product.date_end ||
        new Date(product.date_end) < new Date(product.date_start)
      ) {
        valid.date_end = false;
      }
      if (this.cards.length > 0) {
        valid.has_cards = true;
      }

      if (valid.date_start && valid.date_end && valid.file && valid.has_cards) {
        valid.tab_valid = true;
      }
      return valid;
    },
    validateTabTwo() {
      var valid = {
        tab_valid: true,
      };
      if (this.pricing_tab_valid == false) {
        valid.tab_valid = false;
      }
      return valid;
    },
    nextDisabled() {
      var disabled = false;
      var tab = this.tab_index;
      if (tab == 0 && !this.validateTabOne.tab_valid) {
        disabled = true;
      }


      return disabled;
    },
    isEmpty() {
      if (this.file == null) {
        return true;
      } else {
        return false;
      }
    },
    dateStart() {
      return this.product.date_start.split("-").reverse().join(". ");
    },
    dateEnd() {
      return this.product.date_end.split("-").reverse().join(". ");
    },
    downloadDate() {
      let d = new Date();
      return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
    },
  },

  methods: {
    checkFile() {
      this.isEmpty = false;
      if (this.file == null) {
        return (this.isEmpty = true);
      } else {
        return (this.isEmpty = false);
      }
    },
    checkIfUserHasCard() {
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
            if (cards != null) {
              this.cards.push(cards);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },




    nextTab() {
      this.tab_index += 1;
    },

    getTranslatedLabel(translations) {
      var locale = this.$i18n.locale;
      var title;
      for (var i = 0; i < translations.length; i++) {
        if (translations[i].locale && translations[i].locale == locale) {
          title = translations[i].title;
        }
      }
      return title;
    },
    addPrice() {
      var lastIndex = Number(this.product.prices.length - 1);
      var min = Number(this.product.prices[lastIndex].min - 1);
      if (min < 0) {
        min = 0;
      }
      var price = Number(this.product.prices[lastIndex].price + 1);
      this.product.prices.push({
        min: min,
        max: Number(min - 1),
        price: price,
      });
    },
    downloadProduct() {
      this.isLoading = true;
      this.product.user_id = this.user.id;
      //Create formdata for sending
      var bodyFormData = new FormData();
      bodyFormData.append("file", this.file);
      for (var key in this.product) {
        bodyFormData.append(key, this.product[key]);
      }
      var url =
        "https://devapi.together.biz.ua/api/user/profile/products/import";
      var method = "post";

      axios({
        method: method,
        url: url,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          this.message =
            `Ваші данні успішно завантажені. Кількість доданих товарів - ${response.data.count} Для завершення натисніть 'Зберегти'`;
          this.isLoading = false;
          this.downloadStatus = true;
           this.isError = false;

          // this.$router.push({ name: "my", params: { tab: "lots" } });
        })
        .catch((error) => {
          this.isLoading = false;
          this.isError = true;
          if (error.response.data.message == "products-import-error") {
            this.message =
              "Виникла помилка! Файл, який ви завантажуєте має бути в форматі XML";
            setTimeout(function () {
              this.message = " ";
            }, 7000);
          } else {
            this.message =
              "Виникла помилка! Перевірте правильність заповнення полів";
            setTimeout(function () {
              this.message = "";
            }, 7000);
          }
          this.downloadStatus = false;
        });
    },
    saveProduct() {
      this.$router.push({ name: "my", params: { tab: "lots" } });
    },


  },
  mounted() {
    this.checkIfUserHasCard();
    let today = new Date();
    this.product.date_start = moment(today).format("YYYY-MM-DD");
    today.setDate(today.getDate() + 1);
    this.product.date_end = moment(today).format("YYYY-MM-DD");
  },
};
</script>

<style lang="scss" scoped>
.add-lots {
  .svg-icon {
    fill: var(--primary-color);
  }
  &__file {
    padding-right: 40px;
  }

  &__category {
    &-all {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
    }
    &-button {
      display: flex;
      width: 33.3333%;
      max-width: 33.333%;
      padding: 5px;
      button {
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        text-align: left;
        padding: 8px;
        cursor: pointer;
        background: #e7e7e7 !important;
        width: 100%;
        border: none;
        position: relative;
        border-radius: 4px;
        padding-right: 20px;
        line-height: 1.2;
        font-size: 14px;
        svg {
          height: 12px;
          right: 6px;
          position: absolute;
        }
      }
    }
  }
  .tab-subtitle {
    font-weight: 600;
  }

  &__range-graph {
    padding-right: 30px;
    .range {
      padding: 0px 80px;
      .bg {
        width: 80px;
        min-height: 260px;
        background: #1bbea1;
      }
    }
  }
  .request {
    height: 50px;
    color: var(--primary-color);
    font-weight: bold;
    &.notValid {
      color: red;
    }
  }
}
</style>
