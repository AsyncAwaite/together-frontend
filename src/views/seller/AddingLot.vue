<template>
  <div class="add-lot">
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
              <h2 class="border-bottom pb-4 mb-4">
                {{ $t("view_titles.creating_a_product") }}
              </h2>
              <div v-show="cards && cards.length && cards.length < 1">
                <b-alert show variant="warning">{{
                  $t("warnings.add_card_before_adding_a_lot")
                }}</b-alert>
              </div>
              <b-tabs content-class="mt-3" pills fill v-model="tab_index">
                <b-tab active>
                  <template #title>
                    <icon variant="check" />
                    {{ $t("view_titles.creating_tab_one_title") }}
                  </template>
                  <div class="d-flex">
                    <div class="step-one__title-and-category flex-2">
                      <div class="form-group mt-2 mb-4">
                        <h5 class="tab-subtitle">
                          {{ $t("labels.name_and_category") }}
                        </h5>
                        <label for="product-title mb-0"
                          >{{ $t("labels.product_name") }}*</label
                        >
                        <b-form-input
                          id="product-title"
                          :state="validateTabOne.title"
                          v-model="product.title"
                        />
                      </div>
                      <div class="form-froup mb-4">
                        <label for="product-category mb-0"
                          >{{ $t("labels.product_category") }}*</label
                        >
                        <div>
                          <b-button
                            v-b-modal.modal-adding-category
                            block
                            :variant="product.catalog_id ? 'success' : 'light'"
                            class="d-flex align-items-center justify-content-between"
                          >
                            <template v-if="product.catalog_id">
                              {{ selectedCategoryLabel }}
                              <icon variant="chevron-right" color="#fff" />
                            </template>
                            <template v-else>
                              {{ $t("labels.choose_category") }}
                              <icon variant="dropdown" />
                            </template>
                          </b-button>
                        </div>
                      </div>
                      <div class="form-group mb-3 pt-3">
                        <label for="product-description"
                          >{{ $t("labels.product_description") }}*</label
                        >
                        <b-form-textarea
                          id="product-description"
                          v-model="product.description"
                          placeholder=""
                          :state="validateTabOne.description"
                          rows="5"
                          max-rows="6"
                        ></b-form-textarea>
                      </div>
                      <div class="form-group d-flex mt-4">
                        <div class="mr-4">
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
                    <div class="step-one__images">
                      <div class="form-group mt-2">
                        <h5 class="tab-subtitle mb-3">
                          {{ $t("labels.product_images") }}
                        </h5>
                        <span class="mb-0 mt-3 d-none allowed-count"
                          >{{ product.images_input.length }}/5</span
                        >
                        <adding-images :product="product" :maxImagesCount="5" />
                      </div>
                    </div>
                  </div>
                </b-tab>

                <!-- /name-tab -->
                <b-tab :disabled="!validateTabOne.tab_valid">
                  <template #title>{{
                    $t("view_titles.creating_tab_two_title")
                  }}</template>
                  <div class="add-lot">
                    <div class="add-lot__pricing pt-4 d-flex">
                      <adding-graph :product="product" :key="graphKey" />
                      <adding-prices
                        :product="product"
                        @addPrice="addPrice"
                        @updatePrices="updatePrices"
                        @updateTotal="updateTotal"
                        @validate="validatePricesTab"
                      />
                    </div>
                  </div>
                </b-tab>
                <!-- /pricing-tab -->
                <b-tab
                  :disabled="
                    !validateTabOne.tab_valid || !validateTabTwo.tab_valid
                  "
                >
                  <template #title>
                    {{ $t("view_titles.creating_tab_three_title") }}
                  </template>
                  <div class="preview mx-auto" style="width:220px">
                    <productCard :p="product" />
                  </div>
                </b-tab>
                <!-- /confirmation-tab -->
              </b-tabs>

              <div
                class="d-flex justify-content-center align-items-center pt-4 mt-4 border-top"
              >
                <b-button
                  class="mr-2"
                  v-if="tab_index != 0"
                  @click="tab_index -= 1"
                >
                  Назад
                </b-button>
                <b-button
                  v-if="tab_index < 2"
                  variant="primary"
                  class="px-4"
                  :disabled="nextDisabled"
                  @click="nextTab()"
                >
                  Далі
                </b-button>
                <b-button v-else variant="primary" @click="saveProduct()">
                  Зберегти продукт
                </b-button>
              </div>
            </b-overlay>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <b-modal id="modal-adding-category" hide-footer hide-header size="lg">
      <h2 class="mb-4 mt-3">
        {{ $t("labels.product_category") }}
      </h2>
      <b-button
        v-if="categories_history.length > 0"
        variant="light"
        size="sm"
        @click="goToPreviousCategory()"
      >
        <icon variant="back" class="mr-2" />{{
          getPreviousCategoryLabel()
        }}</b-button
      >
      <ul class="add-lot__category-all mt-2">
        <li
          v-for="subcat in childrenCategoriesUi"
          :key="subcat.id"
          class="add-lot__category-button"
        >
          <button @click="setSelectedCategoryUi(subcat)">
            {{ categoryTitleByLang(subcat) }}
            <icon variant="chevron-right" />
          </button>
        </li>
      </ul>
    </b-modal>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from "vuex";
