<template>
    <div id="app-frame" class="red lighten-1">
        <div id="app-title" style="color: #EEEEEE">
            {{ title }}
        </div>
        <v-btn color="teal lighten-1" style="color: #EEEEEE" :ripple="false" tile small depressed @click="winClose">
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn color="blue" style="color: #EEEEEE" :ripple="false" tile small depressed @click="winMinimize">
            <v-icon>mdi-minus</v-icon>
        </v-btn>
    </div>
</template>

<script>
    import {
        remote
    } from 'electron'

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
        }
    }
</script>