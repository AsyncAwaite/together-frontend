<template>
  <div>
    <h3 class="text-center">
      {{ $t("labels.popular_categories") }}
    </h3>
    <section class="home__popular-categories">
      <div class="section-bg"></div>
      <div class="container">
        <div class="row">
          <div
            class="col-12 col-sm-6 col-md-3 item"
            v-for="c in popularCagetgories"
            :key="c.id"
          >
            <router-link :to="{ name: 'category', params: { slug: c.slug } }" class="thumb">
              <img :src="c.image_index_url" alt="" />
              <div class="bg" :style="{ backgroundColor: c.color }"></div>
            </router-link>
            <router-link :to="{ name: 'category', params: { slug: c.slug } }">
              {{ categoryTitleByLang(c) }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      categories: "categories",
    }),
    popularCagetgories() {
      var popular = [];
      for (var key in this.categories) {
        if (this.categories[key].popular == 1 && popular.length < 4) {
          popular.push(this.categories[key]);
        }
      }
      return popular;
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
};
</script>

<style lang="scss" scoped>
.home {
  &__popular-categories {
    padding: 0px 0px 20px;
    position: relative;
    min-height: 100px;
    .section-bg {
      background: #dadada;
      border-radius: 100px 0px 94px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 60px;
    }
    .item {
      .thumb {
        position: relative;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        img {
          position: relative;
          z-index: 2;
          max-height: 90%;
          max-width: 90%;
          height: auto;
        }
        .bg {
          position: absolute;
          width: 100%;
          bottom: 0;
          height: 110px;
          background: #85aecc;
          border-radius: 3px 3px 100px 3px;
          transition: 0.3s;
        }
      }
      &:hover {
        .bg {
          transition: 0.3s;
          box-shadow: 0px 6px 16px 0px rgba(#000, 0.2);
        }
      }
      a {
        font-weight: 800;
     
        color: #000;
      }
    }
  }
}
</style>
