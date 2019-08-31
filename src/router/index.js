//路由导包
import Vue from 'vue'
import VueRouter from 'vue-router'
//用包
Vue.use(VueRouter)

//导入组件
import login from '../views/login'
import home from '../views/home'

//创建路由实例并创建路由规则
const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'default',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: login
    },
    {
      path: '/home',
      name: 'Home',
      component: home
    }
  ]
})

//暴露router
export default router
