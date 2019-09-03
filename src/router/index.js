//路由导包
import Vue from 'vue'
import VueRouter from 'vue-router'
//用包
Vue.use(VueRouter)

//导入组件
import login from '../views/login'
import home from '../views/home'

import article from '../views/home/article'

//创建路由实例并创建路由规则
const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      //home的子路由
      children: [
        {
          path: '/article',
          component: article
        }
      ]
    }
  ]
})

//创建一个全局路由守卫
router.beforeEach((to, from, next) => {
  // if (to.path != '/login') {
  //   //判断是否登录过
  //   let res = window.sessionStorage.getItem('userInfo')
  //   if (res) {
  //     //有值说明登录过
  //     next()
  //   } else {
  //     //提示登录信息,因为这是路由实例 不是Vue实例 this一般只Vue实例
  //     //element-ui 信息 挂在到vue实例原型中
  //     Vue.prototype.$message.error('请先登录')
  //     //调回登录页
  //     next('/login')
  //   }
  // } else {
  //是登录页直接放行
  //   next()
  // }
  next()
})

//暴露router
export default router
