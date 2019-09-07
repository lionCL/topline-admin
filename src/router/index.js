//路由导包
import Vue from 'vue'
import VueRouter from 'vue-router'
//用包
Vue.use(VueRouter)

//解决在此路由页面再次点击时报错 NavigationDuplicated
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//导入nprogress导航栏进度动画组件和样式
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//导入组件
import login from '../views/login'
import home from '../views/home'

import article from '../views/home/article'
import publish from '../views/publish/'
import comment from '../views/comment/'

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
        },
        {
          path: '/publish',
          component: publish
        },
        {
          path: '/publish/:id',
          component: publish,
          //路由也可以命名 判断是修改页面
          name: 'publish-edit'
        },
        {
          path: '/comment',
          component: comment,
          name: 'comment'
        }
      ]
    }
  ]
})

//创建一个全局路由守卫
router.beforeEach((to, from, next) => {
  //跳转路由时开启nprogress导航栏动画
  NProgress.start()
  next()
  // //用拦截器来验证登录,提高安全性.
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
  //   //是登录页直接放行
  //   next()
  // }
})

//全局后置钩子 进入到路由后
router.afterEach((to, from) => {
  //近到路由后 延时100ms结束进度条动画
  setTimeout(() => {
    NProgress.done()
  }, 200)
})

//暴露router
export default router
