import {
    remote
} from 'electron'
import Vue from 'vue'

export default () => {
    var win = remote.getGlobal('share').win

    Vue.component('app-frame', {
        props: ['title'],
        template: `
            <div id="app-frame" class="teal">
                <div id="app-title">
                    {{ title }}
                </div>
                <v-btn :ripple="false" tile small text @click="winClose">
                    <v-icon>mdi-close</v-icon>
                </v-btn>                
                <v-btn :ripple="false" tile small text @click="winMinimize">
                    <v-icon>mdi-minus</v-icon>
                </v-btn>
            </div>
        `,
        methods: {
            winMinimize: function() {
                win.minimize()
            },
            winClose: function() {
                win.close()
            },
        }
    })

    Vue.component('div-example', {
        props: ['title', 'content'],
        data: function() {
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