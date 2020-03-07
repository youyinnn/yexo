<template>
    <div id="app-frame" class="red lighten-1">
        <div id="app-frame-title" style="color: #EEEEEE">
            {{ title }}
        </div>
        <v-btn class="frame-btn" color="blue darken-1" style="color: #EEEEEE" :ripple="false" tile small depressed @click="winClose">
            <v-icon>{{closeIcon}}</v-icon>
        </v-btn>
        <v-btn class="frame-btn" color="grey darken-3" style="color: #EEEEEE" :ripple="false" tile small depressed @click="winMinimize">
            <v-icon>{{minusIcon}}</v-icon>
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
            closeIcon: mdiClose,
            minusIcon: mdiMinus
        })
    }
</script>