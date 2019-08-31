import Vue from 'vue'
import App from './App.vue'

//导入路由文件 默认为index.vue
import router from './router'

//导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//导入基本样式表
import './assets/css/base.css'

//导入axios并添加到Vue原型中
import axios from 'axios'
Vue.prototype.$axios = axios

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
