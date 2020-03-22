<template>
    <v-navigation-drawer id="app-side-drawer" dark width="150" :mini-variant="mini" absolute permanent>
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
                    <v-menu id="actionsMenu" fixed top right nudge-top="50" nudge-right="40" z-index="100" content-class="actionsMenuClass">
                        <template v-slot:activator="{ on }">
                            <v-btn tile small v-on="on" @click="actionsBtnClick" @blur="actionsBtnBlur">Actions</v-btn>
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
        data: function() {
            return {
                mini: true,
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
            actionsBtnClick() {
                if (this.vueMap.get('actionsMenu').isActive) {
                    this.actionsBtnBlur()
                } else {
                    this.removeMouseLeaveEvent()
                }
            },
            actionsBtnBlur() {
                this.fold()
                this.addMouseLeaveEvent()
            },
            expand() {
                this.mini = false
            },
            fold() {
                this.mini = true
            },
            addMouseLeaveEvent() {
                this.$el.addEventListener('mouseleave', this.fold, true)
            },
            removeMouseLeaveEvent() {
                this.$el.removeEventListener('mouseleave', this.fold, true)
            },
            push() {

            },
            build() {

            },
            checkSettings() {

            }
        },
        mounted: function() {
            this.$el.addEventListener('mouseover', this.expand, true)
            this.addMouseLeaveEvent()
        }
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
</style>