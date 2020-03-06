// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(Vuetify)

export default new Vuetify({
    icons: {
        iconfont: 'mdiSvg',
    },
})