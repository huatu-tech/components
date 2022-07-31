import Pager from './src/main.vue';

/* istanbul ignore next */
Pager.install = function(Vue) {
  Vue.component(Pager.name, Pager);
};

export default Pager;
