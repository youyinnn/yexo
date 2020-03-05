import { remote } from 'electron'
import Vue from 'vue'

export default () => {
    var win = remote.getGlobal('share').win

    Vue.component('app-frame', {
        props: ['title'],
        template: `
            <div id="app-frame">
                <div id="app-title">
                    {{ title }}
                </div>
                <v-btn class="ma-2" color="primary" small text>
                    <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-btn>
            </div>
        `
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
    // var contentFrame = new Vue({
    //     el: '#content-frame',
    //     data: {
    //         title: 'Yexo'
    //     },
    //     methods: {
    //         show: function () {
    //             console.log(123)
    //         }
    //     }
    // })

}