<template>
  <div class="reset">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 vol-sm-6 col-md-6 col-lg-5">
          <b-card v-if="!isAuthenticated">
            <b-overlay
              id="overlay-auth-modal"
              :show="isLoading"
              variant="white"
              opacity="0.8"
              spinner-variant="#f00"
              blur="none"
              ><div class="reset__form-box">
                <div class="authmodal__header text-center py-4">
                  <img src="@/assets/img/logo_dark.svg" alt="" />
                </div>
                <div class="authmodal__body">
                  <div class="authmodal__case-title">
                    {{ $t("labels.create_new_password") }}
                  </div>
                  <div v-show="error.status == true">
                    <b-alert variant="danger" show>{{ error.text }}</b-alert>
                  </div>
                  <div v-show="successfully_recovered">
                    <b-alert variant="success" show
                      >Пароль змінено успішно</b-alert
                    >
                  </div>
                  <template v-if="!successfully_recovered">
                    <div class="input-group">
                      <b-form-input
                        id="reс-password"
                        v-model="password"
                        :state="null"
                        type="password"
                      ></b-form-input>
                      <label
                        for="reс-password"
                        :class="{ hasValue: password }"
                        >{{ $t("labels.password") }}</label
                      >
                    </div>
                    <div class="input-group">
                      <b-form-input
                        id="reс-2-password"
                        v-model="password_confirmation"
                        :state="null"
                        type="password"
                      ></b-form-input>
                      <label
                        for="reс-2-password"
                        :class="{ hasValue: password_confirmation }"
                        >{{ $t("labels.password_repeat") }}</label
                      >
                    </div>
                    <div class="input-group">
                      <b-button
                        :disabled="confirmDisabled"
                        variant="primary"
                        @click="confirmNewPassword()"
                        >{{ $t("buttons.confirm_new_password") }}</b-button
                      >
                    </div>
                  </template>
                  <template v-if="successfully_recovered">
                    <div class="input-group">
                      <b-button variant="primary" @click="goToLogin()">{{
                        $t("buttons.action_login")
                      }}</b-button>
                    </div>
                  </template>
                </div>
              </div>
            </b-overlay>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
      token: "",
      email: "",
      password: "",
      password_confirmation: "",
      successfully_recovered: false,
      error: {
        status: false,
        text: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      authModal: "authModal",
      api: "api",
      isAuthenticated: "sanctum/isAuthenticated",
    }),
    confirmDisabled() {
      var disabled = false;
      if (!this.password || this.password.length < 6) {
        disabled = true;
      }
      if (
        !this.password_confirmation ||
        this.password_confirmation.length < 6
      ) {
        disabled = true;
      }
      return disabled;
    },
  },
  methods: {
    ...mapActions({
      login: "sanctum/login",
      logout: "sanctum/logout",
    }),
    resetErrors() {
      this.error.status = false;
      this.error.etxt = "";
    },
    goToLogin() {
      this.$router.push({ name: "login", params: { case: "login" } });
    },
    async confirmNewPassword() {
      this.isLoading = true;

      let postData = {
        email: this.email,
        token: this.token,
        password: this.password,
        password_confirmation: this.password_confirmation,
      };

      let url = this.api.baseUrl + this.api.endpoints.reset;
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        this.isLoading = false;
        if (json.result == "false" || json.result == false) {
          this.error.status = true;
          this.error.text = this.$t("recovery_errors." + json.message);
        }
        if (json.result == true || json.result == "true") {
          console.log("success");
          this.$router.push({ name: "login" });
        }
        console.log("success:", JSON.stringify(json));
      } catch (error) {
        this.error.status = true;
        this.error.text = error.message;
        // console.error("Ошибка:", error);
        this.isLoadiтg = false;
      }
    },
  },
  mounted() {
    this.token = this.$route.query.token;
    this.email = this.$route.query.email;
    setTimeout(() => {
      if (this.isAuthenticated) {
        this.$router.push({ name: "home" });
      }
    }, 500);
  },
};
</script>

<style lang="scss" scoped></style>
