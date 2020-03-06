<template>
    <div id="app-frame" class="red lighten-1">
        <div id="app-title" style="color: #EEEEEE">
            {{ title }}
        </div>
        <v-btn color="blue darken-1" style="color: #EEEEEE" :ripple="false" tile small depressed @click="winClose">
            <v-icon>{{close}}</v-icon>
        </v-btn>
        <v-btn color="grey darken-3" style="color: #EEEEEE" :ripple="false" tile small depressed @click="winMinimize">
            <v-icon>{{minus}}</v-icon>
        </v-btn>
    </div>
</template>

<script>
    import {
        remote
    } from 'electron'

    import {
        mdiClose,
        mdiMinus
    } from '@mdi/js'

    var win = remote.getGlobal('share').win

    export default {
        props: ['title'],
        methods: {
            winMinimize: function() {
                win.minimize()
            },
            winClose: function() {
                win.close()
            },
        },
        data: () => ({
            close: mdiClose,
            minus: mdiMinus
        })
    }
</script>