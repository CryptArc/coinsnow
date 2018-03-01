import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Crypto from '@/components/Crypto'

Vue.use(Router)

export default new Router({
      mode: 'history',
  routes: [
      {
            path: '/',
            name: 'home',
            component: Home
      },
      {
            path: '/cryptocurrency/:name',
            name: 'cryptocurrency',
            component: Crypto
      }
  ]
})
