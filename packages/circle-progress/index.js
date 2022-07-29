import CircleProgress from './src/main.vue';

/* istanbul ignore next */
CircleProgress.install = function(Vue) {
  Vue.component(CircleProgress.name, CircleProgress);
};

export default CircleProgress;
