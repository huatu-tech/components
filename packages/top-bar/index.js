
import TopBar from './src/main.vue';

/* istanbul ignore next */
TopBar.install = function(Vue) {
  Vue.component(TopBar.name, TopBar);
};

export default TopBar;
