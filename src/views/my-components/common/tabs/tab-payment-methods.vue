<template>
  <div>
    <h3 class="mb-4">{{ $t("view_titles.my_payment_methods") }}</h3>
    <div v-show="cards.length < 1 && !initialLoading">
      <message>
         {{ $t("message.no_payment_methods") }}
      </message>
    </div>
    <b-alert
      :show="dismissCountDown"
      dismissible
      variant="success"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      {{$t('message.card_added_successfully')}} {{ dismissCountDown }}
    </b-alert>
    <template v-if="initialLoading">
      <div class="row">
        <div class="col-12 col-md-6" v-for="n in 2" :key="n">
          <cardSkeleton />
        </div>
      </div>
    </template>
    <template v-if="cards.length > 0 && !isloading">
      <div class="row">
        <div class="col-12 col-md-6" v-for="c in cards" :key="c.id">
          <div class="card__item">
            <div class="number d-flex align-items-center">
              <div class="type mr-2">
                <icon v-if="c.card_type == 'VISA'" variant="visa" />
                <icon v-else variant="mc" />
              </div>
              {{ addStars(c.masked_card) }}
            </div>
            <div class="added">
              <span>{{ $t("labels.added") }}</span>
              {{ c.created_at | moment("calendar") }}
            </div>
            <div class="actions">
              <b-button
                variant="outline-danger"
                @click="showRemoveConfirmation(c.id)"
                size="sm"
              >
                {{ $t("buttons.delete") }}
              </b-button>
              <b-badge variant="success" class="ml-2" v-if="c.main == 1">{{
                $t("labels.main_label")
              }}</b-badge>
              <b-button
                v-if="c.main == 0"
                variant="outline-secondary"
                class="ml-2"
                @click="makeCardPrimary(c.id)"
                size="sm"
              >
                {{ $t("buttons.make_main") }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="number"></div>
    <div class="d-flex mt-2 justify-content-end">
      <b-button @click="goToUrl" id="card-link" class="d-none">get card</b-button>
      <b-button @click="getCheckoutUrl" variant="primary" size="xs">
        <icon variant="plus" color="#fff" class="mr-2" />
        {{ $t("buttons.add_card") }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { cardSkeleton } from "@/components/skeletons";
export default {
  data() {
    return {
      dismissSecs: 5,
      dismissCountDown: 0,
      initialLoading: false,
      card_added: false,
      isloading: false,
      url: "",
      cards: [],
    };
  },
  components: {
    cardSkeleton,
  },

  computed: {
    hasMethods() {
      var has = true;
      return has;
    },
    userCards() {
      var cards = [];
      if (this.cards && this.cards.length) {
        cards = this.cards;
      }

      return cards;
    },
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    addStars(number) {
      number = number.split("X");
      number = number.join("*");
      return number;
    },
    removeCard(id) {
      this.isloading = true;
      var url = "/api/user-card";
      this.$api
        .delete(url, {
          data: {
            card_id: id,
          },
        })
        .then((response) => {
          this.isloading = false;
          if (response.data.result == true || response.data.result == "true") {
            this.getUserCards();
          }

          if (response.data.result == false || response.data.result == "true") {
            this.showCardInUse();
          }
        })
        .catch((error) => {
          this.isloading = false;
          console.log(error);
        });
    },
    showCardInUse() {
      this.$bvModal
        .msgBoxOk(this.$t("warnings.unable_to_remove_card"), {
          title: this.$t("message.error"),
          size: "sm",
          buttonSize: "sm",
          okVariant: "warning",
          okTitle: "Ok",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value == true) {
            console.log(value);
          }
        })
        .catch((err) => {
          // An error occurred
          console.log(err);
        });
    },
    showRemoveConfirmation(id) {
      this.$bvModal
        .msgBoxConfirm(this.$t("warnings.remove_card_question"), {
          title: this.$t("labels.card_removal"),
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: this.$t("buttons.remove"),
          cancelTitle: this.$t("buttons.cancel"),
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value == true) {
            this.removeCard(id);
          }
        })
        .catch((err) => {
          // An error occurred
          console.log(err);
        });
    },
    makeCardPrimary(id) {
      this.isloading = true;
      var url = "/api/user-card-main";
      this.$api
        .post(url, {
          card_id: id,
        })
        .then((response) => {
          this.isloading = false;
          if (response.data.result == true || response.data.result == "true") {
            this.getUserCards();
          }
        })
        .catch((error) => {
          this.isloading = false;
          console.log(error);
        });
    },
    getCheckoutUrl() {
      var callback_url =
        window.location.protocol +
        "//" +
        window.location.host +
        "/my/payment-methods?added=test";
      var url = "/api/get-form-verification?callback_url=" + callback_url;
      this.$api
        .get(url)
        .then((data) => {
          this.url = data.data.data.checkout_url;
          this.$nextTick(()=>{
             this.fireClick();
          })
         
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fireClick(){
      var element = document.getElementById('card-link');
      element.click();
    },
    goToUrl(){
      window.open(this.url, "_blank");
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
    this.getUserCards();
    if (this.$route.query.added) {
      this.card_added = true;
      this.dismissCountDown = this.dismissSecs;
    }
  },
};
</script>

<style lang="scss" scoped>
.card {
    border-radius: 2.25rem;
  &__item {
    background: #fbfbfb;
    // background: #fff;
    box-shadow: 0px 2px 6px 0px rgba(#000, 0.1);
    border: 1px solid #e7e7e7;
        border-radius: 12px;
    margin-bottom: 20px;
    padding: 15px 8px;
    .type {
      svg {
        height: 32px;
        width: 32px;
      }
    }
    .added {
      margin-top: 12px;
      font-size: 14px;
      font-weight: 600;
      span {
        font-size: 13px;
        display: block;
        font-weight: 400;
      }
    }
    .number {
      padding: 3px 6px;
      background: lighten(#e7e7e7, 3%);
      font-size: 16px;
      font-weight: 600;
      color: #666;
    }
    .actions {
      margin-top: 5px;
      padding-top: 10px;
      border-top: 1px solid #e7e7e7;
    }
  }
}
</style>
