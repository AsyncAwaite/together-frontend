<template>
  <div class="header__notifications" v-click-outside="hide" >
    <b-button
      variant="light"
      @click="show = !show"
      size="sm"
      class="has_new"
      :class="{ show: show }"
    >
      <icon variant="notification" />
      <div class="count" v-if="unreadMessages && unreadMessages.length">
        {{ unreadMessages.length }}
      </div>
    </b-button>
    <div class="notifications__dropdown" :class="{ show: show }">
      <div class="bg">
        <div class="triangle"></div>
        <div class="notifications__title text-center">
          {{ $t("view_titles.my_notifications") }}
        </div>
        <template v-if="unreadMessages && unreadMessages.length > 0">
          <div
            class="notifications__item"
            :class="{ unread: n.status == 0 }"
            v-for="(n, i) in unreadMessages"
            :key="n.id"
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
                <icon variant="check" v-if="n.type == 1" color="#fff" />
                <icon variant="danger" v-if="n.type == 0" color="#fff" />
              </div>
              <span>
                {{ n.message }}
              </span>
              <div class="date">
                {{n.date | moment('calendar')}}
              </div>
              <div class="unread-marker" @click="markAsRead(n.id, i)">
                <icon variant="close" />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-new-messages">
            {{ $t("labels.no_new_notifications") }}
          </div>
        </template>
        <div class="all-link">
          <router-link :to="{ name: 'my', params: { tab: 'notifications' } }">
            {{ $t("labels.all_notifications") }}</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { USER_ALL_NOTIFICATIONS } from "@/constants/graphql";
import ClickOutside from 'vue-click-outside'

export default {
  apollo: {
    notifications: {
      query: USER_ALL_NOTIFICATIONS,
      update: (data) => {
        return data.notifications;
      },
      fetchPolicy: "network",
      pollInterval: 15000,
    },
  },

  directives: {
    ClickOutside
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    unreadMessages() {
      var messages = [];
      for (var key in this.notifications) {
        if (this.notifications[key].status == 0) {
          messages.push(this.notifications[key]);
        }
      }
      return messages;
    },
  },
  methods: {
    hide(){
      this.show = false;
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
          this.$apollo.queries.notifications.refetch();
          console.log(data, index);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.notifications {
  &__title {
    border-bottom: 1px solid rgba(#e7e7e7, 0.5);
    padding-bottom: 2px;
    font-size: 13px;
    color: #595c65;
  }
  &__item {
    padding: 15px 10px;
    border-bottom: 1px solid rgba(#e7e7e7, 0.5);
    display: flex;
    align-items: center;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: rgba(#e7e7e7, 0.5);
      .unread-marker {
        opacity: 1 !important;
      }
    }
    .msg {
      position: relative;
      font-size: 13px;
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
            fill: #33de5f;
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
  &__dropdown {
    width: 280px;
    visibility: hidden;
    opacity: 0;
    top: 100%;
    z-index: 999;
    .no-new-messages {
      padding: 20px 10px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .all-link {
      padding: 5px;
      border-top: 1px solid rgba(#e7e7e7, 0.5);
      a {
        display: block;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
      }
    }
    &.show {
      visibility: visible;
      opacity: 1;
      z-index: 10;
    }
    .bg {
      background: #fff;
      padding: 4px 0px 3px;
      border-radius: 6px;
      margin-top: 8px;
      box-shadow: 0px 3px 22px 0px rgba(#000, 0.3);
      position: relative;
      .triangle {
        width: 16px;
        height: 16px;
        background-color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        transform: translateX(-18px) rotate(45deg) translateY(-50%);
      }
    }
    z-index: 0;
    top: calc(100% - 1px);
    right: 0;
    position: absolute;
  }
}
.header__notifications {
  display: flex;
  align-items: center;
  margin-right: 4px;
  position: relative;
  svg {
    height: 28px;
    width: 28px;
    fill: #464a53;
    opacity: 0.5;
  }
  button {
    background: transparent;
    border: none;
    position: relative;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    @media (max-width: 768px) {
      height: 32px;
      width: 32px;
      padding: 0;
      svg {
        height: 22px;
        width: 22px;
      }
    }
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: rgba(#464a53, 0.1) !important;
    }
    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
    &:active,
    &.show {
      background: rgba(#464a53, 0.2) !important;
      border: none !important;
      box-shadow: none !important;
    }
    &.has_new {
      svg {
        opacity: 0.8;
      }
      .count {
        display: flex !important;
      }
    }
    .count {
      //   display: none;
      min-width: 20px;
      height: 20px;
      background: #f00;
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 50%;
      color: #fff;
      font-size: 12px !important;
      line-height: 1;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
