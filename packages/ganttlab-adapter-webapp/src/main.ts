import moment from 'moment-timezone';
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import './assets/tailwind.css';

// set Moment.js locale and timezone
moment.locale(
  process.env.VUE_APP_MOMENTJS_LOCALE
    ? process.env.VUE_APP_MOMENTJS_LOCALE
    : window.navigator.language,
);
moment.tz.setDefault(
  process.env.VUE_APP_MOMENTJS_TIMEZONE
    ? process.env.VUE_APP_MOMENTJS_TIMEZONE
    : moment.tz.guess(),
);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
