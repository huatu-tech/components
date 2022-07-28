import Vue from 'vue'
import App from './App.vue'
// 状态组件
let Footer = () => import("./components/Footer.vue");
const components = [Footer];
// 使用组件
const install = function (Vue, opts = {}) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};
/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
// 也可以按需引入
export default {
  version: "1.0.6",
  Footer,
  install,
};

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
