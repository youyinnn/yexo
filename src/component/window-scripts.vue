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
                <v-select v-if="cselect" v-model="select" dense class="head-category-select" key="cselect" :items="headCategory" hide-details label="Head Category" item-text="label" item-value="value" :menu-props="{ bottom: true, nudgeBottom: 33 }"></v-select>
                <v-text-field v-else class="head-category-select" key="ctext" label="New Head Category" placeholder=" " hide-details></v-text-field>
            </transition-group>
            <v-text-field placeholder=" " class="sub-category-select" key="sctext" label="Sub Category" hide-details></v-text-field>
            <v-btn fab dark small color="success" class="add-btn">
                <v-icon>{{ plus }}</v-icon>
            </v-btn>
            <v-btn fab dark small color="blue" class="change-btn" @click="cselect = !cselect">
                <v-icon>{{ upArrow }}</v-icon>
            </v-btn>
            <v-textarea placeholder="  " class="script-textarea" outlined label="Script" row-height="20" rows="21" hide-details auto-grow no-resize></v-textarea>
        </div>
    </div>
</template>

<script>
    import fs from 'fs'
    import path from 'path'
    import {
        mdiArrowLeft,
        mdiPlus
    } from '@mdi/js'

    export default {
        data: function() {
            return {
                webResourcesFolderPathSet: localStorage.getItem('webResourcesFolderPath') !== null,
                headCategory: [],
                upArrow: mdiArrowLeft,
                plus: mdiPlus,
                cselect: true,
                select: null,
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
                this.select = this.headCategory[0]
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
        overflow-x: hidden;
        overflow-y: scroll;
    }

    #window-scripts-innerWindow::-webkit-scrollbar {
        width: 6px;
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

    .head-category-select {
        position: absolute;
        padding: 10px;
        width: 92%;
        margin-top: 10px;
    }

    .sub-category-select {
        position: absolute;
        padding: 10px;
        width: 92%;
        margin-top: 70px;
    }

    .script-textarea {
        position: absolute;
        width: 100%;
        padding: 10px 15px 10px 10px;
        margin-top: 120px;
    }

    .change-btn {
        position: absolute;
        right: 15px;
        top: 10px;
    }

    .add-btn {
        position: absolute;
        right: 15px;
        top: 70px;
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