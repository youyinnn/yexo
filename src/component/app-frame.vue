<template>
    <div id="app-frame" class="grey darken-4">
        <div id="app-frame-title" style="color: #EEEEEE">
            <img :src="logo" class="logo"> <span>{{ title }}</span>
        </div>
        <v-btn class="frame-btn" color="blue darken-3" style="color: #EEEEEE" :ripple="false" tile small depressed @click="winClose">
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

    import logo from '../img/logo_256.png'

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
            minusIcon: mdiMinus,
            logo: logo
        })
    }
</script>

<style scoped>
    .logo {
        height: 30px;
        float: left;
        padding: 2px 0 4px;
        margin-right: 10px;
    }

    #app-frame-title span {
        color: whitesmoke;
        font-size: 13px;
        float: left;
    }
</style>