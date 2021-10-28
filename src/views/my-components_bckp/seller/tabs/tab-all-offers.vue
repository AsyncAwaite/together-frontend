<template>
  <div>
    <h3 class="d-flex justify-content-between mb-4">
      {{ $t("view_titles.my_lots") }}

      <b-button size="sm" variant="primary" @click="checkIfUserHasCard">
        <icon variant="plus" color="#fff" class="mr-2" />Додати
      </b-button>
    </h3>
    <div class="my__item" v-for="item in items" :key="item.id">
      <div class="thumb">
        <router-link :to="{ name: 'product', params: { slug: item.slug } }">
          <div
            class="bg"
            :style="{ 'background-image': 'url(' + item.images_url[0] + ')' }"
          ></div>
        </router-link>
      </div>
      <div class="text">
        <router-link :to="{ name: 'product', params: { slug: item.slug } }">
          <h4>
            {{ item.title }}
          </h4>
        </router-link>
        <b-button
          variant="outline-danger"
          size="sm"
          @click="openRemoveingModal(item.id)"
        >
          Видалити
        </b-button>
      </div>
    </div>
    <b-modal id="product-removing-modal" hide-header hide-footer>
      <b-overlay
        id="overlay-remove-modal"
        :show="$apollo.loading"
        variant="white"
        opacity="0.8"
        spinner-variant="#f00"
        blur="none"
      >
        <h4>
          Видалити товар остаточно?
        </h4>
        <template slot:modal-footer>
          <div class="d-flex">
            <b-button @click="cancelRemove()">
              Cancel
            </b-button>
            <b-button @click="removeProduct">
              Confirm remove
            </b-button>
          </div>
        </template>
      </b-overlay>
    </b-modal>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  props: ["items"],
  dara() {
    return {
      product_to_remove_id: null,
    };
  },
  methods: {
    cancelRemove() {
      this.product_to_remove_id = null;
      this.$bvModal.hide("product-removing-modal");
    },
    openRemoveingModal(id) {
      this.product_to_remove_id = id;
      this.$bvModal.show("product-removing-modal");
    },
    addCardPopup() {
      this.$bvModal
        .msgBoxOk(
          this.$t('warnings.add_card_before_adding_a_lot'),
          {
            title: "Майже там!",
            size: "lg",
            buttonSize: "md",
            okVariant: "warning",
            okTitle: this.$t("view_titles.my_payment_methods"),
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          console.log(value);
          if (value == true) {
            this.$router.push({ name: "my", params: { tab: "payment-methods" } });
          }
        })
        .catch((error) => {
          // An error occurred
          console.log(error);
        });
    },
    checkIfUserHasCard() {
      // this.initialLoading = true;
      var url = "/api/get-user-cards";
      this.$api
        .get(url)
        .then((data) => {
          let cards = data.data.data;
          // console.log(cards);
          // this.addCardPopup();
          if (Array.isArray(cards) == true) {
            if (cards.length && cards.length > 0) {
              this.$router.push({ name: "addLot" });
            } else {
              this.addCardPopup();
            }
          } else {
            if (cards != null) {
              this.$router.push({ name: "addLot" });
            } else {
              this.addCardPopup();
            }
          }
          this.initialLoading = false;
        })
        .catch((error) => {
          this.initialLoading = false;
          console.log(error);
        });
    },
    removeProduct() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($id: ID!) {
              userProfileDeleteProduct(id: $id)
            }
          `,
          variables: {
            id: this.product_to_remove_id,
          },
        })
        .then((data) => {
          this.cancelRemove();
          this.$emit("update");
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.my__item {
  display: flex;
  margin-bottom: 20px;
  background: #f6f6f6;
  .text {
    padding: 20px;
  }
  .thumb {
    width: 200px;
    height: 160px;
    position: relative;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-position: center;
      background-size: cover;
    }
    img {
      max-width: 100%;
    }
  }
}
</style>
