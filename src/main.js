import Vue from 'vue'
import App from './App.vue'
// 状态组件
import Footer from '../packages/footer';
import LoadingBar from '../packages/loading-bar';
import ApproveFlow from '../packages/approve-flow';
import BackTop from '../packages/back-top';


const components = [Footer, ApproveFlow, BackTop];

// 使用组件
const install = function (Vue, opts = {}) {

  components.forEach((component) => {
    Vue.component(component.name, component);
  });

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };


  Vue.prototype.$loadingBar = LoadingBar

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

// Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app')
