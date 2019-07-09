import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import db from '../dataStore'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element, { size: 'small', zIndex: 3000 })

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.prototype.$db = db

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
