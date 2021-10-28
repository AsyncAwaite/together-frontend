<template>
  <div>
    <PriceSlider
      v-model="filter.price.range"
      :min="categoryPriceRange.min"
      :max="categoryPriceRange.max"
      @change="doFiltering"
    />
    <div class="d-flex prices-range-labels">
      <span>
        {{categoryPriceRange.min}}
      </span>
      <span>
        {{Math.round(categoryPriceRange.max)}}
      </span>
    </div>
    <div class="d-flex price-inputs mt-4 align-items-center">
      <span>{{$t('labels.price_from')}}</span>
      <b-form-input
        size="sm"
        class="text-center mr-2 ml-2"
        v-model.number="inputs.min"
        @change="manualInput"
      ></b-form-input>
      <span>{{$t('labels.price_to')}}</span>
      <b-form-input
        size="sm"
        class="text-center ml-2 mr-2"
        v-model.number="inputs.max"
        @change="manualInput"
      ></b-form-input>
      <span>{{$t('labels.uah')}}</span>
    </div>
  </div>
</template>

<script>
import PriceSlider from "@vueform/slider/dist/slider.vue2.js";
import "@vueform/slider/themes/default.css";
export default {
  props: ["categoryPriceRange", "range"],
  data() {
    return {
      inputs: {
        min: 0,
        max: 0,
      },
    };
  },
  computed: {
    filter() {
      var filter = {
        price: {
          range: [0, 1],
        },
      };
      if (this.range) {
        filter.price.range = this.range;
      }
      return filter;
    },
  },
  watch: {
    filter: {
      deep: true,
      handler(newVal, oldVal) {
        console.log("values:" + newVal, oldVal);
        this.inputs.min = Number(newVal.price.range[0]);
        this.inputs.max = Number(newVal.price.range[1]);
      },
    },
  },
  components: {
    PriceSlider,
  },
  methods: {
    manualInput() {
      this.$emit("input", this.inputs);
    },
    doFiltering(value) {
      var newData = {
        value: value,
        range: this.filter.price.range,
      };
      this.$emit("change", newData);
    },
  },
  mounted() {
    this.filter.price.range = this.range;
  },
};
</script>

<style lang="scss" scoped>
.prices-range-labels {
  justify-content: space-between;
  padding-top: 10px;
  font-size: 13px;
}
.price-inputs {
  span{
    font-size:13px;
  }
}
</style>
