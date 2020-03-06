// my init
import init from './init'
init()

import Vue from 'vue'
import vuetify from '../plugins/vuetify' // path to vuetify export
import appFrame from 'component/app-frame.vue'
import appSideDrawer from 'component/app-side-drawer.vue'

new Vue({
  vuetify,
  components: {
    'app-frame': appFrame,
    'app-side-drawer': appSideDrawer
  }
}).$mount('#app')

// Global Constant
process.env.APPNAME = 'Yexo'
