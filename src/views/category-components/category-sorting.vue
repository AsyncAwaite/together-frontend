<template>
  <div class="category__sorting">
    <b-dropdown class="d-block d-md-inline-block mb-4" :text="dropdownText" variant="outline-dark">
      <b-dropdown-item
        v-for="(option, i) in sortingOptions"
        :key="i"
        @click="emitSorting(i, option.params)"
        >{{ translateLabel(option.label) }}</b-dropdown-item
      >
    </b-dropdown>
  </div>
</template>

<script>
export default {
  props: ["orderBy"],
  data() {
    return {
      selectedIndex: 0,
      sortingOptions: [
        {
          label: "newest_first",
          params: {
            order: "DESC",
            columns: "CREATED_AT",
          },
        },
        {
          label: "older_first",
          params: {
            order: "ASC",
            columns: "CREATED_AT",
          },
        },
        {
          label: "more_views",
          params: {
            order: "DESC",
            columns: "VIEWS",
          },
        },
        {
          label: "less_views",
          params: {
            order: "ASC",
            columns: "VIEWS",
          },
        },
      ],
    };
  },
  computed:{
      dropdownText(){
          var text = ''
          text = this.sortingOptions[this.selectedIndex].label;
          return this.translateLabel(text);
      }
  },
  methods: {
    emitSorting(index, params) {
        this.selectedIndex = index;
        this.$emit('update', params);
    },
    translateLabel(label){
       label = 'buttons.'+label;
       return this.$t(label);

    }
  },
};
</script>

<style lang="scss" >
.category {
  &__sorting {
    .dropdown-toggle {
      background-color: rgb(214, 214, 214);
      border:none;
      display: block;
      min-width: 100%;
      color:#000;
    }
  }
}
</style>
