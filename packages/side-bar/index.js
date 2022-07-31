
import SideBar from './src/main.vue';

/* istanbul ignore next */
SideBar.install = function(Vue) {
  Vue.component(SideBar.name, SideBar);
};

export default SideBar;
