<template>
  <div>
    <h4>{{ $t("labels.product_description") }} </h4>
    <!-- <div v-if="$i18n.locale == 'ua'">id</div> -->  
    <div class="product__description" v-html="product.description"></div>
  </div>
</template>

<script>

export default {
  props: ["product", "languages"],

  methods: {
    cons() {
      console.log(this.$i18n);
    },
  },
  mounted() {
    this.cons();
  },
};
</script>

<style lang="scss" scoped>
.product {
  &__description {
    font-size: 14px;
  }
}
</style>
