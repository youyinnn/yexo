<template>
    <v-combobox dark v-model="inputValues" :placeholder="ph" :readonly="readonly" :items="itemsForSelect" :search-input.sync="search" hide-selected :label="myLabel" multiple hide-details chips small-chips outlined :menu-props="{ maxHeight: 160, dark: true, contentClass: 'mc'}" @focus="setSelectingList(inputValues)" style="margin-bottom: 10px;">
        <template v-slot:no-data>
            <v-list-item dense>
                <v-list-item-content>
                    <v-list-item-title>
                        Press Enter to add a new <kbd>{{ target }}</kbd> "<strong>{{ search }}</strong>".
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </template>
        <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip :color="`${getColor(item)}`" text-color="white" label small style="max-width: 250px; display: inline-block;" class="text-truncate" :input-value="selected">
                {{ item }}
            </v-chip>
        </template>
        <template v-slot:item="{ item }">
            <v-chip :color="`${getColor(item)} darken-1`" text-color="white" label small>
                {{ item }}
            </v-chip>
        </template>
    </v-combobox>
</template>

<script>
    import {
        catesTree,
        findNode,
        tags,
        seriesMap
    } from '../plugins/artricles-data-extract'

    var seriesList = []

    export default {
        props: ['myLabel', 'originalValues', 'target', 'reset', 'readonly', 'dataCollector'],
        data: () => ({
            search: null,
            allCates: catesTree,
            inputValues: [],
            itemsForSelect: [],
            colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
            ph: `nothing here`
        }),
        watch: {
            inputValues: function(nv, ov) {
                if (nv !== null && nv !== undefined && ov !== null && ov !== undefined) {
                    if (this.target === 'cates') {
                        this.dataCollector.set('newArticleCates', nv)
                    } else if (this.target === 'tags') {
                        this.dataCollector.set('newArticleTags', nv)
                    } else if (this.target === 'series') {
                        this.dataCollector.set('newArticleSeries', nv)
                        if (nv.length > 1) {
                            this.$nextTick(() => {
                                this.inputValues.shift()
                            })
                        }
                    }
                    this.setSelectingList(nv)
                }
            },
            reset(nv) {
                this.inputValues = this.originalValues
            },
            originalValues(nv) {
                this.inputValues = nv
            },
        },
        mounted() {
            this.inputValues = this.originalValues
            seriesMap.forEach(function(value, key) {
                seriesList.push(key)
            })
        },
        methods: {
            getColor(name) {
                name = String(name)
                let number = 0
                for (let i = 0; i < name.length; i++) {
                    number += name.codePointAt(i)
                }
                return this.colors[number % this.colors.length]
            },
            setSelectingList(nv) {
                if (this.target === 'cates') {
                    let catesList = []
                    if (nv === null || nv.length === 0) {
                        catesTree.forEach((cateNode) => {
                            if (cateNode.parentNode === null) {
                                catesList.push(cateNode.name)
                            }
                        })
                    } else {
                        let lastCatesNode = findNode(nv[nv.length - 1])
                        if (lastCatesNode !== undefined) {
                            for (let i = 0; i < lastCatesNode.childNodes.length; i++) {
                                catesList.push(lastCatesNode.childNodes[i].name)
                            }
                        }
                    }
                    this.itemsForSelect = catesList
                } else if (this.target === 'tags') {
                    this.itemsForSelect = tags
                } else if (this.target === 'series') {
                    this.itemsForSelect = seriesList
                }
            },
        }
    }
</script>

<style scoped>
    .mc div {
        background-color: #414141 !important;
    }
</style>