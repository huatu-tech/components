import GlobalNav from './src/main.vue';

/* istanbul ignore next */
GlobalNav.install = function(Vue) {
  Vue.component(GlobalNav.name, GlobalNav);
};

export default GlobalNav;
