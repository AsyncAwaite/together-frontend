<template>
  <div class="header__catalog-list">
    <catalog-list v-if="categories" :categories="sortedCategories" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import catalogList from "@/layout/header-components/header-catalog.vue";
import _ from "lodash";
export default {
  components: { catalogList },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      categories: "categories",
    }),
    sortedCategories() {
      return _.orderBy(this.categories, ["position"], ["asc"]);
    },
  },
};
</script>

<style lang="scss" scoped>
.header__catalog-list {
    position: relative
}
</style>
