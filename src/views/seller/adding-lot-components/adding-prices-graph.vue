<template>
  <div class="add-lot__range-graph">
    <div class="range">
      <div class="bg"></div>
      <div
        class="grid-item d-flex"
        :class="{ even: i % 2 == 0 }"
        v-for="(g, i) in product.prices"
        :key="i"
      >
        <span> {{ g.min }}шт.</span>
        <span> {{ g.price }}грн.</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["product"],
  methods: {},
};
</script>

<style lang="scss" scoped>
.add-lot {
  &__pricing {
    & > div {
    }
  }
  &__range-graph {
    padding-right: 30px;
    width: 220px;
    max-width: 300px;
    .range {
      padding: 3px 3px;
      position: relative;
      min-height: 400px;
      width: 80px;
      margin: 0px 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #f5f5f5;
      .grid-item {
        margin: 1px 0px;
        border-radius: 6px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 10px;
        line-height: 1.2;
        transition: 0.3s;
        background: #1bbea1;
        height: 20px;
        font-weight: 600;
        color: #fff;
        flex: 1;
        align-items: center;
        padding: 5px;
      }
    }
  }
}
</style>
