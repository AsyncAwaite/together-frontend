<template>
  <div class="Menu" :class="{ animate: show }">
    <button @click="emitClose" class="drawer-btn d-flex align-items-center">
      <icon variant="close" class="mr-3" /> {{ $t("labels.catalogue") }}
    </button>
    <div
      class="Menu__panel-wrapper"
      :class="{ isActive: isActive }"
      :style="[style_wrapperStyle, isActive ? style_wrapperActiveStyle : {}]"
    >
      <!-- prev -->
      <MenuPanel
        :list="content_prevItem"
        :functionalityStyle="style_panelStyle"
        :positionStyle="panel_prevPositionStyle"
        :isTranslating="isTranslating"
        :transitionStyle="style_transitionStyle"
        :showHeaderArrow="prevItemHasParent"
      />

      <!-- staging -->
      <MenuPanel
        :list="content_currentItem"
        :functionalityStyle="style_panelStyle"
        :positionStyle="panel_stagingPositionStyle"
        :isTranslating="isTranslating"
        :transitionStyle="style_transitionStyle"
        :showHeaderArrow="currentItemHasParent"
        :handleHeaderClicked="clickPrevItem"
        :handleItemClicked="clickNextItem"
      />

      <!-- next -->
      <MenuPanel
        :list="content_nextItem"
        :functionalityStyle="style_panelStyle"
        :positionStyle="panel_nextPositionStyle"
        :isTranslating="isTranslating"
        :transitionStyle="style_transitionStyle"
        :showHeaderArrow="true"
      />
    </div>
  </div>
</template>

<script>
import demoData from "./header-catalog-mobile-parts/demo-data.js";

import functionalityStyle from "./header-catalog-mobile-parts/functionalityStyle.mixin";
import panelControl from "./header-catalog-mobile-parts/panelControl.mixin";
import contentControl from "./header-catalog-mobile-parts/contentControl.mixin";

import MenuPanel from "./header-catalog-mobile-parts/MenuPanel.vue";

export default {
  mixins: [functionalityStyle, panelControl, contentControl],
  components: {
    MenuPanel,
  },
  props: {
    source: {
      type: Object,
      default: () => demoData,
    },
    panelWidth: {
      type: Number,
      default: 400,
    },
    menuOpenSpeed: {
      type: Number,
      default: 350,
    },
    menuSwitchSpeed: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      show: false,
      isActive: false,
      isTranslating: false,
    };
  },
  mounted() {
    this.content_currentItem = this.source;
    this.show = true;
  },
  computed: {
    currentItemHasParent() {
      return this.content_parentStack.length >= 1;
    },
    prevItemHasParent() {
      return this.content_parentStack.length >= 2;
    },
  },
  watch: {
    list() {
      this.content_currentItem = this.source;
    },
  },
  methods: {
    emitClose() {
      this.$emit("close");
    },
    clickBurger() {
      this.isActive = !this.isActive;
    },
    clickShadow() {
      this.isActive = false;
    },
    clickNextItem(targetItem) {
      if (
        this.isTranslating ||
        !targetItem.children ||
        targetItem.children.length <= 0
      ) {
        return;
      }

      this.slideToNext(targetItem);
    },
    clickPrevItem() {
      if (this.isTranslating || !this.currentItemHasParent) {
        return;
      }

      this.slideToPrev();
    },

    /*
     * main part of core
     * definite of how to handle panel sliding and item updating
     */
    slideToNext(targetItem) {
      // set target item as content of next panel
      this.content_setNextItem(targetItem);

      // switch animation on
      this.setTranslating(true);

      // activate panel sliding with animation after `.translating` class has updated to panel dom.
      this.$nextTick(() => {
        this.panel_slideNext();
      });

      // reset panel position
      this.homingAfterTranslatingNext();
    },
    slideToPrev() {
      // set prev item which is the parent of the current item.
      this.content_setPrevItem();

      // switch animation on
      this.setTranslating(true);

      // activate panel sliding with animation after `.translating` class has updated to panel dom.
      this.$nextTick(() => {
        this.panel_slideBack();
      });

      // reset panel position
      this.homingAfterTranslatingBack();
    },

    // handle homing after slide animation end
    homingAfterTranslatingNext() {
      setTimeout(() => {
        // switch off transition state of panel
        this.setTranslating(false);

        // push current to parent stack
        this.content_pushCurrentToParentStack();

        // homing
        this.panel_homingPosition(); // reset panel position just like the beginning.
        this.content_homingItemAfterNext(); // change item between these panels to meet updated panel position.
      }, this.menuSwitchSpeed);
    },
    homingAfterTranslatingBack() {
      setTimeout(() => {
        this.setTranslating(false);

        // homing
        this.panel_homingPosition();
        this.content_homingItemAfterBack();
      }, this.menuSwitchSpeed);
    },

    // utils
    setTranslating(status) {
      this.isTranslating = status;
    },
  },
};
</script>
<style lang="scss" scoped>
.Menu {
  transform: translateX(-100%);
  transition: 0.3s;
  &.animate {
    transform: translateX(0%);
    transition: 0.3s;
  }
}
.drawer-btn {
  display: block;
  width: calc(100% - 10px);
  margin: 5px;
  appearance: none;
  background: none;
  border: none;
  text-align: left;
  height: 42px;
  padding: 0px 24px;
  border-radius: 4px;
  line-height: 1;
  transition: 0.3s;
  &:hover {
    background: rgba(#e7e7e7, 0.5);
    transition: 0.3s;
  }
}
</style>
