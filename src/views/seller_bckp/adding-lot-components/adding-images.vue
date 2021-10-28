<template>
  <div>
    <VueUploadMultipleImage
      @upload-success="imageAdded"
      @before-remove="beforeRemove"
      id="images-input"
      :dragText="$t('labels.drag_or_click')"
      :browseText="$t('labels.upload_from_files')"
      :primaryText="$t('labels.main_image')"
      :markIsPrimaryText="$t('labels.make_main')"
      :popupText="$t('labels.image_will_be_main')"
      :data-images="images"
      :maxImage="maxImagesCount"
    />
  </div>
</template>

<script>
import VueUploadMultipleImage from "vue-upload-multiple-image";

export default {
  props: ["product", "maxImagesCount"],
  data() {
    return {
      images: [],
    };
  },
  components: {
    VueUploadMultipleImage,
  },
  methods: {
    imageAdded(formData, index, fileList) {
      console.log(formData, index, fileList);
      this.product.images_input = fileList;
    },
    beforeRemove(index, done, fileList) {
      console.log("index", index, fileList);
      var r = confirm("remove image");
      if (r == true) {
        done();
      }
    },
  },
};
</script>

<style lang="scss">
#images-input {
  .centered {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    img {
      max-height: 140%;
      max-width: 140%;
      height: auto;
      width: auto;
    }
  }
  .preview-image {
    height: 200px;
  }
  .image-container {
    width: 100%;
    height: 240px;
  }
  .image-list-container {
    max-width: 100%;
    .image-list-item .show-img {
      max-width: 50px;
      max-height: 32px;
    }
    .image-list-item {
      height: 64px;
      width: 64px;
    }
    .image-list-item {
      margin-right: 8px;
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
</style>
