<template>
  <div>
    <b-row>
      <div class="col-12 col-sm-4 mb-4">
        <ul class="my__links">
          <li v-for="link in my_links" :key="link.route">
            <router-link
              :to="{ name: 'my', params: { tab: link.route } }"
              :class="{ current: $route.params.tab == link.route }"
            >
              {{ $t(getKey(link.id, "view_titles")) }}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="col-12 col-sm-8 pt-2">
        <template v-if="$route.params.tab == 'lots'">
          <myLots :items="my_products" @update="fetchItems" />
        </template>
        <template v-if="$route.params.tab == 'favourites'">
          <myFavourites />
        </template>
        <template v-if="$route.params.tab == 'notifications'">
          <myNotifications />
        </template>
        <template v-if="$route.params.tab == 'payment-methods'">
          <myPaymentMethods />
        </template>
        <template v-if="$route.params.tab == 'orders'">
          <myOrders />
        </template>
      </div>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import myLots from "./tabs/tab-all-offers.vue";
import myNotifications from "@/views/my-components/common/tabs/tab-notifications.vue";
import myFavourites from "@/views/my-components/common/tabs/tab-favourites.vue";
import myPaymentMethods from "@/views/my-components/common/tabs/tab-payment-methods.vue";
import myOrders from "@/views/my-components/common/tabs/tab-orders.vue";
import { PRODUCT_BY_USER_ID } from "@/constants/graphql";
export default {
  data() {
    return {
      my_products: [],
      isLoading: false,
      my_links: [
        {
          id: "my_lots",
          route: "lots",
        },
        {
          id: "my_orders",
          route: "orders",
        },
        {
          id: "my_favourites",
          route: "favourites",
        },
        {
          id: "my_notifications",
          route: "notifications",
        },
        {
          id: "my_payment_methods",
          route: "payment-methods",
        },
      ],
    };
  },
  components: {
    myLots,
    myNotifications,
    myFavourites,
    myPaymentMethods,
    myOrders
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "sanctum/isAuthenticated",
      user: "sanctum/getUser",
      role: "role",
    }),
  },
  methods: {
    fetchItems() {
      this.$apollo
        .query({
          query: PRODUCT_BY_USER_ID,
          update: (data) => {
            return data.products;
          },
          variables: {
            user_id: this.user.id,
          },
          fetchPolicy: "network",
        })
        .then((data) => {
          this.my_products = data.data.products;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getKey(key, group) {
      return group + "." + key;
    },
  },
  mounted() {
    this.fetchItems();
  },
};
</script>

<style lang="scss" scoped>
.my {
  &__links {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      a {
        display: flex;
        padding: 8px 0px;
        border-bottom: 1px solid #e7e7e7;
        &.current {
          color: #000;
          text-decoration: none;
          cursor: default;
        }
      }
    }
  }
}
</style>
