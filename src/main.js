import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
// 状态组件
import Footer from '../packages/footer';
import LoadingBar from '../packages/loading-bar';
import ApproveFlow from '../packages/approve-flow';
import BackTop from '../packages/back-top';
import Breadcrumb from '../packages/breadcrumb';
import Calendar from '../packages/calendar';
import CircleProgress from '../packages/circle-progress';
import ContainerTitle from '../packages/container-title';
import Empty from '../packages/empty';
import FileUpload from '../packages/file-upload';
import GlobalNav from '../packages/global-nav';
import Hamburger from '../packages/hamburger';
import Node from '../packages/node';
import OperationLog from '../packages/operation-log';
import OrganizationFilter from '../packages/organization-filter';
import Pager from '../packages/pager';
import Region from '../packages/region';
import SideBar from '../packages/side-bar';
import TopBar from '../packages/top-bar';
import UserFilter from '../packages/user-filter';

Vue.use(ElementUI, { size: 'small' })

const components = [
  Footer, 
  ApproveFlow, 
  BackTop, 
  Breadcrumb, 
  Calendar, 
  CircleProgress, 
  ContainerTitle, 
  Empty, 
  FileUpload, 
  GlobalNav, 
  Hamburger, 
  Node,
  OperationLog,
  OrganizationFilter,
  Pager,
  Region,
  SideBar,
  TopBar,
  UserFilter,
];

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
  version: "1.0.5",
  install,
  Footer,
  ApproveFlow,
  BackTop,
  Breadcrumb, 
  Calendar, 
  CircleProgress, 
  ContainerTitle, 
  Empty, 
  FileUpload, 
  GlobalNav,
  Hamburger, 
  Node,
  OperationLog,
  OrganizationFilter,
  Pager,
  Region,
  SideBar,
  TopBar,
  UserFilter,
};

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

// Region component is a destructive modification of the original component.
// options get by vuex instead of props :  get by state.order.regionOptions
