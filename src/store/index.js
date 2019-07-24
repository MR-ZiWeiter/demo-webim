import Vue from 'vue'
import Vuex from 'vuex'
// 导入message模块
import message from './modules/message'
// 导入userInfo模块
import userInfo from './modules/userInfo'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  modules: {
    message,
    userInfo
  }
})
