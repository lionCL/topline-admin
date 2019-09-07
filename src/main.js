import Vue from 'vue'
import App from './App.vue'

//导入抽取的路由文件 默认为index.vue
import router from './router'
//导入抽取的vuex文件
import store from './store'

//导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//导入基本样式表
import './assets/css/base.css'

//导入JSON-bigint插件
import JSONbig from 'json-bigint'

//导入axios并添加到Vue原型中
import axios from 'axios'
//设置基地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'

// `transformResponse` 在传递给 then/catch 前，允许修改响应数据 JSON.parse()
axios.defaults.transformResponse = [
  function(data) {
    // 对 data 进行任意转换处理   try-catch函数判断 如果数据有大数据需要处理运行try 没有报错的运行catch
    try {
      //数据如果能转换成功,就转换,并返回处理后的数据
      let obj = JSONbig.parse(data)
      return obj
    } catch (error) {
      //如果数据不能转换成功就,直接返回响应原始数据data
      return data
    }
  }
]

Vue.prototype.$axios = axios

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    //发送请求前 给请求加上token
    let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    //判断有用户信息的时候才添加token值
    if (userInfo) config.headers.Authorization = `Bearer ${userInfo.token}`
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    // 提示先登录//
    // 跳转到登录页面
    if (error.response.status == 401) {
      Vue.prototype.$message.error('token过期或错误,请重新登录')
      router.push('/login')
      return Promise.reject(error)
    }
  }
)

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  //挂载路由
  router,
  //挂载vuex
  store
}).$mount('#app')