import moment from "moment";
//Adding parts
import addingGraph from "./adding-lot-components/adding-prices-graph.vue";
import addingPrices from "./adding-lot-components/adding-prices-inputs.vue";
import addingImages from "./adding-lot-components/adding-images.vue";
import productCard from "./adding-lot-components/adding-product-preview.vue";
export default {
  data() {
    return {
      cards: [],
      isLoading: false,
      graphKey: 0,
      tab_index: 0,
      categoryOptions: "",
      images_preview: [],
      tab_completed: [false, false, false],
      product: {
        user_id: null,
        title: "",
        description: "",
        catalog_id: null,
        total: 0,
        payment_type: 1,
        delivery_type: 1,
        date_start: "2021-04-02",
        date_end: "2021-04-27",
        status: 1,
        location: 12,
        visible: 1,
        prices: [{ min: 0, max: 0, price: 10 }],
        images_input: [],
      },
      pricing_tab_valid: false,
      selected_category_ui: null,
      categories_history: [],
    };
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "sanctum/isAuthenticated",
      user: "sanctum/getUser",
      role: "role",
      categories: "categories",
    }),
    childrenCategoriesUi() {
      var selected = [];
      var parent = this.selected_category_ui;
      if (parent !== null) {
        for (var key in this.selected_category_ui.children) {
          if (this.selected_category_ui.children[key].visible == 1) {
            selected.push(this.selected_category_ui.children[key]);
          }
        }
      } else {
        for (var key1 in this.categories) {
          if (this.categories[key1].visible == 1) {
            selected.push(this.categories[key1]);
          }
        }
      }
      return selected;
    },
    selectedCategoryLabel() {
      let label = "";
      let categories = this.categoryOptions;
      let selected_id = this.product.catalog_id;
      if (selected_id && selected_id !== null) {
        for (var k in categories) {
          if (categories[k].id == selected_id) {
            label = this.categoryTitleByLang(categories[k]);
          }
        }
      }
      return label;
    },
    validateTabOne() {
      var product = this.product;
      var valid = {
        title: true,
        category: true,
        description: true,
        date_start: true,
        date_end: true,
        tab_valid: false,
        has_cards: false,
      };
      if (!product.title || (product.title && product.title.length < 10)) {
        valid.title = false;
      }
      if (!product.catalog_id) {
        valid.category = false;
      }
      if (!product.description || product.description.length < 20) {
        valid.description = false;
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

      if (
        valid.title &&
        valid.category &&
        valid.description &&
        valid.date_start &&
        valid.date_end &&
        valid.has_cards
      ) {
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
      if (tab == 1 && !this.validateTabTwo.tab_valid) {
        disabled = true;
      }

      return disabled;
    },
  },
  components: {
    addingGraph,
    addingPrices,
    addingImages,
    productCard,
  },
  watch: {
    categories(oldVal, newVal) {
      this.getCategoryOptions(newVal);
    },
    product: {
      deep: true,
      handler() {
        this.graphKey = Math.random();
        var new_price = this.product.prices[0].price;

        this.product.prices[0] = {
          min: this.product.total,
          max: this.product.total,
          price: new_price,
        };
      },
    },
  },
  methods: {
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
    goToPreviousCategory() {
      let history = this.categories_history;
      if (history.length > 0) {
        let index = this.categories_history.length - 1;
        this.selected_category_ui = history[index];
        this.categories_history.splice(-1, 1);
      }
    },
    getPreviousCategoryLabel() {
      let history = this.categories_history;
      let label = this.$t("labels.all_categories");
      if (history.length > 0) {
        let index = this.categories_history.length - 1;
        if (history[index] !== null) {
          label = this.categoryTitleByLang(history[index]);
        }
      }
      return label;
    },
    setSelectedCategoryUi(c) {
      this.categories_history.push(this.selected_category_ui);
      this.selected_category_ui = c;

      let selected = this.selected_category_ui;
      if (selected.children && c.children.length > 0) {
        this.selected_category_ui = c;
      } else {
        this.product.catalog_id = c.id;
        this.$bvModal.hide("modal-adding-category");
        this.categories_history = [];
      }
    },
    validatePricesTab(value) {
      console.log(value);
      this.pricing_tab_valid = value;
    },
    updatePrices(value) {
      this.product.prices = value;
    },
    updateTotal(value) {
      this.product.total = value;
    },
    nextTab() {
      this.tab_index += 1;
    },
    readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = (e) => {
          this.images_preview.push(e.target.result);
        };

        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
    },
    getImagePreviewUrl($event) {
      this.readURL($event.target);
    },
    getCategoryOptions(categories) {
      var options = [];
      for (var i = 0; i < categories.length; i++) {
        console.log(categories);
        options.push(categories[i]);

        //Push children categories
        if (categories[i].children) {
          for (var key in categories[i].children) {
            options.push(categories[i].children[key]);
            //Push children categories 3rd level
            if (categories[i].children[key].children) {
              for (var key1 in categories[i].children[key].children) {
                options.push(categories[i].children[key].children[key1]);
              }
            }
          }
        }
      }

      this.categoryOptions = options;
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
    checkValue(value) {
      console.log(value);
    },
    saveProduct() {
      this.isLoading = true;
      this.product.user_id = this.user.id;

      //Create formdata for sending
      var bodyFormData = new FormData();

      for (var key in this.product) {
        if (key !== "images_input" && key !== "prices") {
          bodyFormData.append(key, this.product[key]);
        } else if (key == "prices") {
          for (var j = 0; j < this.product[key].length; j++) {
            var price = this.product[key][j];
            for (var key2 in price) {
              bodyFormData.append(
                key + "[" + j + "][" + key2 + "]",
                price[key2]
              );
            }
          }
        } else if (key == "images_input") {
          for (var i = 0; i < this.product[key].length; i++) {
            var image = this.DataURIToBlob(this.product[key][i].path);
            bodyFormData.append(key + "[" + i + "]", image);
          }
        }
      }

      var url = "/api/user/profile/products";
      var method = "post";

      this.$api({
        method: method,
        url: url,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((response) => {
          console.log(response);
          this.isLoading = false;
          this.$router.push({ name: "my", params: { tab: "lots" } });
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error);
        });
    },
    DataURIToBlob(dataURI) {
      const splitDataURI = dataURI.split(",");
      const byteString =
        splitDataURI[0].indexOf("base64") >= 0
          ? atob(splitDataURI[1])
          : decodeURI(splitDataURI[1]);
      const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);

      return new Blob([ia], { type: mimeString });
    },
    categoryTitleByLang(cat) {
      var title = "empty";
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
    this.getCategoryOptions(this.categories);
    this.checkIfUserHasCard();
    this.$root.$on("bv::modal::hidden", (bvEvent, modalId) => {
      if (modalId == "modal-adding-category") {
        this.selected_category_ui = null;
      }
    });

    let today = new Date();
    this.product.date_start = moment(today).format("YYYY-MM-DD");
    today.setDate(today.getDate() + 1);
    this.product.date_end = moment(today).format("YYYY-MM-DD");
  },
};
</script>

<style lang="scss" scoped>
.step-one {
  &__title-and-category {
    min-width: calc(100% - 320px);
    padding-right: 40px;
    margin-right: 40px;
    border-right: 1px solid #e7e7e7;
  }
  &__images {
    width: 320px;
    .allowed-count {
      color: #ccc;
      font-size: 13px;
      text-align: center;
    }
  }
}
.add-lot {
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
  &__pricing {
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
}
</style>
