// my init
import init from './init'
init()

import Vue from 'vue'
import vuetify from '../plugins/vuetify' // path to vuetify export
import appFrame from 'component/app-frame.vue'
import appSideDrawer from 'component/app-side-drawer.vue'
import appMainWindow from 'component/app-main-window.vue'

import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    currentWindow: 'window-articles'
  },
  mutations: {
    switchWindow (state, winStr) {
      console.log('store change', winStr)
      state.currentWindow = winStr
    }
  }
})

new Vue({
  vuetify,
  store,
  components: {
    'app-frame': appFrame,
    'app-side-drawer': appSideDrawer,
    'app-main-window': appMainWindow
  }
}).$mount('#app')


// Global Constant
process.env.APPNAME = 'Yexo'
