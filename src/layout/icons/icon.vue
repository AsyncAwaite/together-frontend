<template>
  <svg class="svg-icon" :fill="color ? color : '#000'">
    <use :href="'#icon-' + variant" />
  </svg>
</template>

<script>
export default {
  props: ["variant", "color"],
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 16px;
  height: 16px;
}
</style>
