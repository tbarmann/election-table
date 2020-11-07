import Vue from 'vue'
import App from './App.vue'

import vueNumeralFilterInstaller from 'vue-numeral-filter';
Vue.use(vueNumeralFilterInstaller, { locale: 'en-gb' });

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
