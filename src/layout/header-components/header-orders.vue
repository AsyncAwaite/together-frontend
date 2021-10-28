<template>
  <div class="header__orders">
    <b-button
      variant="light"
      size="sm"
      class="has_new"
      :to="{ name: 'my', params: { tab: 'orders' } }"
    >
      <icon variant="shopping-cart" />
      <div class="count" v-if="count">
        {{ count }}
      </div>
    </b-button>
  </div>
</template>

<script>
export default {
  props: ["count"],
};
</script>

<style lang="scss" scoped>
.header__orders {
  display: flex;
  align-items: center;
  margin-right: 12px;
  position: relative;
  svg {
    height: 28px;
    width: 28px;
    fill: #464a53;
    opacity: 0.5;
  }
  .btn-light {
    background: transparent;
    border: none;
    position: relative;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    @media (max-width: 768px) {
      height: 32px;
      width: 32px;
      padding: 0;
      svg {
        height: 22px;
        width: 22px;
      }
    }
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: rgba(#464a53, 0.1) !important;
    }
    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
    &:active,
    &.show {
      background: rgba(#464a53, 0.2) !important;
      border: none !important;
      box-shadow: none !important;
    }
    &.has_new {
      svg {
        opacity: 0.8;
      }
      .count {
        display: flex !important;
      }
    }
    .count {
      //   display: none;
      min-width: 20px;
      height: 20px;
      background: #ffc108;
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 50%;
      color: #000;
      font-size: 12px !important;
      line-height: 1;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
