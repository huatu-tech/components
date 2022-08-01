import MScroll from './src/main.vue';

/* istanbul ignore next */
MScroll.install = function(Vue) {
  Vue.component(MScroll.name, MScroll);
};

export default MScroll;
