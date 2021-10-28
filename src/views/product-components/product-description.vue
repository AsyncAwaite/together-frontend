<template>
  <div>
    <h4>{{ $t("labels.product_description") }}</h4>
    <div class="product__description" v-html="product.description"></div>
  </div>
</template>

<script>
export default {
  props: ["product"],
};
</script>

<style lang="scss" scoped>
.product {
  &__description {
    font-size: 14px;
  }
}
</style>
