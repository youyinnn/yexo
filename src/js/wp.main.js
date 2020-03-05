// my init
import init from './init'
init()

import Vue from 'vue'
import vuetify from '../plugins/vuetify' // path to vuetify export

new Vue({
  vuetify,
}).$mount('#app')

// Global Constant
process.env.APPNAME = 'Yexo'
