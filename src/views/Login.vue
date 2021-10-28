<template>
  <div class="login">
    <div class="container">
      <div class="row justify-content-center">
        <div class="login__form-box">
          <auth-form :key="key" :usecase="usecase" v-if="!isUser" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authForm from "@/components/auth/authForm";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      usecase: null,
      key: 1,
    };
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "sanctum/isAuthenticated",
      user: "sanctum/getUser",
    }),
    isUser() {
      return this.isAuthenticated;
    },
  },
  components: {
    authForm,
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.case) {
        this.usecase = this.$route.query.case;
        this.key = 2;
      } else {
        this.usecase = "login";
        this.$store.dispatch("switchToLogin");
      }
      window.setInterval(() => {
        if (this.isAuthenticated) {
          this.$router.push("/");
        }
      }, 500);
    });
  },
};
</script>

<style lang="scss" scoped>
.login {
  &__form-box {
    width: 400px;
    max-width: 100%;
  }
}
</style>
