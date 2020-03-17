<template>
    <v-container fluid>
        <v-combobox v-model="inputValues" :readonly="readonly" :items="itemsForSelect" :search-input.sync="search" hide-selected :label="myLabel" multiple hide-details small-chips outlined :menu-props="{ maxHeight: 200}">
            <template v-slot:no-data>
                <v-list-item dense>
                    <v-list-item-content>
                        <v-list-item-title>
                            No sub-category "<strong>{{ search }}</strong>" in current categories. Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <template v-slot:item="{ item }" >
                <v-chip dark label small>
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
        props: ['myLabel', 'originalValues', 'forCates', 'reset','readonly'],
        data: () => ({
            search: null,
            allCates: catesTree,
            inputValues: [],
            itemsForSelect: [],
            isForCates: false
        }),
        computed: {

        },
        watch: {
            inputValues: function(nv) {
                if (this.isForCates) {
                    let lastCatesNode = findNode(nv[nv.length - 1])
                    let catesList = []
                    for (let i = 0; i < lastCatesNode.childNodes.length; i++) {
                        catesList.push(lastCatesNode.childNodes[i].name)
                    }
                    this.itemsForSelect = catesList
                } else {
                    this.itemsForSelect = tags
                }
            },
            reset(nv) {
                this.inputValues = this.originalValues
            }
        },
        mounted() {
            this.inputValues = this.originalValues
            this.isForCates = this.forCates === 'true'
        },
        methods: {
            
        }
    }
</script>