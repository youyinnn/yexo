<template>
    <v-navigation-drawer id="app-side-drawer" dark width="150" mini-variant absolute permanent>
        <v-list>
            <v-list-item-group v-model="selected" mandatory>
                <v-tooltip v-for="item in items" :key="item.title" right>
                    <span> {{ item.title }}</span>
                    <template v-slot:activator="{ on }">
                        <v-list-item @click="switchWindow(item.title)" link v-on="on" style="padding: 0; margin: 0">
                            <v-list-item-icon style="margin: 16px !important;">
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                    </template>
                </v-tooltip>
            </v-list-item-group>
        </v-list>
        <template v-slot:append>
            <v-list-item class="action" style="margin-bottom: 8px;">
                <v-list-item-content>
                    <v-menu id="actionsMenu" fixed top right nudge-top="-1" nudge-right="54" z-index="100" content-class="actionsMenuClass">
                        <template v-slot:activator="{ on }">
                            <v-btn tile v-on="on" style="min-width: initial;">
                                <v-icon> {{ actionIcon }} </v-icon>
                            </v-btn>
                        </template>
                        <v-list tile dark dense color="blue-grey darken-3">
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
                                <v-divider :key="act.title"></v-divider>
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
        mdiScriptTextOutline,
        mdiAccountSupervisor,
        mdiAccountBadge,
        mdiGoogleDownasaur,
        mdiSettings,
        mdiCloudUploadOutline,
        mdiFileSyncOutline,
        mdiHammer
    } from '@mdi/js'

    export default {
        data: function() {
            return {
                selected: 0,
                items: [{
                        title: 'Articles',
                        icon: mdiScriptTextOutline,
                    },
                    {
                        title: 'Settings',
                        icon: mdiSettings,
                    }
                ],
                actionIcon: mdiGoogleDownasaur,
                actionMenu: [{
                        title: 'Deploy GitPages',
                        func: this.push,
                        icon: mdiCloudUploadOutline
                    },
                    {
                        title: 'Build Markdown',
                        func: this.build,
                        icon: mdiHammer
                    },
                    {
                        title: 'Check Settings',
                        func: this.checkSettings,
                        icon: mdiFileSyncOutline
                    },
                ]
            }
        },
        methods: {
            switchWindow(str) {
                this.$store.commit('switchWindow',
                    'window' + '-' + str.toLowerCase())
                for (let i = 0; i < this.items.length; i++) {
                    let it = this.items[i]
                    if (it.title.toLowerCase() === str.toLowerCase()) {
                        this.selected = i
                        break
                    }
                }
            },
            push() {

            },
            build() {

            },
            checkSettings() {

            }
        },
        mounted: function() {}
    }
</script>

<style scoped>
    #app-side-drawer>>>.v-application--is-ltr .v-list-item__action:first-child,
    .v-application--is-ltr .v-list-item__icon:first-child {
        margin-right: 16px;
    }

    .actionsMenuClass,
    .actionsMenuClass .v-list {
        border-radius: 0 !important;
    }

    .action {
        padding: 0;
    }
</style>