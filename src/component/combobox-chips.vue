<template>
    <v-container fluid>
        <v-combobox v-model="inputValues" :readonly="readonly" :items="itemsForSelect" :search-input.sync="search" hide-selected :label="myLabel" multiple hide-details small-chips outlined :menu-props="{ maxHeight: 200}" @focus="setSelectingList(inputValues)">
            <template v-slot:no-data>
                <v-list-item dense>
                    <v-list-item-content>
                        <v-list-item-title>
                            No sub-category "<strong>{{ search }}</strong>" in current categories. Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <template v-slot:selection="{ item }">
                <v-chip :color="`${getColor(item)} lighten-1`" text-color="white" label small>
                    {{ item }}
                </v-chip>
            </template>
            <template v-slot:item="{ item }">
                <v-chip :color="`${getColor(item)} darken-1`" text-color="white" label small>
                    {{ item }}
                </v-chip>
            </template>
        </v-combobox>
    </v-container>
</template>

<script>
    import {
        catesTree,
        findNode,
        tags
    } from '../plugins/artricles-data-extract'

    export default {
        props: ['myLabel', 'originalValues', 'forCates', 'reset', 'readonly', 'dataCollector'],
        data: () => ({
            search: null,
            allCates: catesTree,
            inputValues: [],
            itemsForSelect: [],
            isForCates: false,
            colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange']
        }),
        watch: {
            inputValues: function(nv, ov) {
                if (nv !== null && nv !== undefined && ov !== null && ov !== undefined) {
                    if (this.isForCates && nv.length !== 0 && ov.length > 0) {
                        this.dataCollector.set('newArticleCates', nv)
                    } else if (ov.length > 0) {
                        this.dataCollector.set('newArticleTags', nv)
                    }
                    this.setSelectingList(nv)
                }
            },
            reset(nv) {
                this.inputValues = this.originalValues
            },
            originalValues(nv) {
                this.inputValues = this.originalValues
            },
        },
        mounted() {
            this.inputValues = this.originalValues
            this.isForCates = this.forCates === 'true'
        },
        methods: {
            getColor(name) {
                let number = 0
                for (let i = 0; i < name.length; i++) {
                    number += name.codePointAt(i)
                }
                return this.colors[number % this.colors.length]
            },
            setSelectingList(nv) {
                if (this.isForCates) {
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
                } else {
                    this.itemsForSelect = tags
                }
            }
        }
    }
</script>