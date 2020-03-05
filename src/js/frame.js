import { remote } from 'electron'
import Vue from 'vue'

function frameInit() {
    var win = remote.getGlobal('share').win

    var appFrame = new Vue({
        el: '#app-frame',
        data: {
            title: 'Yexo',
            win: win
        },
        methods: {
            appClose: function () {
                this.win.close()
            },
            appMinimize: function () {
                this.win.minimize()
            }
        }
    })

    Vue.component('div-example', {
        props: ['title', 'content'],
        data: function () {
            return {
                xixi: 'haha',
                heihei: 'hoho'
            }
        },
        template: `
            <div :class="xixi">
                <h1>💖{{title}}</h1>
                <p>{{content}}</p>
                <p>{{heihei}}</p>
            </div>`
    })
    var contentFrame = new Vue({
        el: '#content-frame',
        data: {
            title: 'Yexo'
        },
        methods: {
            show: function () {
                console.log(123)
            }
        }
    })

}

export {
    frameInit
}