<template>
  <div>
    <template v-if="loading">
      <content-loader
        :width="360"
        :height="260"
        :speed="2"
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
      >
        <rect x="0" y="1" rx="0" ry="0" width="241" height="24" />
        <rect x="20" y="46" rx="0" ry="0" width="356" height="17" />
        <rect x="20" y="80" rx="0" ry="0" width="338" height="17" />
        <rect x="20" y="115" rx="0" ry="0" width="277" height="17" />
        <rect x="20" y="153" rx="0" ry="0" width="349" height="17" />
        <rect x="20" y="191" rx="0" ry="0" width="223" height="17" />
      </content-loader>
    </template>
    <template v-else>
      <router-link
        v-if="parent"
        class="subcat-back"
        :to="{
          name: 'category',
          params: {
            slug: parent.slug,
          },
        }"
      >
        <icon variant="back" />
        {{ categoryTitleByLang(parent) }}
      </router-link>
      <h6>
        {{ categoryTitleByLang(category) }}
      </h6>

      <div v-for="subcat in children" :key="subcat.id" class="subcat-link">
        <router-link
          :to="{
            name: 'category',
            params: {
              slug: subcat.slug,
            },
          }"
        >
          {{ categoryTitleByLang(subcat) }}
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["category", "loading"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      categories: "categories",
    }),
    parent() {
      var parent = undefined;
      var id = this.category.id;
      var categories = this.categories;
      for (var key in categories) {
        if (categories[key].id == id) {
          break;
        } else {
          if (categories[key].children) {
            var level_2 = categories[key].children;
            for (var key1 in level_2) {
              if (level_2[key1].id == id) {
                parent = categories[key];
                break;
              } else {
                if (level_2[key1].children) {
                  var level_3 = level_2[key1].children;
                  for (var key2 in level_3) {
                    if (level_3[key2].id == id) {
                      parent = level_2[key1];
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
      return parent;
    },
    children() {
      var children = [];
      var id = this.category.id;
      var categories = this.categories;
      for (var key in categories) {
        if (categories[key].id == id) {
          children = categories[key].children;
          break;
        } else {
          if (categories[key].children) {
            var level_2 = categories[key].children;
            for (var key1 in level_2) {
              if (level_2[key1].id == id) {
                children = level_2[key1].children;
                break;
              } else {
                if (level_2[key1].children) {
                  var level_3 = level_2[key1].children;
                  for (var key2 in level_3) {
                    if (level_3[key2].id == id) {
                      children = level_3[key2].children;
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
      return children;
    },
  },
  methods: {
    categoryTitleByLang(cat) {
      var title = "...";
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
  created() {},
};
</script>

<style lang="scss" scoped>
.subcat-link {
  margin-left: 20px;
  margin-bottom: 5px;
}
.subcat-back {
  svg {
    fill: var(--primary-color);
    width: 16px;
    margin-right: 5px;
  }
  align-items: center;
  display: inline-flex;
  font-size: 13px;
}
</style>
