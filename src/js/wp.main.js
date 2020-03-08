// my init
import init from './init'
init()

import Vue from 'vue'
import vuetify from '../plugins/vuetify' // path to vuetify export
import appFrame from 'component/app-frame.vue'
import appSideDrawer from 'component/app-side-drawer.vue'
import appMainWindowBox from 'component/app-main-window-box.vue'
import statusBar from 'component/status-bar.vue'

import Vuex from 'vuex'

const store = new Vuex.Store({
    state: {
        currentWindow: 'window-articles'
    },
    mutations: {
        switchWindow(state, winStr) {
            state.currentWindow = winStr
        }
    }
})

const vueMap = new Map()

Vue.mixin({
    data: function () {
      return {
        __map: vueMap
      }
    },
    mounted: function() {
        this.$data.__map.set(this.$el.id, this)
    }
})

new Vue({
    vuetify,
    store,
    components: {
        'app-frame': appFrame,
        'app-side-drawer': appSideDrawer,
        'app-main-window-box': appMainWindowBox,
        'status-bar': statusBar
    }
}).$mount('#app')


// Global Constant
process.env.APPNAME = 'Yexo'