<template>
  <div class="context-menu" :class="position">
    <font-awesome-icon :icon="['fa', 'caret-down']" />
    <div class="bg">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "contextMenu",
  props: {
    position: {
      type: [String],
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped>
.context-menu {
  position: absolute;
  top: calc(100% + 16px);
  right: 0px;
  min-height: 10px;
  font-size: 30px;
  min-width: 100px;
  width: auto;

  &.top {
    top: initial;
    bottom: calc(100% + 16px);

    & > svg {
      top: initial !important;
      bottom: -17px !important;
      transform: scaleY(1);
    }
    .bg {
      box-shadow: 0px -10px 42px 0px rgba(#000, 0.2);
    }
  }

  &.left {
    top: 0;
    right: calc(100% + 17px);
    & > svg {
      top: 0 !important;
      right: -10px;
      transform: rotate(-90deg);
    }
    .bg {
      box-shadow: 10px 0px 42px 0px rgba(#000, 0.2);
    }
  }

  .bg {
    background-color: #fff;
    padding: 5px 0px;
    border-radius: 8px;
    box-shadow: 0px 10px 42px 0px rgba(#000, 0.2);
  }

  & > svg {
    position: absolute;
    right: 10px;
    top: -17px;
    transform: scaleY(-1);
  }

  a {
    display: flex;
    color: #424242;
    text-decoration: none;
    padding: 15px 15px;
    align-items: center;
    font-size: 16px;
    white-space: nowrap;

    svg {
      margin-right: 20px;
    }

    &:hover {
      background-color: rgba(#1ca5fc, 0.1);
    }
  }
}
</style>
