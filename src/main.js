import Vue from 'vue';
import App from './App.vue';

import ElementUI from "element-ui";
import "./assets/css/element-variables.scss";
Vue.use(ElementUI)

import router from './router';
import store from './store';

import vuePrototype from './utils/vuePrototype'
Vue.use(vuePrototype,{store,router,ElementUI})

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
