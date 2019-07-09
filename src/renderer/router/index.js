import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/views/index').default
    },
    {
      path: '/suspension',
      name: 'suspension',
      component: require('@/views/suspension').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
