<template>
  <div class="my__item">
    <div class="thumb">
      <router-link :to="{ name: 'product', params: { slug: item.slug } }">
        <div
          class="bg"
          :style="{ 'background-image': 'url(' + item.images_url[0] + ')' }"
        ></div>
      </router-link>
    </div>
    <div class="text">
      <router-link :to="{ name: 'product', params: { slug: item.slug } }">
        <h4 class="mt-0">
          {{ item.title }}
        </h4>
      </router-link>
      <b-button
        variant="outline-danger"
        size="sm"
        @click="openRemoveingModal(item.id)"
      >
        Видалити
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
};
</script>

<style lang="scss" scoped></style>
