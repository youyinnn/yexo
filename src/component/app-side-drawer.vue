<template>
    <v-navigation-drawer id="app-side-drawer" dark width="170" absolute permanent :expand-on-hover="expandOnHover" @transitionend="transitionend">
        <v-list>
            <v-list-item-group v-model="selected" mandatory>
                <v-list-item v-for="item in items" :key="item.title" @click="switchWindow(item.title)" link>
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
        <template v-slot:append>
            <v-list-item class="action" style="margin-bottom: 8px;">
                <v-list-item-icon>
                    <v-icon>{{ actionIcon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-menu top nudge-top="35">
                        <template v-slot:activator="{ on }">
                            <v-btn small v-on="on" @focus="actionsBtnFocus" @blur="actionsBtnBlur">Actions</v-btn>
                        </template>
                        <v-list dark dense color="blue-grey darken-3">
                            <v-divider></v-divider>
                            <template v-for="(act, index) in actionMenu">
                                <v-list-item :key="index" @click="act.func" dense>
                                    <v-list-item-icon>
                                        <v-icon>{{ act.icon }}</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ act.title }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider v-if="index + 1 < items.length" :key="act.title"></v-divider>
                            </template>
                        </v-list>
                    </v-menu>
                </v-list-item-content>
            </v-list-item>
        </template>
    </v-navigation-drawer>
</template>

<script>
    import {
        mdiFileOutline,
        mdiScriptTextOutline,
        mdiClipboardListOutline,
        mdiAccountSupervisor,
        mdiAccountBadge,
        mdiGoogleDownasaur,
        mdiSettings,
        mdiArrowUpBoldHexagonOutline,
        mdiCloudUploadOutline,
        mdiFileSyncOutline,
        mdiHammer
    } from '@mdi/js'

    export default {
        data: () => ({
            expandOnHover: true,
            selected: 0,
            items: [{
                    title: 'Articles',
                    icon: mdiFileOutline,
                },
                {
                    title: 'Scripts',
                    icon: mdiScriptTextOutline,
                },
                {
                    title: 'Todos',
                    icon: mdiClipboardListOutline,
                },
                {
                    title: 'Friends',
                    icon: mdiAccountSupervisor,
                },
                // {
                //     title: 'Resumes',
                //     icon: mdiAccountBadge,
                // },                
                // {
                //     title: 'About',
                //     icon: mdiGoogleDownasaur,
                // },
                {
                    title: 'Settings',
                    icon: mdiSettings,
                }
            ],
            actionIcon: mdiArrowUpBoldHexagonOutline,
            actionMenu: [{
                    title: 'Push',
                    func() {
                        console.log(1)
                    },
                    icon: mdiCloudUploadOutline
                },
                {
                    title: 'To Markdown',
                    func() {
                        console.log(2)
                    },
                    icon: mdiFileSyncOutline
                },
                {
                    title: 'Check Settings',
                    func() {
                        console.log(3)
                    },
                    icon: mdiHammer
                },
            ]
        }),
        methods: {
            switchWindow(str) {
                this.$store.commit('switchWindow',
                    'window' + '-' + str.toLowerCase())
            },
            actionsBtnFocus() {
                console.log('focus')
                this.$data.expandOnHover = false
            },
            actionsBtnBlur() {
                console.log('blur')
                this.$data.expandOnHover = true
            },
            transitionend() {
                console.log('transitionend')
            }
        }
    }
</script>

<style scoped>
    #app-side-drawer>>>.v-application--is-ltr .v-list-item__action:first-child,
    .v-application--is-ltr .v-list-item__icon:first-child {
        margin-right: 16px;
    }
</style>