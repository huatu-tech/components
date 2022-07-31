import UserFilter from './src/main.vue';

/* istanbul ignore next */
UserFilter.install = function(Vue) {
  Vue.component(UserFilter.name, UserFilter);
};

export default UserFilter;
