<template>
  <div class="product__carousel">
    <swiper :ref="'mySwiper_' + k" :options="swiperOptions">
      <swiper-slide v-for="p in products" :key="p.id">
        <productListCard :p="p" />
      </swiper-slide>
    </swiper>
    <div class="swiper-controls" v-show="products.length">
      <div
        @click="prev()"
        class="swiper-prev swiper-button-prev"
        :class="'swiper-button-prev-' + k"
      ></div>
      <div
        @click="next()"
        class="swiper-next swiper-button-next"
        :class="'swiper-button-next-' + k"
      ></div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import productListCard from "@/components/lists/product-list-card.vue";

import "swiper/swiper.scss";
export default {
  props: ["products"],
  components: {
    productListCard,
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      k: 1,
      swiperOptions: {
        slidesPerView: 4,
        spaceBetween: 30,
        preventClicks: false,
        preventClicksPropagation: true,
        loop: false,
        pagination: {
          el: ".swiper-pagination",
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          600: {
            slidesPerView: 2,
          },
          991: {
            slidesPerView: 3,
          },
          1170: {
            slidesPerView: 4,
          },
          1366: {
            slidesPerView: 4,
          },
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
  computed: {
    swiper() {
      var key = "mySwiper_" + this.k;
      return this.$refs[key].$swiper;
    },
  },

  methods: {
    onSwiper(swiper) {
      console.log(swiper);
    },
    onSlideChange() {
      console.log("slide change");
    },
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
  },
  beforeMount() {
    this.k = Math.floor(Math.random() * 100) + 1;
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.swiper-prev,
.swiper-next {
  position: absolute;
  z-index: 99;
}
.swiper-prev {
  left: 0;
  transform: translateY(-50%) translateX(-20%) scaleX(-1);
  top: 50%;
  background-image: url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' version='1.1' width='512' height='512' x='0' y='0' viewBox='0 0 256 256' style='enable-background:new 0 0 512 512' xml:space='preserve'%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpolygon points='79.093,0 48.907,30.187 146.72,128 48.907,225.813 79.093,256 207.093,128' fill='%231bc1a1' data-original='%23000000' style=''/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
  height: 64px;
  width: 64px;
  background-size: 32px;
}
.swiper-next {
  right: 0px;
  transform: translateY(-50%) translateX(20%);
  top: 50%;
  background-image: url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' version='1.1' width='512' height='512' x='0' y='0' viewBox='0 0 256 256' style='enable-background:new 0 0 512 512' xml:space='preserve'%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpolygon points='79.093,0 48.907,30.187 146.72,128 48.907,225.813 79.093,256 207.093,128' fill='%231bc1a1' data-original='%23000000' style=''/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
  height: 64px;
  width: 64px;
  background-size: 32px;
}
.product{
  &__carousel {
    padding: 0px 20px;
    overflow: hidden;
  }
}
</style>
