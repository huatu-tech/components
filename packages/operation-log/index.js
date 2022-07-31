import OperationLog from './src/main.vue';

/* istanbul ignore next */
OperationLog.install = function(Vue) {
  Vue.component(OperationLog.name, OperationLog);
};

export default OperationLog;
