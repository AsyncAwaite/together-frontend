<template>
  <div class="product__list-card">
    <div
      class="thumb mb-3"
      :class="{ no_image:!product.images_url || !product.images_url[0] }"
      :style="{ 'background-image': 'url(' + thumb_url + ')' }"
    >
      <router-link :to="{ name: 'product', params: { slug: product.slug } }">
        <img v-if="product && product.images_url && product.images_url[0]" :src="product.images_url[0]"  alt="" />
        <div class="purchased-perrcentage">
          <span>{{ $t("labels.purchased") }}</span
          >{{ percentPurchased }} %
        </div>
      </router-link>
    </div>
    <router-link :to="{ name: 'product', params: { slug: product.slug } }">
      <h5>
        {{ trimProductName(product.title) }}
      </h5>
    </router-link>
    <div class="current-price">
      {{ $t("labels.current_price") }}
      <span class="d-none"
        >{{ currentPrice }} {{ $t("labels.uah") }}/{{ $t("labels.pcs") }}</span
      >
      <span
        >{{ product.actual_price }} {{ $t("labels.uah") }}/{{
          $t("labels.pcs")
        }}</span
      >
    </div>
    <div class="pirces-range">
      {{ getStartingPrice(product.prices) }} - {{ getSmallestPrice }}
      {{ $t("labels.uah") }}/{{ $t("labels.pcs") }}
    </div>
    <vue-countdown
      v-if="showTimer(dateEndInSecods)"
      :time="dateEndInSecods"
      v-slot="{ days, hours, minutes }"
    >
      <div class="time-remaining">
        <label for="" class="d-block mt-3 mb-0">
          До закінчення дії лоту：
        </label>
        <span> {{ days }} дні, {{ hours }} год. {{ minutes }} хв. </span>
      </div>
    </vue-countdown>
    <b-button
      @click="addToFavourites"
      variant="light"
      class="mr-2 mt-2 list-favourites"
      :disabled="$apollo.loading"
    >
      <span v-if="isFavourite">
        <icon variant="like-filled" color="#ffc108" />
      </span>
      <span v-else>
        <icon variant="like" color="#1bc1a1" />
      </span>
    </b-button>
  </div>
</template>

<script>
import gql from "graphql-tag";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    VueCountdown,
  },
  props: ["p"],
  data() {
    return {
      product: {},
      no_image: require("@/assets/img/no_image.png"),
    };
  },
  computed: {
    ...mapGetters({
      user: "sanctum/getUser",
    }),
    isFavourite() {
      var status = false;
      if (this.user) {
        var all_favourites = this.user.favourites;
      }
      var id = Number(this.product.id);

      if (all_favourites && all_favourites.includes(id)) {
        status = true;
      }
      return status;
    },
    percentPurchased() {
      var percent = 0;
      if (this.product.total_bought > 0) {
        percent = parseFloat(
          (this.product.total_bought / this.product.total) * 100
        ).toFixed(0);
      }
      return percent;
    },
    dateEndInSecods() {
      if (this.product && this.product.date_end) {
        var date = new Date(this.product.date_end);
        var now = new Date();
        var seconds = date - now;
      }
      return Number(seconds);
    },
    thumb_url() {
      var url = this.no_image;
      if (this.product.images_url && this.product.images_url[0]) {
        url = '';
      }
      return url;
    },
    currentPrice() {
      var price = 0;
      if (this.product && this.product.total_bought && this.product.prices) {
        var index = Number(this.product.prices.length) - 1;
        price = this.product.prices[index].price;
        var prices = this.product.prices;
        var total = Number(this.product.total_bought) + Number(this.qty);
        for (var key in prices) {
          if (total >= prices[key].min && total <= prices[key].max) {
            price = prices[key].price;
          } else if (total == prices[key].min && total == prices[key].max) {
            price = prices[key].price;
          }
        }
      }

      if (price == 0) {
        price = this.getStartingPrice(this.product.prices);
      }

      return price;
    },
    getSmallestPrice() {
      var minPrice = 0;
      if (this.product) {
        var prices = [];
        for (var key in this.product.prices) {
          prices.push(Number(this.product.prices[key].price));
        }
        // console.log(prices);
        minPrice = Math.min(...prices);
        // console.log(minPrice);
      }
      return minPrice;
    },
  },
  methods: {
    ...mapActions({
      fetchUser: "sanctum/fetchUser",
    }),
    trimProductName(name){
      let result = name;
      if(name && name.length > 60){
        result = name.substring(0, 60)+'...';
      }
      return result;
    },
    showTimer(endTime) {
      var now = new Date();
      now = now.getTime() / 1000;
      var show = true;

      if (now > endTime) {
        show = false;
      }

      return show;
    },
    getStartingPrice(prices) {
      var price = 0;
      for (var key in prices) {
        if (price < prices[key].price) {
          price = prices[key].price;
        }
      }

      return price;
    },
    addToFavourites() {
      if (this.user.id) {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($id: ID!) {
                productLikedOrDisLiked(id: $id)
              }
            `,
            variables: {
              id: this.product.id,
            },
          })
          .then((data) => {
            this.fetchUser();
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.$store.dispatch("switchToLogin");
        this.$bvModal.show("auth-modal");
      }
    },
  },
  created() {
    this.product["total_bought"] = 0;
    Object.assign(this.product, this.p);
  },
};
</script>

<style lang="scss" scoped>
.product {
  &__favourites {
    min-width: 64px;
    button {
      min-width: 64px;
      height: 32px !important;
      &:focus,
      &:active {
        outline: none !important;
        background: #f8f9fa !important;
        box-shadow: none !important;
        border-color: transparent;
      }
      svg {
        width: 28px;
        height: 28px;
      }
    }
    * {
      outline: none !important;
    }
  }
  &__list-card {
    margin-bottom: 30px;
    h5 {
      font-size: 16px;
    }
    .purchased-perrcentage {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 80px;
      height: 56px;
      background-color: #464a53;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top-left-radius: 36px;
      flex-direction: column;
      padding-left: 4px;
      padding-top: 4px;
      span {
        display: block;
        font-size: 8px;
        font-weight: 400;
        text-transform: uppercase;
        color: #fff;
      }
    }
    .time-remaining {
      font-size: 13px;
      label {
        color: #666;
      }
      span {
        color: #f60;
        font-weight: 600;
      }
    }
    .pirces-range {
      font-size: 13px;
    }
    .current-price {
      font-size: 13px;
      color: #666;
      span {
        display: block;
        font-size: 22px;
        font-weight: 600;
        color: #000;
      }
    }
    .thumb {
      height: 220px;
      background-size: contain;
      background-position: center;
      position: relative;
      background-repeat: no-repeat;
      &.no_image {
        background-size: 64px;
        background-color: lighten(#e7e7e7, 5%);
      }
      a {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          max-height: 90%;
          max-width: 90%;
          width: auto;
          height: auto;
        }
      }
    }
  }
}
</style>
