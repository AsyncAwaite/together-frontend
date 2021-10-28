<template>
  <div class="add-lot__inputs">
    <div class="form-row">
      <div class="form-group">
        <label for="">К-ть товару в наявності</label>
        <b-form-input
          type="number"
          :state="product.total > 0 ? true : false"
          v-model.number="product.total"
          @keyup="emitTotal"
        />
      </div>
    </div>
    <div class="form-row" v-for="(price, i) in product.prices" :key="i">
      <div class="form-group mr-2">
        <label for="">Якщо купили (шт)</label>
        <b-form-input
          v-if="i == 0"
          disabled
          v-model.number="product.total"
          type="number"
        />
        <b-form-input
          v-else
          :id="'price-count-input-' + i"
          type="number"
          :state="countValid[i]"
          @keyup="emitPrices(i)"
          v-model.number="price.min"
          :min="
            product.prices[i - 1].min - 1 < 0
              ? 0
              : product.prices[i - 1].min - 1
          "
        />
      </div>
      <!-- This will only be shown if the preceding input has an invalid state -->
      <b-form-invalid-feedback :id="'price-count-input-' + i + '-feedback'">
        Enter at least 3 letters
      </b-form-invalid-feedback>
      <div class="form-group mr-2">
        <label for="">Вартість (грн.шт) </label>
        <b-form-input
          type="number"
          v-if="i == 0"
          :min="0"
          v-model="price.price"
        />
        <b-form-input
          v-else
          type="number"
          :state="priceValid[i]"
          :min="product.prices[i - 1].price + 1"
          v-model.number="price.price"
          @blur="checkValue"
          @keyup="emitPrices"
        />
      </div>
      <div class="form-group">
        <label for=""> Cума</label>
        <b-form-input
          v-if="i == 0"
          disabled
          :value="price.price * product.total"
        />
        <div v-if="i != 0" class="d-flex align-items-center">
          <b-form-input disabled :value="price.price * price.min" />
          <div @click="removeItem(i)" class="price-remove ml-2">
            <icon variant="minus" />
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end form-row">
      <b-button
        size="sm"
        variant="primary"
        @click="addPrice"
        :disabled="addDisabled"
      >
        <icon variant="plus" class="mr-2" color="#fff" /> Додати варіант
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["product"],
  data() {
    return {};
  },
  watch: {
    product: {
      deep: true,
      handler() {
        this.emitValidation();
      },
    },
  },
  computed: {
    addDisabled() {
      var prices = this.product.prices;
      var lastIndex = Number(prices.length - 1);
      var disabled = false;
      if (Number(prices[lastIndex].min) == 1) {
        disabled = true;
      }

      return disabled;
    },
    priceValid() {
      var valid = {};
      for (var key in this.product.prices) {
        valid[key] = true;
        if (
          (key != 0 &&
            this.product.prices[key].price <=
              this.product.prices[key - 1].price) ||
          this.product.prices[key].price == 0
        ) {
          valid[key] = false;
        }
      }
      return valid;
    },
    countValid() {
      var valid = {};
      var prices = this.product.prices;
      for (var key in prices) {
        valid[key] = true;
        if (
          (key != 0 &&
            key != 1 &&
            Number(prices[key].min) >= Number(prices[key - 1].min)) ||
          Number(prices[key].min) == 0
        ) {
          valid[key] = false;
        }
        if (
          (key == 1 && Number(prices[key].min) >= Number(this.product.total)) ||
          Number(prices[key].min) == 0
        ) {
          valid[key] = false;
        }
      }
      return valid;
    },
  },
  methods: {
    validatePricesBlock() {
      var valid = true;

      var count = true;
      for (var key in this.countValid) {
        if (this.countValid[key] == false) {
          count = false;
        }
      }

      var prices = true;
      for (var key1 in this.priceValid) {
        if (this.priceValid[key1] == false) {
          prices = false;
        }
      }
      if (!count || !prices) {
        valid = false;
      }

      return valid;
    },
    checkValue(value) {
      console.log(value);
    },
    addPrice() {
      this.$emit("addPrice");
    },
    removeItem(i) {
      this.product.prices.splice(i, 1);
      this.emitPrices();
    },
    emitPrices(i) {
      var prices = this.product.prices;
      if (i !== 0) {
        var max = Number(prices[i - 1].min) - 1;
        prices[i].max = max;
      }
      this.$emit("updatePrices", prices);
    },
    emitTotal() {
      this.$emit("updateTotal", this.product.total);
    },
    emitValidation() {
      this.$emit("validate", this.validatePricesBlock());
    },
  },
};
</script>

<style lang="scss" scoped>
.add-lot__inputs {
  .form-row {
    position: relative;
    margin-right: 40px;
    input {
      width: 180px;
    }
    label {
      font-size: 13px;
      margin-bottom: 5px;
    }
    .price-remove {
      cursor: pointer;
      opacity: 0.6;
      transition: 0.3s;
      position: absolute;
      left: 100%;
      &:hover {
        opacity: 2;
        transition: 0.3s;
      }
      svg {
        fill: #f00;
      }
    }
  }
}
</style>
