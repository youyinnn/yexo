import Vue from 'vue'

export default () => {

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

}