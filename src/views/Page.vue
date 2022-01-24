<template>
  <div>
    <div class="container">
      <h1 class="mb-4">
        {{ translatedpage().title }}
      </h1>
      <template v-if="isLoading">
        <pageSkeleton />
      </template>
      <template v-else>
        <pageAbout :page="translatedpage()" v-if="page.slug == 'pro-servis'" />
        <pageContacts :page="translatedpage()" v-if="page.slug == 'kontakti'" />
        <b-card v-else>
          <div  v-html="translatedpage().description"></div>
        </b-card>
      </template>
    </div>
  </div>
</template>

<script>
import { PUBIC_PAGE } from "@/constants/graphql";
import pageAbout from "./page-templates/page-about.vue";
import pageContacts from "./page-templates/page-contacts.vue";
import { pageSkeleton } from "@/components/skeletons";
export default {
  data() {
    return {
      page: {},
      isLoading: false,
    };
  },
  components: {
    pageAbout,
    pageContacts,
    pageSkeleton,
  },
  methods: {
    translatedpage() {
      var page = this.page.translations;
      var lang = this.$i18n.locale;
      var translated = {
        title: "",
        description: "",
      };
      for (var key in page) {
        if (page[key].locale == lang) {
          translated.title = page[key].title;
          translated.description = page[key].description;
        }
      }
      return translated;
    },
    getPage() {
      this.isLoading = true;
      this.$apollo
        .query({
          query: PUBIC_PAGE,
          update: (data) => {
            return data.page;
          },
          variables: {
            slug: this.$route.params.slug,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          console.log(data);
          this.page = data.data.page;
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = true;
          console.log(error);
        });
    },
  },
  mounted() {
    this.getPage();
  },
    metaInfo () {
  
    return {
      title:  this.translatedpage().title,
      titleTemplate: `%s | ${this.$t('pages.main_title')}`,   
         meta: [
      { name: "description", content: `${this.$t("pages.main_meta_descr")}` },
    ],
   
     
    }
    
  },
};
</script>

<style lang="scss" scoped>

    strong {
      font-weight: 600;
    }

</style>
