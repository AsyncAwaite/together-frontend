<template>
  <div>
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <router-link to="/">
          <img src="@/assets/slides/slide_1.png" alt="" />
        </router-link>
      </swiper-slide>
      <swiper-slide>
        <router-link to="/">
          <img src="@/assets/slides/slide_1.png" alt="" />
        </router-link>
      </swiper-slide>
      <swiper-slide>
        <router-link to="/">
          <img src="@/assets/slides/slide_1.png" alt="" />
        </router-link>
      </swiper-slide>
      <swiper-slide>
        <router-link to="/">
          <img src="@/assets/slides/slide_1.png" alt="" />
        </router-link>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
// import "swiper/css/swiper.css";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination",
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
      return this.$refs.mySwiper.$swiper;
    },
  },
  mounted() {
    // this.swiper.slideTo(1, 1000, false);
  },
};
</script>

<style lang="scss" scoped>
.swiper-slide {
  img {
    max-width: 100%;
    border-radius: 2.25rem;
  }
}
</style>
