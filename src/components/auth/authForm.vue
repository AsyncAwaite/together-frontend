<template>
  <div>
    <b-overlay
      id="overlay-auth-modal"
      :show="isLoading"
      variant="white"
      opacity="0.8"
      spinner-variant="#f00"
      blur="none"
    >
      <div class="d-flex justify-content-end">
        <button
          @click="cons"
          class="close-modal d-flex align-items-center justify-content-center"
        >
          <icon variant="close" />
        </button>
      </div>
      <div class="authmodal__header text-center py-4">
        <img src="@/assets/img/logo_dark.svg" alt="" />
      </div>

      <template v-if="authModal.usecase == 'registration'">
        <div class="authmodal__body">
          <div class="authmodal__case-title">
            {{ $t("labels.creating_account") }}
          </div>
          <div v-show="error.registration">
            <b-alert variant="danger" show>{{ error.text }}</b-alert>
          </div>
          <b-form-radio-group
            class="mb-2 mt-3 w-100"
            id="reg-role"
            v-model="registration.role"
            :options="[
              { text: $t('labels.role_seller'), value: 2 },
              { text: $t('labels.role_buyer'), value: 3 },
            ]"
            button-variant="outline-primary"
            name="reg-role"
            buttons
          ></b-form-radio-group>
          <div class="input-group">
            <b-form-input
              id="reg-first-name"
              v-model="registration.first_name"
              :state="null"
            ></b-form-input>
            <label
              for="reg-first-name"
              :class="{ hasValue: registration.first_name }"
              >{{ $t("labels.first_name") }}</label
            >
          </div>
          <div class="input-group">
            <b-form-input
              id="reg-last-name"
              v-model="registration.last_name"
              :state="null"
            ></b-form-input>
            <label
              for="reg-last-name"
              :class="{ hasValue: registration.last_name }"
              >{{ $t("labels.last_name") }}</label
            >
          </div>
          <div class="input-group">
            <b-form-input
              id="reg-email"
              v-model="registration.email"
              :state="null"
              type="email"
            ></b-form-input>
            <label for="reg-email" :class="{ hasValue: registration.email }"
              >Email</label
            >
          </div>
          <div class="input-group">
            <b-form-input
              id="reg-password"
              v-model="registration.password"
              :state="null"
              type="password"
            ></b-form-input>
            <label
              for="reg-password"
              :class="{ hasValue: registration.password }"
              >{{ $t("labels.password") }}</label
            >
          </div>
          <div class="input-group terms">
            <b-form-checkbox
              id="checkbox-terms"
              v-model="registration.terms"
              name="checkbox-terms"
              :value="true"
              :unchecked-value="false"
              switch
            >
              {{ $t("labels.accepting") }}
              <a href="javascript::void(0)" v-b-modal.modal-terms>
                {{ $t("labels.terms_of_use") }}</a
              >
            </b-form-checkbox>
          </div>
          <div class="input-group">
            <b-button
              variant="primary"
              class="mb-2"
              :disabled="signUpButtonDisabled"
              @click="submitRegistration()"
              >{{ $t("buttons.action_create_account") }}</b-button
            >
            <b-button
              variant="primary"
              color="#ea4335"
              class="mb-2 google"
              :disabled="socialdLoginButtonDisabled"
              @click="signInWithGoogle()"
              >{{
                $t("buttons.sign_in_with", { provider: "Google" })
              }}</b-button
            >
            <b-button
              variant="primary"
              color="#ea4335"
              class="mb-2 facebook"
              :disabled="socialdLoginButtonDisabled"
              @click="signInWithFacebook()"
              >{{
                $t("buttons.sign_in_with", { provider: "Facebook" })
              }}</b-button
            >
          </div>
          <div class="authmodal__footer">
            {{ $t("labels.already_user_question") }}
            <a href="#" @click.prevent="switchToLogin()">{{
              $t("buttons.login")
            }}</a>
          </div>
        </div>
      </template>

      <template v-if="authModal.usecase == 'login'">
        <div class="authmodal__body">
          <div class="authmodal__case-title">
            {{ $t("labels.login") }}
          </div>
          <div v-show="error.login">
            <b-alert variant="danger" show>{{ error.text }}</b-alert>
          </div>
          <div class="input-group">
            <b-form-input
              id="login-email"
              v-model="login_data.email"
              :state="null"
              type="email"
            ></b-form-input>
            <label for="login-email" :class="{ hasValue: login_data.email }"
              >Email</label
            >
          </div>
          <div class="input-group">
            <b-form-input
              id="login-password"
              v-model="login_data.password"
              :state="null"
              type="password"
            ></b-form-input>
            <label
              for="login-password"
              :class="{ hasValue: login_data.password }"
              >{{ $t("labels.password") }}</label
            >
          </div>
          <div class="input-group">
            <b-button
              variant="primary"
              :disabled="loginButtonDisabled"
              class="mb-2"
              @click="submitLogin()"
              >{{ $t("buttons.action_login") }}</b-button
            >
            <b-button
              variant="primary"
              color="#ea4335"
              class="mb-2 google"
              :disabled="socialdLoginButtonDisabled"
              @click="signInWithGoogle()"
              >{{
                $t("buttons.sign_in_with", { provider: "Google" })
              }}</b-button
            >
            <b-button
              variant="primary"
              color="#ea4335"
              class="mb-2 facebook"
              :disabled="socialdLoginButtonDisabled"
              @click="signInWithFacebook()"
              >{{
                $t("buttons.sign_in_with", { provider: "Facebook" })
              }}</b-button
            >
          </div>
          <div class="authmodal__footer">
            <a href="#" @click.prevent="switchToRegistration()">{{
              $t("buttons.action_create_account")
            }}</a>

            <div>
              <br />
              {{ $t("labels.forgot_password_question") }}
              <a href="#" @click.prevent="switchToRecovery">{{
                $t("buttons.action_recover_password")
              }}</a>
            </div>
          </div>
        </div>
      </template>
      <template v-if="authModal.usecase == 'recovery'">
        <div class="authmodal__case-title">
          {{ $t("labels.password_recovery") }}
        </div>
        <div v-show="recovery_email_sent">
          <b-alert variant="success" show>
            {{ $t("labels.recovery_email_sent", { email: login_data.email }) }}
          </b-alert>
        </div>
        <div v-show="error.recovery">
          <b-alert variant="danger" show>{{ error.text }}</b-alert>
        </div>
        <template v-if="recovery_email_sent == false">
          <div class="input-group">
            <b-form-input
              id="login-email"
              v-model="login_data.email"
              :state="null"
              type="email"
            ></b-form-input>
            <label for="login-email" :class="{ hasValue: login_data.email }"
              >Email</label
            >
          </div>
          <div class="input-group">
            <b-button
              variant="primary"
              :disabled="recoverButtonDisabled"
              @click="submitForgotPassword()"
              >{{ $t("buttons.action_recover_password") }}</b-button
            >
          </div>
          <div class="authmodal__footer">
            <a href="#" @click.prevent="switchToLogin()">{{
              $t("buttons.action_login")
            }}</a>
          </div>
        </template>
        <template v-if="recovery_email_sent">
          <div class="input-group">
            <b-button variant="primary" @click="switchToLogin()">{{
              $t("buttons.action_login")
            }}</b-button>
          </div>
        </template>
      </template>
    </b-overlay>
    <b-modal
      id="modal-terms"
      title="terms of use"
      ok-only
      scrollable
      hide-header
    >
      <h4 class="mt-3 pb-2">
        {{ termsToShow.title }}
      </h4>
      <div class="terms-content mt-2">
        <div v-html="termsToShow.html"></div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["usecase"],
  data() {
    return {
      isLoading: false,
      error: {
        login: false,
        registration: false,
        recovery: false,
        text: "",
      },
      registration: {
        first_name: "",
        last_name: "",
        full_name: "",
        role: 3,
        email: "",
        password: "",
        terms: true,
      },
      login_data: {
        email: "",
        password: "",
      },
      recovery_email_sent: false,
      //eslint-disable-next-line
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    };
  },
  computed: {
    ...mapGetters({
      authModal: "authModal",
      api: "api",
      isAuthenticated: "sanctum/isAuthenticated",
      user: "sanctum/getUser",
      buyerTerms: "buyerTerms",
      sellerTerms: "sellerTerms",
    }),
    termsToShow() {
      var terms = "";
      var text = {
        html: "",
        title: "",
      };
      var newRole = this.registration.role;
      if (newRole == 2) {
        terms = this.sellerTerms;
      } else {
        terms = this.buyerTerms;
      }

      var locale = this.$i18n.locale;
      for (var key in terms.translations) {
        if (terms.translations[key].locale == locale) {
          text.html = terms.translations[key].description;
          text.title = terms.translations[key].title;
        }
      }

      return text;
    },
    loginButtonDisabled() {
      var isDisabled = false;
      if (
        this.login_data.password.length < 6 ||
        !this.login_data.email ||
        !this.reg.test(this.login_data.email)
      ) {
        isDisabled = true;
      }
      return isDisabled;
    },
    recoverButtonDisabled() {
      var isDisabled = false;
      if (!this.login_data.email || !this.reg.test(this.login_data.email)) {
        isDisabled = true;
      }
      return isDisabled;
    },
    socialdLoginButtonDisabled() {
      var isDisabled = false;
      if (
        this.authModal.usecase == "registration" &&
        !this.registration.terms
      ) {
        isDisabled = true;
      }
      return isDisabled;
    },
    signUpButtonDisabled() {
      var isDisabled = false;
      if (
        this.registration.password.length < 6 ||
        !this.registration.email ||
        !this.reg.test(this.registration.email) ||
        !this.registration.first_name ||
        !this.registration.last_name ||
        !this.registration.terms
      ) {
        isDisabled = true;
      }

      return isDisabled;
    },
  },
  methods: {
    ...mapActions({
      login: "sanctum/login",
      logout: "sanctum/logout",
    }),
    cons () {
        this.$bvModal.hide("auth-modal");
    },
    signInWithGoogle() {
      var url = "/api/auth/google?role=" + this.registration.role;
      this.$api.get(url).then((response) => {
        console.log(response.data);
            this.submitLogin();
              this.$gtag.event('Регистрация через Google', {
            'event_category': "Регистрация пользователя",
            'event_label': "Регистрация через Google",
            'value': 1,
          });
        window.open(response.data, "_self");
      });
    },
    signInWithFacebook() {
      var url = "/api/auth/facebook?role=" + this.registration.role;
      this.$api.get(url).then((response) => {
        console.log(response.data);
            this.submitLogin();
              this.$gtag.event('Регистрация через Facebook', {
            'event_category': "Регистрация пользователя",
            'event_label': "Регистрация через Facebook",
            'value': 1,
          });
        window.open(response.data, "_self");
      });
    },
    clearErrors() {
      this.error.login = false;
      this.error.registration = false;
      this.error.text = "";
    },
    switchToLogin() {
      this.clearErrors();
      this.$store.dispatch("switchToLogin");
    },
    switchToRecovery() {
      this.clearErrors();
      this.$store.dispatch("switchToRecovery");
    },
    switchToRegistration() {
      this.clearErrors();
      this.$store.dispatch("switchToRegistration");
    },

    async submitLogin() {
      this.isLoading = true;
      this.clearErrors();
      let credentials = {
        email: this.login_data.email,
        password: this.login_data.password,
      };
      this.login(credentials)
        .then((data) => {
          console.log(data);
          this.$bvModal.hide("auth-modal");
          this.isLoading = false;
          if (data.result == false) {
            this.error.login = true;
            this.error.text = "Помилка входу";
          }
        })
        .catch((error) => {
          this.error.login = true;
          let msg = this.$t("login_errors." + error.response.data.message);
          this.error.text = msg;
          this.isLoading = false;
        });
    },

    async submitRegistration() {
      this.clearErrors();
      this.isLoading = true;
      var newUserData = {
        first_name: this.registration.first_name,
        last_name: this.registration.last_name,
        name: this.registration.first_name + " " + this.registration.last_name,
        email: this.registration.email,
        password: this.registration.password,
        password_confirmation: this.registration.password,
        role: this.registration.role,
      };

      let url = this.api.baseUrl + this.api.endpoints.registration;
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(newUserData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        this.isLoading = false;
        console.log(json);
        if (json.result == "false") {
          this.error.registration = true;
          let msg = this.$t("registration_errors." + json.message);
          this.error.text = msg;
        } else {
          //Login on success
          this.login_data.email = this.registration.email;
          this.login_data.password = this.registration.password;
          this.submitLogin();
              this.$gtag.event('Регистрация пользователя', {
            'event_category': "Регистрация пользователя",
            'event_label': "Обычная регистрация",
            'value': 1,
          });
          window.fbq('track', 'CompleteRegistration');
        }
      } catch (error) {
        this.error.registration = true;
        let msg = this.$t("registration_errors." + error.response.data.message);
        this.error.text = msg;
        this.isLoading = false;
      }
    },
    async submitForgotPassword() {
      this.isLoading = true;
      this.clearErrors();

      let postData = {
        email: this.login_data.email,
      };

      await this.$api.get("sanctum/csrf-cookie").then(() => {
        this.$api.post(this.api.endpoints.forgot, postData).then(
          (response) => {
            console.log(response.data.result);

            if (response.data.result === true) {
              this.error.recovery = false;
              this.isLoading = false;
              this.recovery_email_sent = true;
              this.$forceUpdate;
            } else {
              this.error.recovery = true;
              let msg = this.$t("recovery_errors." + response.data.message);
              this.error.text = msg;
            }
          },
          (error) => {
            this.isLoading = false;
            this.error.recovery = true;
            let msg = this.$t("recovery_errors." + error.response.data.message);
            this.error.text = msg;
          }
        );
      });
    },
  },
  mounted() {
 
    this.$nextTick(() => {
      console.log(this.usecase);
      if (
        this.usecase == "registration" ||
        this.authModal.usecase == "registration"
      ) {
        this.switchToRegistration();
      } else {
        this.switchToLogin();
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.facebook {
  background: #3b5998;
  border-color: #3b5998;
  &:focus,
  &:disabled {
    background: #3b5998 !important;
    border-color: #3b5998 !important;
  }
  &:hover,
  &:active {
    background: lighten(#3b5998, 5%) !important;
    border-color: lighten(#3b5998, 5%) !important;
  }
}
.google {
  background: #ea4335;
  border-color: #ea4335;
  &:focus,
  &:disabled {
    background: lighten(#ea4335, 5%) !important;
    border-color: lighten(#ea4335, 5%) !important;
  }
  &:hover,
  &:active {
    background: lighten(#ea4335, 5%) !important;
    border-color: lighten(#ea4335, 5%) !important;
  }
}
.authmodal {
  &__body {
    padding: 15px 32px;
  }
  &__footer {
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    padding: 15px 0px;
  }
  &__case-title {
    font-size: 18px;
    font-weight: 600;
    color: #666;
    margin-bottom: 5px;
  }
}
@mixin label-top {
  transform: translateY(3px);
  transition: 0.2s;
  font-size: 10px;
  font-weight: 600;
  color: var(--primary-color);
}
.input-group {
  display: flex;
  flex-direction: column;
  padding: 16px 0px 8px;
  margin-bottom: 5px;
  &:hover {
    label {
      color: var(--primary-color);
    }
    input {
      border-color: var(--primary-color);
    }
  }
  * {
    outline: none !important;
    box-shadow: none;
  }
  input {
    width: 100% !important;
    min-width: 100%;
    background: transparent;
    order: 2;
    position: relative;
    z-index: 3;
    &:focus + label {
      @include label-top;
    }
  }
  label {
    order: 1;
    font-size: 12px;
    color: #666;
    margin-bottom: 0px;
    transform: translateY(24px);
    transition: 0.2s;
    position: absolute;
    z-index: 2;
    top: 0;
    &.hasValue {
      @include label-top;
    }
  }
}

.form-control {
  border-radius: 0px;
  border: none;
  outline: none !important;
  border-bottom: 1px solid darken(#f1f1f1, 10%);
  padding-left: 0;
  padding-right: 0;
  height: 32px;
  &:focus {
    box-shadow: none;
    background: transparent;
    border-color: var(--primary-color);
    box-shadow: 0px 1px 0px 0px var(--primary-color);
  }
}
.close-modal {
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  &:hover {
    cursor: pointer;
  }
}
</style>
