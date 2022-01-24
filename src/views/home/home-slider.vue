<template>
  <div class="banner">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide>
        <router-link to="/">
          <img src="@/assets/slides/slide_1.png" alt="" />
        </router-link>
      </swiper-slide>
      <swiper-slide>
        <router-link to="/">
          <img src="@/assets/slides/slide_2.png" alt="" />
        </router-link>
      </swiper-slide>
      <swiper-slide>
        <router-link to="/">
          <img src="@/assets/slides/slide_3.png" alt="" />
        </router-link>
      </swiper-slide>
      <swiper-slide>
        <router-link to="/">
          <img src="@/assets/slides/slide_4.png" alt="" />
        </router-link>
      </swiper-slide>
      <swiper-slide>
        <router-link to="/">
          <img src="@/assets/slides/slide_5.png" alt="" />
        </router-link>
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination" slot="pagination"></div>
    <div class="swiper-controls">
      <div @click="prev()" class="swiper-prev swiper-button-prev"></div>
      <div @click="next()" class="swiper-next swiper-button-next"></div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";

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
          dynamicBullets: true,
          type: "bullets",
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        loop: true,
      },
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  methods: {
    prev() {
      try {
        this.swiper.slidePrev();
      } catch (e) {
        console.log(e);
      }
    },
    next() {
      try {
        this.swiper.slideNext();
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    // this.swiper.slideTo(1, 1000, false);
    try {
      setInterval(() => {
        this.swiper.slideNext();
      }, 5000);
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss" scoped>
.banner {
  position: relative;
}
// .swiper-controls {
//   position: absolute;
//   top: 50%; transform: translateY(-50%);
//   width: 100%;
// }
.swiper-slide {
  // max-height: 300px;
  position: relative;
  img {
    max-width: 100%;
    max-height: 340px;
    width: 100%;
    height: 100%;
    border-radius: 2.25rem;
    object-fit: cover;
  }
}
.swiper-prev,
.swiper-next {
  position: absolute;
  z-index: 99;
  margin-top: 0;
  filter: brightness(0) invert(1);
}
.swiper-prev {
  left: 0;
  transform: translateY(-50%) translateX(-30%) scaleX(-1);
  top: 50%;
  background-image: url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' version='1.1' width='512' height='512' x='0' y='0' viewBox='0 0 256 256' style='enable-background:new 0 0 512 512' xml:space='preserve'%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpolygon points='79.093,0 48.907,30.187 146.72,128 48.907,225.813 79.093,256 207.093,128' fill='%231bc1a1' data-original='%23000000' style=''/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
  height: 64px;

  width: 64px;
  background-size: 32px;
}
.swiper-next {
  right: 0;
  transform: translateY(-50%) translateX(30%);
  top: 50%;

  background-image: url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' version='1.1' width='512' height='512' x='0' y='0' viewBox='0 0 256 256' style='enable-background:new 0 0 512 512' xml:space='preserve'%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpolygon points='79.093,0 48.907,30.187 146.72,128 48.907,225.813 79.093,256 207.093,128' fill='%231bc1a1' data-original='%23000000' style=''/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
  height: 64px;
  width: 64px;
  background-size: 32px;
}
</style>
