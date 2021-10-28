<template>
  <div class="message__bg">
    <slot></slot>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
.message {
  &__bg {
      font-size: 18px;
    padding: 40px 60px;
    background: linear-gradient(
      84.05deg,
      rgba(155, 80, 147, 0.4) -15.39%,
      rgba(27, 193, 161, 0.4) 40.22%,
      rgba(255, 255, 255, 0) 123.28%
    );
    border-radius: 94px 0px 100px;
    min-height: 100px;
  }
}
</style>
