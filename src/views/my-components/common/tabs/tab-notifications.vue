<template>
  <div>
    <h3>
      {{ $t("view_titles.my_notifications") }}
    </h3>
    <template v-if="!isloading && !notifications.length">
      <message>
        {{
          $t("labels.no_new_notifications")
        }}
      </message>
    </template>
    <template v-if="notifications && notifications.length > 0">
      <div
        class="notifications__item"
        :class="{
          danger: n.type == 0,
          success: n.type == 1,
          info: n.type == 2,
          unread: n.status == 0,
        }"
        v-for="(n, i) in notifications"
        :key="n.id + n.status"
      >
        <div class="msg">
          <div
            class="icon mr-2"
            :class="{
              danger: n.type == 0,
              success: n.type == 1,
              info: n.type == 2,
            }"
          >
            <icon variant="info" v-if="n.type == 2" color="#fff" />
            <icon variant="check" v-if="n.type == 1" color="#1bc1a1" />
            <icon variant="danger" v-if="n.type == 0" color="#fff" />
          </div>
          <span>
            {{ n.message }}
          </span>
          <div class="d-flex">
            <b-badge
              variant="primary"
              v-if="n.status == 0"
              size="xs"
              class="new-badge mr-2"
              >{{ $t("labels.new_notification") }}</b-badge
            >
            <div class="date">
              {{ n.date | moment("calendar") }}
            </div>
          </div>

          <div
            class="unread-marker"
            v-show="n.status == 0"
            @click="markAsRead(n.id, i)"
          >
            <icon variant="close" />
          </div>
        </div>
      </div>
      <b-pagination
        align="center"
        class="mt-4"
        v-show="!isloading && total / perPage > 1"
        first-number
        last-number
        v-model="currentPage"
        :total-rows="total"
        :per-page="perPage"
        :key="paginationKey"
        :limit="10"
        @change="fetchNotifications"
      ></b-pagination>
    </template>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { USER_ALL_NOTIFICATIONS } from "@/constants/graphql";
export default {
  data() {
    return {
      notifications: [],
      currentPage: 1,
      totalPages: 0,
      perPage: 18,
      totalFound: 0,
      total: 0,
      paginationKey: 999,
    };
  },
  methods: {
    fetchNotifications(page = 1) {
      this.isloading = true;
      if (!page) {
        page = 1;
      }
      this.$apollo
        .query({
          query: USER_ALL_NOTIFICATIONS,
          update: (data) => {
            return data.data.notifications;
          },
          fetchPolicy: "network",
          variables: {
            page: Number(page),
            count: this.perPage,
          },
        })
        .then((data) => {
          console.log(data);
          this.notifications = [];
          this.notifications = data.data.notifications;
          this.total = data.data.notifications[0].total;

          //Scroll to top
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          this.isloading = false;
          this.paginationKey++;
        })
        .catch((error) => {
          this.isloading = false;
          console.log(error);
        });
    },
    markAsRead(id, index) {
      var notification = {
        id: id,
        status: 1,
      };
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: [NotificationInput]!) {
              userChangeNotificationsStatus(input: $input)
            }
          `,
          variables: {
            input: [notification],
          },
        })
        .then((data) => {
          this.fetchNotifications(Number(this.currentPage));
          console.log(data, index);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.fetchNotifications();
  },
};
</script>

<style lang="scss" scoped>
.notifications {
  &__item {
    padding: 15px 10px;
    border-bottom: 1px solid rgba(#e7e7e7, 0.5);
    display: flex;
    align-items: center;
    .new-badge {
      font-weight: 600;
      font-size: 9px;
      text-transform: uppercase;
    }
    &:last-child {
      border-bottom: none;
    }
    &.unread {
      &:hover {
        background-color: rgba(#e7e7e7, 0.5);
        .unread-marker {
          opacity: 1 !important;
        }
      }
    }

    .msg {
      position: relative;
      font-size: 15px;
      padding-left: 46px;
      padding-right: 20px;
      flex-grow: 3;
      .unread-marker {
        display: block;
        width: 12px;
        height: 12px;
        position: absolute;
        right: 4px;
        top: 0px;
        opacity: 0;
        cursor: pointer;
        svg {
          fill: #666;
          height: 12px;
          width: 12px;
        }
      }

      .date {
        color: #464a53;
        font-size: 10px;
      }
      .icon {
        height: 32px;
        width: 32px;
        min-width: 32px;
        border-radius: 50%;
        background-color: #e7e7e7;
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          height: 16px;
          width: 16px;
          fill: #fff;
          opacity: 1;
        }
        &.success {
          background-color: rgba(#33de5f, 0.2);
          svg {
            fill: #1bc1a1;
          }
        }
        &.danger {
          background-color: rgba(#ff5645, 0.2);
          svg {
            fill: #ff5645;
          }
        }
        &.info {
          background-color: rgba(#34b8ea, 0.2);
          svg {
            fill: #34b8ea;
          }
        }
      }
    }
  }
}
</style>
