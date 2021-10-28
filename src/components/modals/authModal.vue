<template>
  <div>
    <b-modal id="auth-modal" hide-footer hide-header>
    
      <auth-form />
    </b-modal>
  </div>
</template>

<script>
import authForm from "@/components/auth/authForm";
export default {
  data() {
    return {};
  },
  components: {
    authForm,
  },
  methods: {
    close() {
      this.$bvModal.hide("auth-modal");
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
