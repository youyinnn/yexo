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
                <v-select v-if="cselect" v-model="selectHead" dense class="head-category-select" key="cselect" :items="headCategories" hide-details label="Head Category" item-text="label" item-value="value" :menu-props="{ bottom: true, nudgeBottom: 33 }">
                    <template v-slot:item="{ item }">
                        <div v-if="item.subCates !== undefined">
                            {{ item.label }}
                        </div>
                        <v-chip v-else :color="`grey darken-1`" text-color="white" label small>
                            {{ item.label }}
                        </v-chip>
                    </template>
                </v-select>
                <v-text-field v-else v-model="newHead" class="head-category-select" key="ctext" label="New Head Category" placeholder=" " hide-details clearable :clear-icon="arrowLeft" @click:clear.prevent="cselect = true; scselect = true"></v-text-field>
            </transition-group>
            <transition-group name="cselect-ctext-transit">
                <v-select v-if="scselect" v-model="selectSub" dense class="sub-category-select" key="scselect" :items="subCategories" hide-details label="Sub Category" item-text="label" item-value="value" :menu-props="{ bottom: true, nudgeBottom: 33 }">
                    <template v-slot:item="{ item }">
                        <div v-if="!String(item.content).startsWith('undefined')">
                            {{ item.label }}
                        </div>
                        <v-chip v-else :color="`grey darken-1`" text-color="white" label small>
                            {{ item.label }}
                        </v-chip>
                    </template>
                </v-select>
                <v-text-field v-else v-model="newSub" placeholder=" " class="sub-category-select" key="sctext" label="New Sub Category" hide-details :clearable="subClearable" :clear-icon="arrowLeft" @click:clear.prevent="scselect = true; selectSub = subCategories[1]"></v-text-field>
            </transition-group>
            <v-textarea v-model="editingScript" placeholder="  " class="script-textarea" outlined label="Script" row-height="20" rows="21" hide-details auto-grow no-resize></v-textarea>
        </div>
    </div>
</template>

<script>
    import fs from 'fs'
    import path from 'path'
    import {
        mdiArrowLeft
    } from '@mdi/js'

    export default {
        data: function() {
            return {
                webResourcesFolderPathSet: localStorage.getItem('webResourcesFolderPath') !== null,
                headCategories: [],
                subCategories: [],
                arrowLeft: mdiArrowLeft,
                cselect: true,
                scselect: true,
                selectHead: null,
                selectSub: null,
                newHead: ' ',
                newSub: ' ',
                subClearable: false,
                editingScript: ''
            }
        },
        watch: {
            selectHead(nv, ov) {
                if (String(nv) === '_new_head_') {
                    this.cselect = false
                    this.scselect = false
                    this.subClearable = false
                    this.selectHead = this.headCategories[1]
                } else if (ov !== null) {
                    let newSub = this.findHeadCateByValue(nv).subCates
                    this.subCategories = newSub
                    this.selectSub = newSub[1]
                }
            },
            selectSub(nv, ov) {
                if (String(nv) === '_new_sub_') {
                    this.scselect = false
                    this.selectSub = this.selectHead.subCates
                    this.subClearable = true
                } else if (ov !== null && String(ov) !== '_new_sub_') {
                    this.editingScript = this.findSubCateByValue(nv).content.trim()
                }
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
                this.headCategories.push({
                    value: '_new_head_',
                    label: 'Add New Head Category'
                })
                let nowHeadCatesIndex = 0
                let nowSubCatesIndex = 0
                for (let mc of scriptText.split(/[\r|\n|\r\n]/)) {
                    if (mc.search(/^##\s:star:(.*)/) === 0) {
                        mc = mc.match(/^##\s:star:(.*)/)
                        this.headCategories.push({
                            value: mc[0],
                            label: mc[1],
                            subCates: [{
                                value: '_new_sub_',
                                label: 'Add New Sub Category'
                            }]
                        })
                        nowHeadCatesIndex++
                        nowSubCatesIndex = 0
                    } else if (mc.search(/^###\s:speech_balloon:(.*)/) === 0) {
                        mc = mc.match(/^###\s:speech_balloon:(.*)/)
                        this.headCategories[nowHeadCatesIndex].subCates.push({
                            value: mc[0],
                            label: mc[1],
                            content: ''
                        })
                        nowSubCatesIndex++
                    } else if (this.headCategories[nowHeadCatesIndex].subCates[nowSubCatesIndex] !== undefined) {
                        this.headCategories[nowHeadCatesIndex].subCates[nowSubCatesIndex].content += mc + '\r'
                    }
                }
                this.selectHead = this.headCategories[1]
                this.selectSub = this.headCategories[1].subCates[1]
                this.subCategories = this.headCategories[1].subCates
                this.editingScript = this.selectSub.content.trim()
            },
            findHeadCateByValue(value) {
                if (value.value !== undefined) {
                    value = value.value
                }
                return this.headCategories.find(hc => {
                    return hc.value === value
                })
            },
            findSubCateByValue(value) {
                if (value.value !== undefined) {
                    value = value.value
                }
                return this.findHeadCateByValue(this.selectHead).subCates.find(hc => {
                    return hc.value === value
                })
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
        width: 99%;
        margin-top: 10px;
    }

    .sub-category-select {
        position: absolute;
        padding: 10px;
        width: 99%;
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