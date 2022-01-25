<template>
  <div v-if="categories" class="catalog-item-wrapper">
    <div class="catalog-item" v-for="c in visibleCategories" :key="c.id">
      <router-link :to="{ name: 'category', params: { slug: c.slug } }">
        <icon variant="menu" class="cat-icon" />
        <span v-html="categoryTitleByLang(c)">{{ c.title }}</span>
        <icon variant="dropdown" v-if="c.children" />
      </router-link>
      <div class="children-items" v-if="c.children">
        <div
          class="catalog-item"
          v-for="child in sortCategories(c.children)"
          :key="child.id"
        >
          <router-link
            class="children-items__title"
            :to="{
              name: 'category',
              params: { slug: child.slug },
            }"
          >
            <span v-html="categoryTitleByLang(child)"></span>
          </router-link>
          <div v-if="child.children">
            <div v-for="ct in child.children" :key="ct.id">
              <router-link
                class="catalog-link-third-lvl"
                :to="{
                  name: 'category',
                  params: { slug: ct.slug },
                }"
              >
                <span v-html="categoryTitleByLang(ct)"></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  props: ["categories"],
  data() {
    return {
      sortedTest: [],
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
  },
  methods: {
    categoryTitleByLang(cat) {
      var title = "empty";
      var locale = this.$i18n.locale;
      if (cat && cat.translations) {
        for (var i = 0; i < cat.translations.length; i++) {
          if (cat.translations[i].locale == locale) {
            title = cat.translations[i].title;
          }
        }
      }

      return title;
    },
    sortCategories(categories) {
      var sorted = _.orderBy(categories, ["position"], ["asc"]);
      sorted = _.filter(sorted, { visible: 1 });

      let sortedWithOutEmpty = sorted.filter((child) => child.children);

      return sortedWithOutEmpty;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.header {
  &__catalog {
    // position: relative;
    &-list {
      // position: absolute;
      // background: #fff;
      // top: 100%;
      // left: 0;
      // right: 0;
      box-shadow: 0px 6px 16px 0px rgba(#000, 0.2);
      // padding: 20px 0px;
      // visibility: hidden;
      // opacity: 0;
      // transform: translateY(-20px);
      transition: 0.3s;
      z-index: 30;
      // &.active,
      &.home {
        visibility: visible;
        opacity: 1;
        transform: translateY(0px);
        transition: 0.3s;
      }
      &.home {
        box-shadow: 0px 6px 8px 0px rgba(#000, 0.1);
      }
      .catalog-item {
        display: flex;
        // position: relative;
      
        &-wrapper {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 35px);
          column-gap: 5px;
        }

        a {
          color: #fff;
          text-decoration: none;
          // display: flex;
          padding: 4px;
          display: block;  width: 100%;
          // align-items: center;
          // justify-content: flex-start;
          &.catalog-link-third-lvl {
            color: #1ac1a1;
            font-size: 13px;
            display: inline-block;
            span {
              font-weight: 500;
              transition: color 0.3s linear;
            }
            &:hover {
              background: none;
                  text-decoration: none;
              span {
                text-decoration: underline;
                text-decoration: none;
                color: #464a53;
              }
            }
          }
          & > span {
            font-weight: 600;
          }
          & > .cat-icon {
            display: none;
            width: 18px;
            height: 18px;
            margin-right: 12px;
            // margin-left: 6px;
            fill: #fff;
          }
          & > svg:not(.cat-icon) {
            transform: rotate(0);
     display: none;
            width: 13px;
            height: 13px;
            fill: #fff;
            margin-left: 6px;
          }
          &:hover {
           text-decoration: underline;
          }
        }
        .children-items {
          box-shadow: 0px 6px 6px 0px rgba(#000, 0.1);
          padding: 10px;
          position: absolute;
          // min-width: 400px;
          width: 100%;
          top: 32px;
          min-height: 100%;
          background: #fff;
          position: absolute;
          box-sizing: border-box;
          border: 1px solid rgba(#1ac1a1, 0.2);
          left: 0;
          visibility: hidden;
          opacity: 0;
          z-index: 999;
          transition: 0s;
          // display: flex;
          // flex-wrap: wrap;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;

          @media (min-width: 992px) {
            width: 750px;
          }

          @media (min-width: 1200px) {
            width: 860px;
          }
          .catalog-item {
            // max-width: 33.333%;
            // min-width: 33.33333%;
            // margin-bottom: 20px;
            // margin-right: 20px;
            flex-direction: column;
      
          }
          &__title {
            background: transparent;
            color: var(--secondary-color);
            &:hover {
              text-decoration: none;
            }
          }
        }
        &:hover {
          // & > a {
          //   background: rgba(#1ac1a1, 0.2);
          // }
          & > .children-items {
            visibility: visible;
            opacity: 1;
            transition: 0.3s;
          }
        }
      }
    }
    .toggle {
      padding: 8px;
      height: 44px;
      display: flex;
      align-items: center;
      transition: 0.3s;

      &:hover,
      &.active,
      &.home {
        background: rgba(#fff, 0.1);
        transition: 0.3s;
      }
      svg {
        fill: #fff;
        margin-right: 20px;
        margin-left: 6px;
      }
      cursor: pointer;
      color: #fff;
    }
  }
}
</style>
