// my init
import init from './init'
init()

import Vue from 'vue'
import vuetify from '../plugins/vuetify' // path to vuetify export
import appFrame from 'component/app-frame.vue'
import appSideDrawer from 'component/app-side-drawer.vue'
import appMainWindowBox from 'component/app-main-window-box.vue'
import appWelcome from 'component/app-welcome.vue'

import Vuex from 'vuex'
import Toasted from 'vue-toasted';

Vue.use(Vuex)
Vue.use(Toasted)

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
    data: function() {
        return {
            vueMap: vueMap,
            mapKey: ''
        }
    },
    mounted: function() {
        this.vueMap.set(this.$el.id, this)
        this.mapKey = this.$el.id
    },
    methods: {
        toast(type, text, option) {
            let duration = 5000, closeable = false
            if (option !== undefined) {
                if (option.closeable !== undefined) {
                    closeable = option.closeable
                    if (closeable) {
                        duration = 0
                    }
                } else if (option.duration !== undefined) {
                    duration = option.duration
                }
            }
            let toastOption = {
                position: 'bottom-right',
                duration: duration,
                keepOnHover: true,
                className: 'my-toast',
                containerClass: 'my-toast-container',
                action: closeable ? {
                    text: 'CLOSE',
                    onClick: (e, toastObject) => {
                        toastObject.goAway(200);
                    }
                } : undefined,
            }
            switch (type){
                case 'info':
                    this.$toasted.info(text, toastOption)
                break
                case 'success':
                    this.$toasted.success(text, toastOption)
                break
                case 'error':
                    this.$toasted.error(text, toastOption)
                break
            }
        },
        infoToast(text, option) {
            this.toast('info', text, option)
        },
        successToast(text, option) {
            this.toast('success', text, option)
        },
        errorToast(text, option) {
            this.toast('error', text, option)
        }
    }
})

new Vue({
    vuetify,
    store,
    components: {
        'app-frame': appFrame,
        'app-side-drawer': appSideDrawer,
        'app-main-window-box': appMainWindowBox,
        'app-welcome': appWelcome,
    },
}).$mount('#app')


// Global Constant
process.env.APPNAME = 'Yexo'