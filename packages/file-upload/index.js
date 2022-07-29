import FileUpload from './src/main.vue';

/* istanbul ignore next */
FileUpload.install = function(Vue) {
  Vue.component(FileUpload.name, FileUpload);
};

export default FileUpload;
