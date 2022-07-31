import Hamburger from './src/main.vue';

/* istanbul ignore next */
Hamburger.install = function(Vue) {
  Vue.component(Hamburger.name, Hamburger);
};

export default Hamburger;
