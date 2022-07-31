import Node from './src/main.vue';

/* istanbul ignore next */
Node.install = function(Vue) {
  Vue.component(Node.name, Node);
};

export default Node;
