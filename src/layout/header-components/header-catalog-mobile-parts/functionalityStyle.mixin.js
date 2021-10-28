const functionalityStyle = {
  data() {
    return {
      style_wrapperStyle: {},
      style_wrapperActiveStyle: {},
      style_panelStyle: {},
      style_transitionStyle: {},
    };
  },
  mounted() {
    // const panelWidth = this.panelWidth;
    const menuSwitchSpeed = this.menuSwitchSpeed;

    const menuSwitchTransitionSecond = `.${menuSwitchSpeed / 10}s`;

    const wrapperStyle = {
      width: `400px`,
      "max-width": "100vw",
      position: `absolute`,
      zIndex: 99999,
      overflow: "hidden",
      height: "calc(100vh - 96px)",
    };

    const wrapperActiveStyle = {
      left: 0,
    };

    const panelStyle = {
      position: `absolute`,
      top: 0,
      zIndex: 99999,
      //   height: `100vh`,
      width: `100%`,
      backgroundColor: `#fff`,
    };

    const transitionStyle = {
      transition: `left ${menuSwitchTransitionSecond}`,
    };

    this.style_wrapperStyle = wrapperStyle;
    this.style_wrapperActiveStyle = wrapperActiveStyle;
    this.style_panelStyle = panelStyle;
    this.style_transitionStyle = transitionStyle;
  },
};

export default functionalityStyle;
