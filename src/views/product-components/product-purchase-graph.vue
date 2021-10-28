<template>
  <div>
    <div class="product__purchase-graph">
      <div class="bg">
        <div
          class="purchased-amount"
          v-b-tooltip="'Already purchased'"
          :style="{ width: calcPurchasedWidth + '%' }"
        ></div>
        <div
          class="input-amount"
          v-b-tooltip="'Your amount'"
          v-if="productAvailable"
          :style="{
            left: calcPurchasedWidth + '%',
            maxWidth: 100 - calcPurchasedWidth + '%',
            width: calcInputWidth + '%',
          }"
        ></div>
        <div class="range-start">
          <div class="amount">1 {{ $t("labels.pcs") }}</div>
          <div class="price">
            {{ highestPrice }} {{ $t("labels.uah") }}/{{ $t("labels.pcs") }}
          </div>
        </div>
        <div class="range-end">
          <div class="amount">{{ product.total }} {{ $t("labels.pcs") }}</div>
          <div class="price">
            {{ lowestPrice }} {{ $t("labels.uah") }}/{{ $t("labels.pcs") }}
          </div>
        </div>
      </div>
      <div
        class="toggle mt-4"
        @click="show_details = !show_details"
        :class="{ expanded: show_details }"
      >
        <span v-html="moreLabel"></span> <icon variant="dropdown" />
      </div>
    </div>

    <div class="product__prices-range" :class="{ show: show_details }">
      <div
        v-for="(p, i) in product.prices"
        :key="i"
        :class="{ completed: calcPriceRangeFill(i) == 100 }"
      >
        <div class="d-flex justify-content-between">
          <span v-if="i == 0">{{ p.max }} {{ $t("labels.pcs") }}</span>
          <span v-else>{{ p.min }} - {{ p.max }} {{ $t("labels.pcs") }}</span>
          <span> {{ p.price }} {{ $t("labels.uah") }} </span>
        </div>
        <div class="bg">
          <div
            class="range"
            :class="{ current: calcPriceRangeFill(i) < 100 }"
            :style="{ width: calcPriceRangeFill(i) + '%' }"
          ></div>
          <div
            class="input-range"
            :style="{
              width: calcInputRangeWidth(i) + '%',
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["product", "qty"],
  data() {
    return {
      show_details: false,
    };
  },
  computed: {
    productAvailable() {
      var available = true;
      if (this.product.total_bought == this.product.total) {
        available = false;
      }
      return available;
    },
    moreLabel() {
      var show = this.show_details;
      var label = this.$t("buttons.more");
      if (show == true) {
        label = this.$t("buttons.less");
      }

      return label;
    },
    calcInputWidth() {
      var width = 0;
      if (this.qty && this.product) {
        width = (this.qty / this.product.total) * 100;
      }

      return width;
    },
    calcPurchasedWidth() {
      var width = 1;
      if (this.product) {
        var total = Number(this.product.total);
        var purchased = Number(this.product.total_bought);
        width = (purchased / total) * 100;
      }
      return width;
    },
    lowestPrice() {
      var lowest = 0;

      if (this.product && this.product.prices) {
        lowest = this.product.prices[0].price;
        var prices = this.product.prices;
        for (var key in prices) {
          if (Number(prices[key].price) < lowest) {
            lowest = Number(prices[key].price);
          }
        }
      }
      return lowest;
    },
    highestPrice() {
      var highest = 0;
      if (this.product && this.product.prices) {
        var prices = this.product.prices;
        for (var key in prices) {
          if (Number(prices[key].price) > highest) {
            highest = Number(prices[key].price);
          }
        }
      }
      return highest;
    },
  },
  methods: {
    calcInputRangeWidth(i) {
      var width = 0;
      var priceItem = this.product.prices[i];
      var purchased = Number(this.product.total_bought) + Number(this.qty);
      if (purchased > priceItem.max || purchased == priceItem.max) {
        width = 100;
      }

      if (purchased < priceItem.max && purchased >= priceItem.min) {
        var difference = priceItem.max - purchased;
        var range = priceItem.max - priceItem.min;
        var purchasedInRange = range - difference;
        width = (purchasedInRange / range) * 100;
      }

      return width;
    },
    calcPriceRangeFill(i) {
      var width = 0;
      var priceItem = this.product.prices[i];
      var purchased = this.product.total_bought;
      if (purchased > priceItem.max || purchased == priceItem.max) {
        width = 100;
      }

      if (purchased < priceItem.max && purchased >= priceItem.min) {
        var difference = priceItem.max - purchased;
        var range = priceItem.max - priceItem.min;
        var purchasedInRange = range - difference;
        width = (purchasedInRange / range) * 100;
      }

      return width;
    },
  },
};
</script>

<style lang="scss" scoped>
.product {
  &__prices-range {
    font-size: 13px;
    margin-bottom: 30px;
    font-weight: 400;
    max-height: 0px;
    overflow: hidden;
    transition: 0.3s;
    &.show {
      max-height: 600px;
      height: auto;
      transition: 0.3s;
      .range {
        max-width: 100% !important;
      }
      .input-range {
        transition: 1.6s;
        max-width: 100% !important;
      }
    }
    & > div {
      padding-top: 10px;
    }
    .completed {
      opacity: 0.6;
      span {
        color: #11c9aa;
      }
      .range {
        transition: 0s;
      }
      .input-range {
        display: none !important;
      }
    }
    .bg {
      background: #e7e7e7;
      height: 3px;
      border-radius: 4px;
      position: relative;

      .range {
        background: #11c9aa;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        min-width: 0px;
        border-radius: 4px;
        max-width: 0;
        z-index: 5;

        &.current {
          transition: 2.4s;
        }
      }
      .input-range {
        background: #ffce00;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        min-width: 0px;
        border-radius: 4px;
        z-index: 1;
        transition: 1.6s;
        max-width: 0;

        &.current {
          transition: 2.4s;
        }
      }
    }
  }
  &__purchase-graph {
    overflow: hidden;
    .toggle {
      font-size: 13px;
      color: var(--primary-color);
      margin-top: 40px !important;
      cursor: pointer;
      &.expanded {
        svg {
          transform: scaleY(-1);
        }
      }
      svg {
        height: 13px;
        width: 13px;
        fill: var(--primary-color);
      }
    }
    padding: 30px 0px 10px;
    .bg {
      background: #cbcbcb;
      height: 8px;
      border-radius: 4px;
      position: relative;
      .input-amount {
        background: #ffce00;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        min-width: 10px;
        border-radius: 4px;
        transition: 1.4s;
      }
      .purchased-amount {
        background: #11c9aa;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        min-width: 10px;
        border-radius: 4px;
        transition: 1.4s;
        transition: width 1.4s;
        max-width: 100%;
      }
      .range-start,
      .range-end {
        font-size: 10px;
        flex-direction: column;
        position: absolute;
        justify-content: center;
        align-items: baseline;
        display: inline-flex;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 600;
        .price {
          margin-top: 20px;
        }
      }
      .range-start {
        left: 0;
      }
      .range-end {
        right: 0;
        align-items: flex-end;
      }
    }
  }
}
</style>
