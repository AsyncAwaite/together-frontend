<template>
  <div class="header__user d-flex justify-content-end">
    <template v-if="!isAuthenticated">
      <b-button
        class="d-inline-flex d-md-none"
        @click="openLoginModal()"
        variant="link"
      >
        <icon variant="login" />
      </b-button>
      <b-button
        variant="outline-dark"
        class="header__login-btn d-none d-md-inline-flex"
        @click="openLoginModal()"
        >{{ $t("buttons.login") }}</b-button
      >
      <b-button
        class="ml-2 d-none d-md-inline-flex"
        variant="outline-dark"
        @click="openRegistrationModal()"
        >{{ $t("buttons.registration") }}</b-button
      >
    </template>
    <template v-if="isAuthenticated">
      <favourites class="d-none d-sm-block" :count="user.favourites.length || 0" />
      <notifications class="mr-2 md-sm-0" />
      <orders :count="orders ? orders.length : 0" class="d-none d-sm-block" />
      <div class="header__user">
        <div
          class="user-toggle d-flex align-items-center"
          @mouseenter="showUserMenu = true"
          @mouseleave="showUserMenu = false"
          @click.self="showUserMenu = !showUserMenu"
        >
          <b-avatar
            :text="avatarLetters"
            :class="{ seller: role == 'Seller' }"
          ></b-avatar>
          <span class="ml-2 d-flex flex-column">
            <div class="d-flex align-items-center">
              <span class="d-none d-sm-inline">{{ userName }}</span>
              <icon variant="dropdown" />
            </div>
            <div class="user-role d-none d-sm-block">
              <b-badge
                variant="warning"
                size="small"
                class="mt-1"
                v-if="role == 'Seller'"
              >
                {{ $t("labels.role_seller") }}
              </b-badge>
              <b-badge variant="primary" size="small" class="mt-1" v-else>{{
                $t("labels.role_buyer")
              }}</b-badge>
            </div>
          </span>

          <div class="user-dropdown" :class="{ show: showUserMenu }">
            <div class="bg">
              <roleSwitcher :uid="'header'" />
              <router-link :to="{ name: 'my', params: { tab: 'default' } }">{{
                $t("view_titles.my")
              }}</router-link>
              <router-link :to="{ name: 'my', params: { tab: 'favourites' } }">
                {{ $t("view_titles.my_favourites") }} <b-badge size="sm" v-if="user.favourites.length">{{user.favourites.length}}</b-badge>
              </router-link>
              <router-link :to="{ name: 'my', params: { tab: 'orders' } }">
                {{ $t("view_titles.my_orders") }} <b-badge size="sm" v-if="orders && orders.length">{{orders.length}}</b-badge>
              </router-link>
              <a to="#" @click.prevent="onLogout()">{{
                $t("buttons.logout")
              }}</a>
            </div>
          </div>
        </div>
      </div>
    </template>
    <cart/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import roleSwitcher from "@/components/auth/roleSwitcher.vue";
import notifications from "./header-notifications.vue";
import favourites from "./header-favourites.vue";
import orders from "./header-orders.vue";
import cart from "./header-cart.vue";
export default {
  data() {
    return {
      showUserMenu: false,
    };
  },
  components: {
    roleSwitcher,
    notifications,
    favourites,
    orders,
    cart
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "sanctum/isAuthenticated",
      user: "sanctum/getUser",
      role: "role",
      orders: "orders",
    }),
    avatarLetters() {
      var letters = "AB";
      if (this.user && this.user.name) {
        var names = this.user.name.split(" ");
        letters = names[0][0] + names[1][0];
      }
      return letters;
    },
    userName() {
      var userName = "";
      if (this.user && this.user.name) {
        userName = this.user.name;
      }
      userName = userName.split(" ");

      return userName[0];
    },
  },
  methods: {
    ...mapActions({
      // login: "sanctum/login",
      logout: "sanctum/logout",
    }),
    onLogout() {
      this.logout()
        .then((response) => {
          console.log(response);
          // this.$router.push("/login");
        })
        .catch((error) => {
          // whoops, something went wrong
          console.log(error);
        });
    },
    openRegistrationModal() {
      this.$store.dispatch("switchToRegistration");
      this.$bvModal.show("auth-modal");
    },
    openLoginModal() {
      this.$store.dispatch("switchToLogin");
      this.$bvModal.show("auth-modal");
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  &__user {
    .btn {
      height: initial;
    }
    .user-role {
      * {
        font-size: 10px !important;
        font-weight: 600;
      }
    }
    .user-dropdown {
      width: 220px;
      visibility: hidden;
      opacity: 0;
      top: 100%;
      &.show {
        visibility: visible;
        opacity: 1;
        z-index: 10;
      }
      .bg {
        background: #fff;
        padding: 6px 0px 0px;
        border-radius: 6px;
        margin-top: 8px;
        box-shadow: 0px 3px 16px 0px rgba(#000, 0.2);
      }
      z-index: 0;
      top: calc(100% - 1px);
      right: 0;
      position: absolute;
      .role-toggle {
        padding: 10px 12px;
        display: block;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .ui-toggle {
          display: flex;
          background: #037bff;
          border-radius: 20px;
          width: 40px;
          position: relative;
          height: 20px;
          transition: 0.3s;
          margin-left: 10px;
          box-shadow: inset 0px 0px 4px 0px rgba(#000, 0.2);
          &.seller {
            background: #ffc105;
            transition: 0.3s;
            span {
              left: calc(100% + 1px);
              transform: translateX(-100%);
              transition: 0.3s;
            }
          }
          span {
            position: absolute;
            height: 22px;
            width: 22px;
            border-radius: 50%;
            background: #fff;
            left: 0px;
            top: -1px;
            transition: 0.3s;
            box-shadow: 0px 3px 6px 0px rgba(#000, 0.2);
          }
        }
      }
      a {
        padding: 10px 12px;
        display: block;
        color: #000;
        transition: 0.2s;
        border-bottom: 1px solid #e7e7e7;
        &:hover {
          background: var(--primary-color);
          text-decoration: none;
        }
        &:last-child {
          border-bottom: none;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }
      }
    }
    .user-toggle {
      cursor: pointer;
      position: relative;
      line-height: 1;
      // &:hover {
      //   .user-dropdown {
      //     visibility: visible;
      //     opacity: 1;
      //     z-index: 10;
      //   }
      // }
      span {
        font-size: 15px;
      }
      .b-avatar {
        border: 2px solid #fff;
        @media (max-width: 768px) {
          width: 32px;
          height: 32px;
        }
        &.seller {
          border-color: #ffc105;
          background: #ffc105;
        }
      }
      svg {
        height: 10px;
        width: 10px;
        margin-left: 4px;
      }
    }
  }
}
</style>
