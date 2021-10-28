<template>
  <div>
    <b-dropdown id="dropdown-lang" :right="true" size="sm">
      <template #button-content
        ><icon :variant="$i18n.locale" class="mr-2" /><span
          class="d-none d-sm-inline"
          >{{ calcLangName($i18n.locale) }}</span
        ></template
      >
      <b-dropdown-item
        :active="$i18n.locale == l.id"
        v-for="l in languages"
        :key="l.id"
        @click="setLang(l.id)"
      >
        <icon :variant="l.id" class="mr-2" />
        <span>{{ l.name }}</span>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {

  data() {
    return {
      languages: [
        {
          id: "ua",
          name: "Укр",
        },
        {
          id: "en",
          name: "Eng",
        },
        {
          id: "ru",
          name: "Рус",
        },
      ],
    };
  },
  components: {},
  methods: {
    setLang(lang) {
      this.$i18n.locale = lang;

      this.$moment.locale(lang);
      if(lang == 'ua'){
         this.$moment.locale('uk');
      }

      window.localStorage.setItem("locale", lang);
    },
    calcLangName(id) {
      var name;
      for (var i = 0; i < this.languages.length; i++) {
        if (this.languages[i].id == id) {
          name = this.languages[i].name;
        }
      }
      return name;
    },
  },
};
</script>

<style lang="scss" scoped></style>
