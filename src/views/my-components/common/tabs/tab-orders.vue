<template>
  <div>
    <h3 class="mb-4">
      {{ $t("view_titles.my_orders") }}
    </h3>
    <div class="my-orders__list mt-3">
      <template v-if="!isloading && !sortedOrders.length">
        <message>
         {{$t('message.no_orders')}}
        </message>
      </template>
      <template v-if="isloading">
        <orderSkeleton v-for="n in 3" :key="n" />
      </template>
      <template v-if="!isloading">
        <div v-for="o in sortedOrders" :key="o.id">
          <b-card class="mb-4">
            <order-item :order="o" @pay="payOrderStart" />
          </b-card>
        </div>
        <b-pagination
          align="center"
          class="mt-4"
          v-show="!isloading && total_bought / perPage > 1"
          first-number
          last-number
          v-model="currentPage"
          :total-rows="totalOrders"
          :per-page="perPage"
          :key="paginationKey"
          :limit="10"
          @change="getOrders"
        ></b-pagination>
      </template>
    </div>
    <b-modal id="modal-pay-order" hide-header centered>
      <b-overlay
        id="overlay-order-pay"
        :show="isloading"
        variant="white"
        opacity="0.8"
        spinner-variant="#f00"
        blur="none"
      >
        <h4>Оплатити замовлення #{{ order_to_pay }}</h4>
        <p>Оберіть картку, якою хочете сплатити вибране замовлення</p>
        <div v-show="order_pay_error">
          <b-alert show variant="danger"
            >Помилка оплати. Спробуйте іншу картку</b-alert
          >
        </div>
        <v-select
          v-if="cards"
          :options="cards"
          v-model="selectedCard"
          :clearable="false"
          autocomplete="on"
          :loading="isloading"
          @option:selecting="selectCard"
        >
          <template #no-options="{}">
            <div>
              Немає доступних методів оплати
            </div>
          </template>
          <template #selected-option="{ masked_card, card_type}">
            <div class="d-flex align-items-center">
              <div class="card-type mr-2">
                <icon v-if="card_type == 'VISA'" variant="visa" />
                <icon v-else variant="mc" />
              </div>
              {{ masked_card }}
            </div>
          </template>
          <template #option="{ masked_card, card_type }">
            <div class="d-flex align-items-center">
              <div class="card-type mr-2">
                <icon v-if="card_type == 'VISA'" variant="visa" />
                <icon v-else variant="mc" />
              </div>
              {{ masked_card }}
            </div>
          </template>
        </v-select>
      </b-overlay>
      <template #modal-footer="{cancel}">
        <b-button
          block
          variant="primary"
          :disabled="!selectedCard || isloading"
          @click="processPay"
        >
          Оплатити замовлення
        </b-button>
        <b-button block variant="outline-danger" @click="cancel()">
          Скасувати
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import orderItem from "@/components/lists/order-item.vue";
import { ORDERS_ALL } from "@/constants/graphql";
import { orderSkeleton } from "@/components/skeletons";
import _ from "lodash";
export default {
  components: {
    orderItem,
    orderSkeleton,
  },
  data() {
    return {
      isloading: false,
      cards: [],
      orders: [],
      order_to_pay: null,
      selectedCard: null,
      order_pay_error: null,
      currentPage: 1,
      totalPages: 0,
      perPage: 18,
      totalFound: 0,
      totalOrders: 0,
      paginationKey: 999,
    };
  },
  computed: {
    sortedOrders() {
      return _.orderBy(this.orders, ["created_at"], ["desc"]);
    },
    ...mapGetters({
      role: "role",
      user: "sanctum/getUser",
      isAuthenticated: "sanctum/isAuthenticated",
    }),
  },
  methods: {
    closeModal() {
      this.$root.$bvModal.hide("modal-pay-order");
    },
    selectCard(card) {
      this.selectedCard = card;
    },
    payOrderStart(value) {
      this.$bvModal.show("modal-pay-order");
      this.order_to_pay = value;
      this.getUserCards();
    },
    processPay() {
      this.isloading = true;
      var url = "/api/pay-with-token";
      this.$api
        .post(url, {
          card_id: this.selectedCard.id,
          order_id: this.order_to_pay,
        })
        .then((data) => {
          console.log(data.data);
          if (data.data.result == true || data.data.result == "true") {
            this.closeModal();
            this.$apollo.queries.orders.refresh();
          } else {
            this.order_pay_error = "error";
          }
          this.isloading = false;
        })
        .catch((error) => {
          console.log(error);
          this.order_pay_error = error;
          this.isloading = false;
        });
    },
    getOrders(page) {
      this.isloading = true;

      this.$apollo
        .query({
          query: ORDERS_ALL,
          update: (data) => {
            return data.data.data;
          },
          fetchPolicy: "network",
          variables: {
            page: page,
          },
        })
        .then((data) => {
          console.log(data.data.orders.data);
          this.orders = data.data.orders.data;
          var paginator = data.data.orders.paginatorInfo;

          //Scroll to top
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          this.currentPage = paginator.currentPage;
          this.perPage = paginator.perPage;
          this.totalPages = Number(paginator.lastPage);
          this.totalOrders = Number(paginator.total);
          this.isloading = false;
          this.totalFound = paginator.total;
          this.paginationKey++;
        })
        .catch((error) => {
          this.isloading = false;
          console.log(error);
        });
    },
    getUserCards() {
      this.cards = [];
      this.initialLoading = true;
      var url = "/api/get-user-cards";
      this.$api
        .get(url)
        .then((data) => {
          let cards = data.data.data;
          if (Array.isArray(cards) == true) {
            for (var key in cards) {
              this.cards.push(cards[key]);
            }
          } else {
            if (cards != null) {
              this.cards.push(cards);
            }
          }
          this.initialLoading = false;
        })
        .catch((error) => {
          this.initialLoading = false;
          console.log(error);
        });
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>

<style lang="scss" scoped></style>
