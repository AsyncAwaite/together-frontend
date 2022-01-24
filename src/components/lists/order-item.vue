<template>
  <div class="order-item d-flex flex-wrap">
    <div class="info">
      <div class="status mb-2 d-flex align-items-center">
        <div class="id mr-2">#{{ order.id }}</div>
        <b-badge v-if='order.type !== 2' :variant="badgeVariant(order.status)" class="mr-2">{{
          order.status 
        }}</b-badge>
            <b-badge :variant="badgeVariantOrderType( order.type)">{{
          orderTypeText(order.type)
        }}</b-badge>
      </div>
      <h5>
        <router-link  
          :to="{ name: 'product', params: { slug: order.product.slug } }"
        >
          {{ order.product.title }}
        </router-link>
      </h5>
      <div class="data flex-wrap">
        <div class="column d-flex flex-column">
          <div class="data-item">
            <span> {{ $t('labels.quantity') }}: </span> {{ order.count }} {{ $t("labels.pcs") }}
          </div>
          <div class="data-item">
            <span> {{ $t('labels.seller') }}: </span> {{ order.seller.name }}
          </div>
          <div class="data-item">
            <span> {{ $t('labels.created') }}: </span>
            {{ order.created_at | moment("DD MMMM  HH:mm") }}
          </div>
        </div>
        <div class="column d-flex flex-column">
          <div class="data-item">
            <span>
              {{ $t('labels.start_price') }}:
            </span>
            {{ order.start_price }} {{ $t("labels.uah") }}
          </div>
          <div class="data-item">
            <span>
              {{ $t('labels.final_price') }}:
            </span>
            <div v-if="order.last_price">
              {{ order.last_price }} {{ $t("labels.uah") }}
            </div>
            <div v-else>--</div>
          </div>
          <div class="data-item">
            <span> {{ $t('labels.start_total') }}:</span>{{ order.start_total }}
            {{ $t("labels.uah") }}
          </div>
          <div class="data-item">
            <span> {{ $t('labels.final_total') }}:</span>
            <div v-if="order.last_total">
              {{ order.last_total }} {{ $t("labels.uah") }}
            </div>
            <div v-else>--</div>
          </div>
        </div>
        <div class="column  delivery d-flex flex-column w-100">
          <div class="data-item">
            <span>
              {{ $t('labels.shipment') }}:
            </span>
            <div class="d-flex">
              <div class="mr-1" v-if="order.delivery_city">
                {{ order.delivery_city }},
              </div>
              <div v-if="order.delivery_region">
                {{ order.delivery_region }} обл.
              </div>
            </div>

            {{ order.delivery_warehouse }}
            <div v-if="!order.delivery_warehouse">--</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="thumb"
      :style="{ backgroundImage: 'url(' + order.product.images_url[0] + ')' }"
    >
      <router-link 
        :to="{ name: 'product', params: { slug: order.product.slug } }"
      >
      </router-link>
    </div>
    <div class="order-item__delivery w-100"></div>
    <div
      class="order-item__footer w-100 pt-2 d-flex justify-content-end align-items-center"
    >
      <b-button
        v-if="order && order.status == 'not_pay' && order.type !== 2"
        size="sm"
        variant="warning"
        @click="payOrder(order.id)"
      >
        {{ $t('buttons.pay_order') }}
      </b-button>
      <b-button
        variant="outline-secondary"
        class="ml-2"
        size="sm"
        @click="showTransactions = !showTransactions"
        >{{ $t('buttons.details') }}</b-button
      >
    </div>
    <b-collapse
      :id="'transactions-' + order.id"
      v-model="showTransactions"
      class="mt-2"
      v-if="order.transactions"
    >
      <template v-if="!Array.isArray(order.transactions)">
        <div class="transaction__item">
          {{ order.transactions.id }}
          {{ order.transactions.order_status }}
          {{ order.transactions.paymen_id }}
          {{ order.transactions.nsaked_card }}
          {{ order.transactions.order_time }}
          {{ order.transactions.amount }}
          {{ order.transactions.response_description }}
        </div>
      </template>
      <template v-else>
        <div v-for="t in order.transactions" :key="t">
          {{ t.id }}
          {{ t.order_status }}
          {{ t.paymen_id }}
          {{ t.nsaked_card }}
          {{ t.order_time }}
          {{ t.amount }}
          {{ t.response_description }}
        </div>
      </template>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: ["order"],
  data() {
    return {
      showTransactions: false,
      cards: [],
    };
  },
  methods: {
    payOrder(id) {
      this.$emit("pay", id);
    },
    badgeVariant(status) {
      var variant = "default";
      if (status == "payment") {
        variant = "success";
      }
      if (status == "not_pay") {
        variant = "warning";
      }
      return variant;
    },
       badgeVariantOrderType(type) {
      let variant = "primary";
      if (type == 1) {
        variant = "info";
      }
      if (type == 2) {
        variant = "dark";
      }
      return variant;
    },
    orderTypeText (type){
       let variant;
      switch (type) {
        case 0:
          variant = "групове замовлення";
          break;
        case 1:
          variant = "звичайне замовлення";
          break;
        case 2:
          variant = "замовлення в 1 клік";
          break;
      }
      return variant;
    }
  },
  mounted() {
    console.log(this.order)
  }
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
    max-width: calc(100% - 135px);
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
