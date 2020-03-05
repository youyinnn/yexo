// my init
import init from './init'
init()

import Vue from 'vue'
import vuetify from '../plugins/vuetify' // path to vuetify export
import appFrame from 'component/app-frame.vue'

new Vue({
  vuetify,
  components: {
    'app-frame': appFrame
  }
}).$mount('#app')

// Global Constant
process.env.APPNAME = 'Yexo'
