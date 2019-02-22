import '@babel/polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';

import axios from 'axios';
import VueAxios from 'vue-axios';

import './plugins/vuetify';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueRouter);

Vue.use(VueAxios, axios);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
