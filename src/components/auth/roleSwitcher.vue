<template>
  <div class="role-toggle" @click="setUserRole(role)">
    <div class="ui-toggle" :class="{ seller: role == 'Seller' }">
      <div class="role-name" :class="{ active: role == 'Buyer' }">
        {{ $t("labels.role_buyer") }}
      </div>
      <div class="role-name" :class="{ active: role == 'Seller' }">
        {{ $t("labels.role_seller") }}
      </div>
      <span></span>
    </div>
    <b-modal
      :id="'modal-rolechange-terms-' + uid"
      scrollable
      no-close-on-backdrop
      hide-header
      hide-footer
      size="lg"
    >
      <h4 class="mt-3 pb-2">
        {{ termsToShow.title }}
      </h4>
      <div class="terms-content mt-2">
        <div v-html="termsToShow.html"></div>
      </div>
      <div class="d-flex w-100 flex-column mt-4">
        <b-form-checkbox
          id="checkbox-terms"
          v-model="terms"
          name="checkbox-terms"
          :value="true"
          :unchecked-value="false"
          switch
        >
          Ознайомлений та приймаю умови сервісу
        </b-form-checkbox>
        <b-button
          class="mt-4"
          :disabled="!terms || isLoading"
          variant="primary"
          block
          @click="confirmChangingRole"
        >
          Змінити роль
        </b-button>
        <b-button
          class="mt-2"
          :disabled="isLoading"
          variant="light"
          block
          @click="closeTermsModal()"
        >
          Скасувати
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["uid"],
  data() {
    return {
      newRole: null,
      isSeller: false,
      terms: false,
      isLoading: false,
      rolesLib: [
        {
          id: 2,
          name: "Seller",
        },
        {
          id: 3,
          name: "Buyer",
        },
      ],
    };
  },
  watch: {
    isSeller(oldVal, newVal) {
      if (newVal == true) {
        this.setUserRole("Buyer");
      } else {
        this.setUserRole("Seller");
      }
    },
  },
  computed: {
    ...mapGetters({
      role: "role",
      user: "sanctum/getUser",
      buyerTerms: "buyerTerms",
      sellerTerms: "sellerTerms",
    }),
    termsToShow() {
      var terms = "";
      var text = {
        html: "",
        title: "",
      };
      var newRole = this.newRole;
      if (newRole == "Seller") {
        terms = this.sellerTerms;
      } else {
        terms = this.buyerTerms;
      }

      var locale = this.$i18n.locale;
      for (var key in terms.translations) {
        if (terms.translations[key].locale == locale) {
          text.html = terms.translations[key].description;
          text.title = terms.translations[key].title;
        }
      }

      return text;
    },
  },
  methods: {
    nextRoleLabel(role) {
      var key = "labels.role_seller";
      if (role == "Seller") {
        key = "labels.role_buyer";
      } else {
        key = "labels.role_seller";
      }
      return this.$t(key);
    },
    nextRole(role) {
      if (role == "Seller") {
        return "Buyer";
      } else {
        return "Seller";
      }
    },
    checkIfHasNextRole(nextRole) {
      var roleAvailable = false;
      for (var i = 0; i < this.user.roles.length; i++) {
        var item = this.user.roles[i];
        if (item.name == nextRole) {
          roleAvailable = true;
        }
      }
      return roleAvailable;
    },
    setUserRole(role) {
      var nextRole;
      if (role == "Seller") {
        nextRole = "Buyer";
      } else {
        nextRole = "Seller";
      }
      this.newRole = nextRole;
      var roleAvailable = this.checkIfHasNextRole(nextRole);
      if (roleAvailable) {
        this.$store.dispatch("setCurrentUserRole", nextRole);
      } else {
        this.openTermsModal(nextRole);
      }
    },
    openTermsModal(nextRole) {
      console.log(nextRole);
      this.$bvModal.show("modal-rolechange-terms-" + this.uid);
    },
    confirmChangingRole() {
      //Calc next role id
      var id;
      for (var i = 0; i < this.rolesLib.length; i++) {
        if (this.rolesLib[i].name == this.newRole) {
          console.log(this.rolesLib[i]);
          id = this.rolesLib[i].id;
        }
      }
      console.log(id);
      this.addRoleOnBackend(id);
    },
    addRoleOnBackend(id) {
      this.isLoading = true;
      this.$api({
        method: "post",
        url: "/api/add-role",
        data: {
          role: id,
        },
      }).then(
        (response) => {
          this.isLoading = false;
          if (response.data.result == true) {
            setTimeout(() => {
              this.$store.dispatch("setCurrentUserRole", this.newRole);
              this.closeTermsModal();
              window.location.reload();
            }, 300);
          }
          console.log(response);
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
    },
    closeTermsModal() {
      this.$bvModal.hide("modal-rolechange-terms-" + this.uid);
    },
  },
  mounted() {
    //this.$bvModal.show("modal-rolechange-terms-" + this.uid);
  },
};
</script>

<style lang="scss" scoped>
.terms-content {
  height: 300px;
  overflow: scroll;
  background-color: lighten(#e7e7e7, 5%);
  padding: 10px;
  border: 1px solid #e7e7e7;
}
.role-toggle {
  padding: 10px 12px;
  display: block;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1;
  .ui-toggle {
    display: flex;
    background: #037bff;
    border-radius:6px;
    width: 200px;
    min-width: 40px;
    position: relative;
    height: 26px;
    transition: 0.3s;
    cursor: pointer;
    align-items: center;
    .role-name {
      color: #fff;
      min-width: 50%;
      text-align: center;
      position: relative;
      z-index: 3;
      line-height: 1;
      font-size: 12px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      &.active {
        color:#000;
      }
    }
    &.seller {
      background: #ffc105;
      transition: 0.3s;
      span {
        left: calc(50% - 2px);
        transition: 0.3s;
      }
    }
    span {
      position: absolute;
      height: 22px;
      width: 50%;
      border-radius: 4px;
      background: #fff;
      left: 2px;
      top: 2px;
      z-index: 1;
      transition: 0.3s;
    }
  }
}
</style>
