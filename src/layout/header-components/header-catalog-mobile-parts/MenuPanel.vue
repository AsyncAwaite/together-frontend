<template>
  <div class="MenuPanel">
    <div
      class="Menu__panel"
      :style="[
        functionalityStyle,
        positionStyle,
        isTranslating ? transitionStyle : {},
      ]"
    >
      <div v-if="list.title" @click="handleHeaderClicked" class="Menu__header">
        <icon variant="back" class="mr-2" v-show="showHeaderArrow" />
        {{ list.title }}
      </div>

      <ul class="Menu__list">
        <li
          v-for="(item, i) in list.children"
          @click="handleItemClicked(item)"
          :key="i"
          class="Menu__item d-flex justify-content-between"
        >
          <template v-if="item.children && item.children.length > 0">
            <div class="text" v-html="categoryTitleByLang(item)"></div>
            <icon variant="chevron-right" class="ml-2" />
          </template>
          <router-link
            v-else
            :to="{ name: 'category', params: { slug: item.slug } }"
          >
            <div class="text" v-html="categoryTitleByLang(item)"></div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    list: {
      type: Object,
      required: true,
    },
    positionStyle: {
      type: Object,
      required: true,
    },
    showHeaderArrow: {
      type: Boolean,
      default: false,
    },
    isTranslating: {
      type: Boolean,
      default: false,
    },
    handleHeaderClicked: {
      type: Function,
      default: () => {},
    },
    handleItemClicked: {
      type: Function,
      default: () => {},
    },

    // @TODO: create createMenuPanel.js to assign `functionalityStyle` which is not diff from next, staging, and prev panel in parent component.
    functionalityStyle: {
      type: Object,
      required: true,
    },
    transitionStyle: {
      type: Object,
      required: true,
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
  },
};
</script>

<style lang="scss" scoped>
ul,
li {
  padding: 0;
  margin: 0;
}

.Menu__header {
  display: flex;
  align-items: center;
  padding-left: 35px;
  height: 50px;
  color: #fff;
  font-size: 16px;
  background-color: #464a53;
  cursor: pointer;
  svg {
    fill: #fff;
  }
  .arrow {
    padding-top: 2px;
    fill: #fff;
    margin-right: 10px;
    width: 10px;
    height: 100%;
    display: flex;
    align-items: center;
  }
}

.Menu__list {
  list-style: none;
  padding-bottom: 2px;

  .separator {
    border-bottom: 1px solid #d5dbdb;
    padding: 2px 0 0 0;
    margin: 0;
  }
}

.Menu__item {
  color: #4a4a4a;
  padding-left: 35px;
  height: 45px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 20px;
  svg {
    height: 12px;
    width: 12px;
  }
  a {
    color: #4a4a4a;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
  }

  .arrow {
    padding-top: 2px;
    padding-left: 15px;
    display: flex;
    align-items: center;
    width: 10px;
    height: 100%;
  }
}
</style>
