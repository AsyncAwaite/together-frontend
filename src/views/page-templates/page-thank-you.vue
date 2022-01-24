<template>
  <div class="container d-flex align-items-center justify-content-center h-100">
    <b-overlay
      :show="!isloading"
      variant="white"
      opacity="0.8"
      spinner-variant="#f00"
      blur="none"
      class="d-flex align-items-center"
    >
      <div v-if="isloading" class="order-item">
        <h1 class="text-center">{{ $t("message.thank_you") }}</h1>
        <b-card no-body class="overflow-hidden">
          <b-row no-gutters>
            <b-col md="4">
              <b-card-img
                :src="product.images_url[0]"
                alt="Image"
                class="rounded-0"
              ></b-card-img>
            </b-col>
            <b-col md="8">
              <b-card-body>
                <div class="protuct-info">
                  <div class="text-center title">
                    {{ $t("labels.order") }} №{{ order.id }}
                  </div>
                  <div class="title mb-4 text-center">
                    {{ this.product.title }}
                  </div>
                  <div class="data flex-wrap">
                    <div class="column d-flex flex-column">
                      <div class="data-item">
                        <span> {{ $t("labels.quantity") }}: </span>
                        {{ order.count }}
                        {{ $t("labels.pcs") }}
                      </div>
                    </div>
                    <div class="column d-flex flex-column">
                      <div class="data-item">
                        <span> {{ $t("labels.price") }}: </span>
                        {{ order.start_price }} {{ $t("labels.uah") }}
                      </div>
                    </div>
                  </div>
                  <template v-if="order.type !== 2">
                    <div class="data flex-wrap">
                      <div class="column d-flex flex-column">
                        <div class="data-item">
                          <span>
                            {{ $t("labels.purchased") }}
                          </span>
                          {{ order.created_at | moment("DD MMMM  HH:mm") }}
                        </div>
                      </div>
                      <div class="column d-flex flex-column">
                        <div class="data-item">
                          <span> {{ $t("labels.payment") }} </span>
                          <div class="d-flex">
                            <div class="mr-1" v-if="order.payment_type === 3">
                              {{ $t("labels.payment_department") }}
                            </div>
                            <div class="mr-1" v-else>
                              {{ $t("labels.payment_online") }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <div class="info">
                  <div class="data flex-wrap">
                    <div class="column d-flex flex-column">
                      <div class="data-item">
                        <span> {{ $t("labels.first_name") }}: </span>
                        {{
                          order.buyer_name !== "" ? order.buyer_name : user.name
                        }}
                      </div>
                    </div>
                    <div class="column d-flex flex-column">
                      <div class="data-item">
                        <span> {{ $t("labels.phone_number") }}: </span>
                        {{ order.buyer_phone }}
                      </div>
                    </div>
                  </div>
                </div>
                <template v-if="order.type !== 2">
                  <div class="column delivery d-flex flex-column w-100">
                    <div class="data-item">
                      <span> {{ $t("labels.shipment") }}: </span>
                      <div class="d-flex">
                        <div class="mr-1" v-if="this.$i18n.locale === 'ua'">
                          {{ city.title_ua }},
                          {{
                            warehouse.title_ua
                              ? warehouse.title_ua
                              : `вул. ${street.title_ua} кв. ${order.delivery_house} буд. ${order.delivery_room}`
                          }}
                          <br />
                        </div>
                        <div class="mr-1" v-else>
                          {{ city.title_ru }},
                          {{
                            warehouse.title_ru
                              ? warehouse.title_ru
                              : `ул. ${street.title_ru} кв. ${order.delivery_house} дом ${order.delivery_room}`
                          }}
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </div>
    </b-overlay>
  </div>
</template>



<script>
import { NP_REGIONS, NP_CITY, PRODUCTS_BY_IDS } from "@/constants/graphql";
import { mapGetters } from "vuex";
export default {
  // apollo: {
  //   regions: {
  //     query: NP_REGIONS,
  //     update: (data) => {
  //       return data.npRegions;
  //     },
  //   },
  // },
  data() {
    return {
      city: {},
      warehouse: {},
      // room: null,
      // house: null,
      // payment: null,
      // selectedRegion: null,
      // selectedCity: null,
      // selectedWarehouse: null,
      // selectedAdress: null,
      orderDownload: false,
      regionDownload: false,
      isloading: false,
      ids: [33, 35],
    };
  },
  computed: {
    ...mapGetters({
      events: "events",
    }),
  },

  methods: {
    async getOrder() {
      try {
        let id = window.location.search.replace("?id=", "");
        const response = await this.$api.get("/api/admin/orders/" + id);
        this.order = response.data.data;
        this.orderDownload = true;
        return this.order;
      } catch (err) {
        throw new Error(err);
      }
    },
    // async getProduct(id) {
    //   const response = await this.$api.get("/api/admin/products/" + id);
    //   this.product = response.data.data;

    //   return this.product;
    // },
    async getUser(id) {
      try {
        const response = await this.$api.get("/api/users/" + id);
        this.user = response.data.data;

        return this.user;
      } catch (e) {
        throw new Error(e);
      }
    },
    async getNpRegions() {
      try {
        const response = await this.$apollo.query({
          query: NP_REGIONS,
          update: (data) => {
            return data.npRegions;
          },
          fetchPolicy: "no-cache",
        });
        this.regions = response.data.npRegions;
        this.regionDownload = true;
        return this.regions;
      } catch (e) {
        throw new Error(e);
      }
    },
    async getProduct() {
      try {
        const response = await this.$apollo.query({
          query: PRODUCTS_BY_IDS,
          update: (data) => {
            return data.products;
          },
          variables: {
            ids: this.order.product_id,
          },
          fetchPolicy: "network",
        });
        this.product = response.data.products[0];
        return this.product;
      } catch (e) {
        throw new Error(e);
      }
    },
    async getNpCity(region) {
      const response = await this.$apollo.query({
        query: NP_CITY,
        update: (data) => {
          return data.city;
        },
        variables: {
          region_id: region,
        },
        fetchPolicy: "network",
      });

      this.citys = response.data.npCity;
      return this.citys;
    },

    getNoHash(arr, code) {
      let obj = {};
      if (arr) {
        arr.forEach((item) => {
          if (code === item.sync_code) {
            return (obj = item);
          }
        });
        return obj;
      }
      return obj;
    },
    dataLayer() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        currencyCode: "UAH",
        event: "transactionComplete",
        transactionId: this.order.id,
        transactionAffiliation: "together.biz.ua",
        transactionTotal: this.order.start_price,
        transactionTax: "1.29",
        transactionShipping: "5",
        transactionProducts: [
          {
            sku: this.order.product_id,
            name: this.product.title,
            category: this.product.catalog_id,
            price: this.order.start_price,
            quantity: this.order.count,
          },
        ],
      });
    },
    async getParams() {
      try {
        this.order = await this.getOrder();
        this.product = await this.getProduct();
        if (this.order.buyer_id !== 0) {
          this.user = await this.getUser(this.order.buyer_id);
        }
        if (this.order.type !== 2) {
          this.regions = await this.getNpRegions();
          this.region = this.getNoHash(
            this.regions,
            this.order.delivery_region
          );
          this.citys = await this.getNpCity(this.region.id);
          this.city = this.getNoHash(this.citys, this.order.delivery_city);
          this.warehouse = this.getNoHash(
            this.city.warehouses,
            this.order.delivery_warehouse
          );
          this.street = this.getNoHash(
            this.city.streets,
            this.order.delivery_street
          );
          this.dataLayer();
        }
        // this.getProductS();
        this.isloading = true;
      } catch (e) {
        throw new Error(e);
      }
    },
  },

  mounted() {
    this.getParams();
  },
};
</script>

<style lang="scss" scoped>
.order-item {
  .thumb {
    height: 120px;
    width: 120px;
    min-width: 120px;
    position: relative;
    a {
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
    }

    background-size: cover;
    border-radius: 8px;
    margin-right: 15px;
  }
  .info {
    flex-grow: 3;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  .data {
    display: flex;
    justify-content: space-between;
    min-width: 100%;
    flex-wrap: wrap;
    .column {
      padding-right: 25px;
      flex: 1;
      &.delivery {
        min-width: 100%;
        .data-item {
          font-weight: 600;
          font-size: 13px;
        }
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
  .data-item {
    margin-bottom: 12px;

    span {
      font-size: 10px;
      display: block;
      line-height: 1;
      font-weight: 400;
    }
    color: #000;
    font-size: 14px;
    font-weight: 600;
  }
}
</style>