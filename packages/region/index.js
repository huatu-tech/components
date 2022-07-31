import Region from './src/main.vue';

/* istanbul ignore next */
Region.install = function(Vue) {
  Vue.component(Region.name, Region);
};

export default Region;
