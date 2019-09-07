import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 放数据
  state: {
    accountInfo: {
      photo: '',
      name: ''
    }
  },

  //放方法
  mutations: {
    changeUserInfo(state, value) {
      //把value这个对象的所有属性值，都赋值给state这个对象的所有属性值
      Object.assign(state.accountInfo, value)
    }
  }
})

export default store
