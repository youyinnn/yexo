<template>
    <div id="window-scripts-innerWindow">
        <div id="no-web-resources-folder-path-set-show" v-if="!webResourcesFolderPathSet">
            <div class="c1 text-center">
                Please Set <v-chip color="cyan" small label>Web Resources' Folder Path</v-chip> First!
                <div class="my-2">
                    <v-btn tile small color="primary" @click="jumpToWindowSettings">Jump To Settings</v-btn>
                </div>
            </div>
        </div>
        <div id="web-resources-folder-path-set-show" v-else>
            <transition-group name="cselect-ctext-transit">
                <v-select v-if="cselect" dense class="headCategorySelect" key="cselect" :items="headCategory" hide-details label="Select A Head Category To Add The Script" solo item-text="label" item-value="value"></v-select>
                <v-text-field v-else dense class="headCategorySelect" key="ctext" label="Add A New Head Category For The Script" solo hide-details></v-text-field>
            </transition-group>
            <v-btn fab dark small color="pink" class="changeBtn" @click="cselect = !cselect">
                <v-icon>{{ upArrow }}</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
    import fs from 'fs'
    import path from 'path'
    import {
        mdiArrowUpBoldCircle
    } from '@mdi/js'

    export default {
        data: function() {
            return {
                webResourcesFolderPathSet: localStorage.getItem('webResourcesFolderPath') !== null,
                headCategory: [],
                upArrow: mdiArrowUpBoldCircle,
                cselect: true
            }
        },
        methods: {
            jumpToWindowSettings() {
                this.vueMap.get('app-side-drawer').switchWindow('settings')
            },
            analyseScriptFile() {
                let scriptText = fs.readFileSync(path.join(localStorage.getItem('webResourcesFolderPath'), 'scripts.md'), {
                    encoding: 'utf-8'
                })
                for (let mc of scriptText.match(/^##\s.*[\r|\n|\r\n]/gm)) {
                    this.headCategory.push({
                        value: mc,
                        label: mc.replace('## :star:', '')
                    })
                }
            }
        },
        mounted: function() {
            if (this.webResourcesFolderPathSet) {
                this.analyseScriptFile()
            }
        }
    }
</script>

<style scoped>
    #window-scripts-innerWindow {
        height: 100%;
        background-color: white;
        overflow: auto;
    }

    #no-web-resources-folder-path-set-show {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        user-select: none;
    }

    .c1 {
        width: 100%;
        align-self: center;
    }

    .headCategorySelect {
        position: absolute;
        padding: 10px;
        width: 92%;
    }

    .changeBtn {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .cselect-ctext-transit-enter-active {
        transition: all .8s;
        opacity: 0;
        transform: rotateX(90deg);
    }

    .cselect-ctext-transit-enter-to {
        transition: all .8s;
        opacity: 1;
        transform: rotateX(0deg);
    }

    .cselect-ctext-transit-leave-active {
        transition: all .3s;
        opacity: 0;
        transform: rotateX(90deg);
    }
</style>