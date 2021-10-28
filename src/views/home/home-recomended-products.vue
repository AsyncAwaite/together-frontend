<template>
  <b-card>
    <h3 class="text-center mb-4">
      {{$t('labels.recommended_items')}}
    </h3>
    <template v-if="$apollo.loading">
      <div class="row">
        <div class="col-12 col-sm-6 col-md-3" v-for="n in 4" :key="n">
          <content-loader
            :width="400"
            :height="600"
            :speed="2"
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            <rect x="-2" y="7" rx="2" ry="2" width="400" height="400" />
            <rect x="-5" y="439" rx="0" ry="0" width="392" height="27" />
            <rect x="308" y="436" rx="0" ry="0" width="1" height="0" />
            <rect x="-5" y="486" rx="0" ry="0" width="310" height="27" />
            <rect x="1" y="551" rx="0" ry="0" width="381" height="17" />
            <rect x="2" y="577" rx="0" ry="0" width="381" height="17" />
          </content-loader>
        </div>
      </div>
    </template>
    <template v-else>
      <productListCarousel :products="recomendedProducts" />
    </template>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import productListCarousel from "@/components/lists/product-list-carousel.vue";

export default {
  components: {
    productListCarousel,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      recomendedProducts: "recomendedProducts",
    }),
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
