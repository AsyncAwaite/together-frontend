<template>
  <div>
    <div class="product__images">
      <div class="product__main-image">
        <template v-if="images.length">
          <img :src="images[imageIndex].path" alt="" />
          <div class="zoom-fader" @click="openLightbox">
            <icon variant="zoom-in" color="#fff" />
          </div>
        </template>
        <template v-else>
          <div class="product__no-image">
            <img class="dummy" src="@/assets/img/no_image.png" alt="" />
          </div>
        </template>
      </div>
      <div class="product__thumbs">
        <div
          v-for="(thumb, i) in images"
          :key="thumb.path"
          class="item"
          @click="selectImage(i)"
          :class="{ active: i == imageIndex }"
          :style="{ 'background-image': 'url(' + thumb.path + ')' }"
        ></div>
      </div>
    </div>

    <vue-image-lightbox-carousel
      ref="lightbox"
      :show="showLightbox"
      :images="images"
      @close="showLightbox = false"
    ></vue-image-lightbox-carousel>
  </div>
</template>

<script>
import VueImageLightboxCarousel from "vue-image-lightbox-carousel";
export default {
  props: ["product"],
  components: {
    VueImageLightboxCarousel,
  },
  data() {
    return {
      imageIndex: 0,
      showLightbox: false,
    };
  },
  computed: {
    images() {
      var images = [];
      if (this.product && this.product.images_url) {
        for (var key in this.product.images_url) {
          images.push({
            path: this.product.images_url[key],
            caption: this.product.title,
          });
        }
      }

      return images;
    },
  },
  methods: {
    openLightbox() {
      this.showLightbox = true;
      this.$refs.lightbox.showImage(this.imageIndex);
    },
    selectImage(i) {
      this.imageIndex = i;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.product {
  &__no-image {
    background-color: lighten(#e7e7e7, 5%);
    position: relative;
    padding-top: 75%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    img.dummy {
      height: 120px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      display: block;
    }
  }
  &__thumbs {
    display: flex;
    margin-top: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
    .item {
      width: 96px;
      height: 96px;
      overflow: hidden;
      position: relative;
      margin-right: 10px;
      margin-bottom: 10px;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      border: 1px solid #e7e7e7;
      &.active {
        border-color: var(--primary-color);
      }
    }
    img {
      max-width: 100%;
    }
  }
  &__images {
  }
  &__main-image {
    cursor: pointer;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    border: 1px solid #e7e7e7;
    position: relative;
    text-align: center;
    img {
      height: auto;
      max-width: 100%;
      max-height: 320px;
      position: relative;
      z-index: 2;
    }
    .zoom-fader {
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(#000, 0.2);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 5;
      transition: 0.3s;
      svg {
        width: 42px;
        height: 42px;
      }
    }
    &:hover {
      .zoom-fader {
        opacity: 1;
        transition: 0.3s;
      }
    }
  }
}
</style>
