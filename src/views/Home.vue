<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col-12 d-none d-lg-block col-lg-3">
          <catalog  />
        </div>
        <div class="col-12 col-lg-9">
          <slider />
        </div>
      </div>
      <div class="row mt-4 mb-4">
        <div class="col-12">
          <newProducts />
        </div>
      </div>
    </div>
    <popualrCategories />
    <div class="container">
      <div class="row mt-4 mb-4">
        <div class="col-12">
          <recomendedProducts />
        </div>
      </div>
    </div>
    <infoBlock />
  </div>
</template>

<script>
import slider from "./home/home-slider.vue";
import newProducts from "./home/home-new-products.vue";
import popualrCategories from "./home/home-popular-categories.vue";
import recomendedProducts from "./home/home-recomended-products.vue";
import infoBlock from "./home/home-info-block.vue";
import catalog from "./home/home-catalog.vue";
export default {
  name: "Home",
  //   metaInfo: {
  //     title: 'Together - не тільки найбільший онлайн-рітейлер, але ще і майданчик для продавців.',
  // //  {{$t('pages.about_part_1')}}
  //   },
  components: {
    slider,
    newProducts,
    recomendedProducts,
    popualrCategories,
    infoBlock,
    catalog 
  },
 
  data() {
  // this.consMeta();
    return {};
  },
  methods: {
//  consMeta () {
//    console.log('this.metaInfo')
//   console.log(this.metaInfo)
//   }
  },
 
   mounted() {
    // this.consMeta();

  },
   metaInfo () {
    return {
      title: this.$t('pages.main_title')
    }
  }
  
};
</script>
