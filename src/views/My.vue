<template>
  <div>
    <div class="container" v-if="isAuthenticated">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column flex-md-row align-items-baseline justify-content-start align-items-md-center justify-content-md-between">
            <h1>{{ $t("view_titles.my") }}</h1>
            <roleSwitcher :uid="'my'" />
          </div>
        </div>
        <div class="col-12">
          <b-card>
            <my-seller v-if="role == 'Seller'" />
            <my-buyer v-if="role == 'Buyer'" />
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import roleSwitcher from "@/components/auth/roleSwitcher.vue";
import mySeller from "@/views/my-components/seller/my-seller.vue";
import myBuyer from "@/views/my-components/buyer/my-buyer.vue";
export default {
  data() {
    return {};
  },
  components: {
    roleSwitcher,
    mySeller,
    myBuyer,
  },
  computed: {
    ...mapGetters({
      role: "role",
      isAuthenticated: "sanctum/isAuthenticated",
    }),
  },
  methods: {
    getKey(key, group) {
      return group + "." + key;
    },
  },
  mounted() {
    setTimeout(() => {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "home" });
      }
    }, 600);
  },
   metaInfo () {
    return {
      title: this.$t("view_titles.my"),
      titleTemplate: `%s | ${this.$t('pages.main_title')}`,
    }
  }
};
</script>

<style lang="scss" scoped></style>
