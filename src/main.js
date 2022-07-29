import Vue from 'vue'
import App from './App.vue'
// 状态组件
import Footer from '../packages/footer/index.js';
const components = [Footer];
// 使用组件
const install = function (Vue, opts = {}) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };
};
/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
// 也可以按需引入
export default {
  version: "1.0.6",
  install,
  Footer,
};

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
