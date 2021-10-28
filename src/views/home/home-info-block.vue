<template>
  <div>
    <div class="home__stats mb-4 mt-4">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div
              class="title mb-4 text-center d-flex flex-column flex-md-row align-items-center justify-content-center"
            >
              {{$t('labels.already_purchased_with')}} <img src="@/assets/img/logo_dark.svg" alt="" />
            </div>
            <div class="d-flex w-100 justify-content-center">
              <div class="item p-4 mx-2 text-center">
                <div class="icon">
                  <img src="@/assets/img/customers_icon.svg" alt="" />
                </div>
                <div class="amount">
                  {{ stats.users }}
                </div>
                <div class="name">
                  {{ $t("labels.clients_with_us") }}
                </div>
              </div>
              <div class="item p-4 mx-2 text-center">
                <div class="icon">
                  <img src="@/assets/img/amount_icon.svg" alt="" />
                </div>
                <div class="amount">{{ stats.money }} $</div>
                <div class="name">
                  {{ $t("labels.total_sales") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home__benefits mb-4">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="item first">
              <div class="icon">
                <img src="@/assets/img/savings.svg" alt="" />
              </div>
              <div class="name">
               {{ $t("advantages.one_title") }}
              </div>
              <p>
                {{ $t("advantages.one_description") }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="item second">
              <div class="icon">
                <img src="@/assets/img/big_choice.svg" alt="" />
              </div>
              <div class="name">
                {{ $t("advantages.two_title") }}
              </div>
              <p>
                {{ $t("advantages.two_description") }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="item last">
              <div class="icon">
                <img src="@/assets/img/community.svg" alt="" />
              </div>
              <div class="name">
                {{ $t("advantages.three_title") }}
              </div>
              <p>
                {{ $t("advantages.three_description") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home__mail-us">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div
              class="d-flex py-4 my-4 flex-column flex-md-row align-items-center justify-content-center"
            >
              <h5>
                {{ $t("labels.still_have_questions") }}?
              </h5>
              <b-button href="mailto:support@together.biz.ua" variant="primary" class="mt-2 mt-md-0 ml-md-4 d-flex align-items-center justify-content-center">
                {{ $t("buttons.contact_us") }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      stats: "homeStats",
    }),
  },
};
</script>

<style lang="scss" scoped>
.home {
  &__mail-us {
    padding:80px 0px;
    h5 {
      font-weight: normal;
      font-size: 34px;
      margin-bottom: 0;
    }
  }
  &__benefits {
    .item {
      min-height: 30px;
      margin-bottom: 30px;
      padding: 30px 60px;
      .icon {
        margin-bottom: 20px;
        img {
          height: 42px;

        }
      }
      .name {
        font-weight: 800;
        font-size: 18px;
        border-bottom: 1px solid #fff;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }
      &.first {
        background: #03dac5;
        border-radius: 0px 100px 0px 0px;
      }
      &.second {
        background: #868888;
        border-radius: 0px 100px;
      }
      &.last {
        background: #2b2d2d;
        border-radius: 0px 0px 0px 100px;
        .name,
        p {
          color: #fff;
                }
        p {
  font-weight: 100;
        }
      }
    }
  }
  &__stats {
    padding: 40px 0px;
    background: linear-gradient(
      84.05deg,
      rgba(155, 80, 147, 0.4) -15.39%,
      rgba(27, 193, 161, 0.4) 40.22%,
      rgba(255, 255, 255, 0) 123.28%
    );
    border-radius: 94px 0px 100px;
    min-height: 100px;
    .item {
      .icon {
        margin-bottom: 20px;
      }
      .amount {
        font-weight: 600;
        font-size: 48px;
      }
      .name {
        font-weight: 800;
        font-size: 14px;
        color: #1bc1a1;
      }
    }
    .title {
      font-size: 48px;
      font-weight: 500;
      line-height: 1;
      img {
        height: 100px;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
