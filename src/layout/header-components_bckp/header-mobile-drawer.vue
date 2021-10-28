<template>
  <div class="header__drawer">
    <div
      class="header__drawer-fader"
      :class="{ show: show }"
      @click="closeDrawer()"
    ></div>
    <div class="header__drawer-bg" :class="{ show: show }">
      <div class="drawer__header">
        <img src="@/assets/img/logo_light.svg" alt="" />
        <div class="close-btn" @click="closeDrawer">
          <icon variant="close" />
        </div>
      </div>
      <div class="drawer__content">
        <headerCatalogMobile
          :source="menuFormatted"
          v-if="showCatalog"
          @close="closeCatalog"
        />
        <button
          @click="showCatalog = true"
          class="drawer-btn d-flex align-items-center"
          v-if="!showCatalog"
        >
          <icon variant="menu" class="mr-3" /> {{ $t("labels.catalogue") }}
        </button>
        <b-button
          class="drawer-btn d-flex align-items-center"
          v-if="!showCatalog"
          :to="{name:'my', params:{tab:'favourites'}}"
        >
          <icon variant="like" class="mr-3" /> {{ $t("view_titles.my_favourites") }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import headerCatalogMobile from "@/layout/header-components/header-catalog-mobile.vue";
import _ from "lodash";
import { mapGetters } from "vuex";
export default {
  props: ["show"],
  data() {
    return {
      showCatalog: false,
      menuFormatted: {
        children: [],
      },
    };
  },
  computed: {
    visibleCategories() {
      var cats = [];
      var categories = this.categories;
      var sorted = _.orderBy(categories, ["position"], ["asc"]);
      sorted = _.filter(sorted, { visible: 1 });
      cats = sorted;
      return cats;
    },

    ...mapGetters({
      categories: "categories",
    }),
  },
  components: { headerCatalogMobile },
  methods: {
    closeCatalog() {
      this.showCatalog = false;
    },
    closeDrawer() {
      this.showCatalog = false;
      this.$emit("close", true);
    },
  },
  mounted() {
    this.menuFormatted.children = this.visibleCategories;
  },
};
</script>

<style lang="scss" scoped>
.drawer-btn {
  display: block;
  width: calc(100% - 10px);
  margin: 5px;
  appearance: none;
  background: none;
  border: none;
  text-align: left;
  height: 42px;
  padding: 0px 24px;
  border-radius: 4px;
  line-height: 1;
  transition: 0.3s;
  color:#000;
  &:hover {
    background: rgba(#1ac1a1, 0.5);
    transition: 0.3s;
      color:#000;
  }
}
.drawer {
  &__header {
    background: var(--secondary-color);
    padding: 20px 20px;
    height: 96px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .close-btn {
      cursor: pointer;
      svg {
        fill: #fff;
      }
    }
  }
}
.header__drawer {
  &-bg {
    &.show {
      transform: translateX(0);
      transition: 0.3s;
    }
    background: #fff;
    max-width: 100vw;
    width: 400px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    max-height: 100vh;
    overflow-y: scroll;
    transform: translateX(-100%);
    transition: 0.3s;
  }
  &-fader {
    position: fixed;
    visibility: hidden;
    background: rgba(#000, 0.4);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    &.show {
      visibility: visible;
      z-index: 100;
    }
  }
}
</style>
