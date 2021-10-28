<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    createQueryString(params) {
      var queryString = Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");
      return queryString;
    },
    sendToApi() {
      var base = "/api/auth/google/callback?";

      if (this.$route.name == "facebook-auth-api") {
        base = "/api/auth/facebook/callback?";
      }

      var query = this.createQueryString(this.$route.query);

      this.$api(base + query)
        .then((response) => {
          console.log(response);
          // window.location.reload();
          window.location.href = "/";
        })
        .catch((error) => {
          console.log(error);
          window.location.href = "/";
        });
    },
  },
  mounted() {
    this.sendToApi();
  },
};
</script>

<style lang="scss" scoped></style>
