<template>
    <v-navigation-drawer id="app-side-drawer" color="teal lighten-1" width="150" mini-variant absolute permanent mini-variant-width="40">
        <v-list>
            <v-list-item-group v-model="selected" mandatory>
                <v-tooltip v-for="item in items" :key="item.title" right dark>
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
                    <v-menu id="actionsMenu" fixed top right nudge-top="-1" nudge-right="40" z-index="100" content-class="actionsMenuClass">
                        <template v-slot:activator="{ on }">
                            <v-btn tile dark v-on="on" style="min-width: initial; padding: 0;">
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
        <v-dialog persistent v-model="dialog" width="400" overlay-opacity="0.9" overlay-color="grey darken-3">
            <v-card dark class="unselectable">
                <v-card-title>
                    {{ dialogTitle }}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <span v-html="dialogCardText"></span>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" text @click="confirmAction()">
                        Yes
                    </v-btn>
                    <v-btn color="error" text @click="dialog = false;">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
        mdiHammer,
        mdiGithubFace,
        mdiUndoVariant
    } from '@mdi/js'
    import execa from 'execa'
    import git from 'simple-git'
    import gitP from 'simple-git/promise'
    import path from 'path'

    export default {
        data: function() {
            return {
                selected: 0,
                items: [{
                        title: 'Articles',
                        icon: mdiScriptTextOutline,
                    },
                    {
                        title: 'Base Git Status',
                        icon: mdiGithubFace,
                    },
                    {
                        title: 'Settings',
                        icon: mdiSettings,
                    }
                ],
                actionIcon: mdiGoogleDownasaur,
                actionMenu: [{
                        title: 'Deploy GitPages',
                        func: this.pushConfirmDialog,
                        icon: mdiCloudUploadOutline
                    },
                    {
                        title: 'Build Markdown',
                        func: this.buildConfirmDialog,
                        icon: mdiHammer
                    },
                    {
                        title: 'Discard Changes',
                        func: this.discardChangesDialog,
                        icon: mdiUndoVariant
                    },
                ],
                dialog: false,
                dialogTitle: '',
                dialogCardText: '',
                confirmAction: () => {}
            }
        },
        methods: {
            switchWindow(str) {
                str = str.replace(/ /g, '-')
                this.$store.commit('switchWindow',
                    'window' + '-' + str.toLowerCase())
                for (let i = 0; i < this.items.length; i++) {
                    let it = this.items[i]
                    if (it.title.toLowerCase().replace(/ /g, '-') === str.toLowerCase()) {
                        this.selected = i
                        break
                    }
                }
            },
            pushConfirmDialog() {
                this.confirmDialog('Action Confirm', 'Do you want to <code>push</code> changes?', this.push)
            },
            buildConfirmDialog() {
                this.confirmDialog('Action Confirm', 'Do you want to <code>build</code> a new site?', this.build)
            },
            discardChangesDialog() {
                this.confirmDialog('Action Confirm', 'Do you want to <code>discard</code> all changes?', this.discard)
            },
            confirmDialog(title, text, func) {
                this.dialog = true
                this.dialogTitle = title
                this.dialogCardText = text
                this.confirmAction = func
            },
            build() {
                let localRepoBasePath = localStorage.getItem('localRepoBasePath')
                let buildJsFilePath = localStorage.getItem('buildJsFilePath')
                if (localRepoBasePath !== null && buildJsFilePath !== null) {
                    let rs
                    try {
                        rs = execa.sync('node', [buildJsFilePath], {
                            preferLocal: true,
                            execPath: localRepoBasePath,
                            localDir: localRepoBasePath,
                        })
                        if (rs.failed) {
                            this.errorToast(`Build Faild`)
                        } else {
                            this.successToast(`Build Sueccess`)
                            this.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                        }
                    } catch (error) {
                        this.errorToast(`Build Faild`)
                    }
                } else {
                    this.errorToast(`Please Set LocalRepoBasePath And BuildJsFilePath First!`)
                }
                this.dialog = false
            },
            push() {
                if (localStorage.getItem('localRepoBasePath') !== null) {
                    let gitS = git(localStorage.getItem('localRepoBasePath'))
                    let status = gitS.status((err, status) => {
                        let allFiles = []
                        let pre = status.not_added.concat(status.modified, status.renamed, status.created)
                        pre.forEach(file => {
                            allFiles.push(path.join(localStorage.getItem('localRepoBasePath'), file.replace(/"|'/g, '')))
                        })
                        let now = new Date().toString()
                        gitS
                            .outputHandler((command, stdout, stderr) => {
                                stdout._events.data = (buffer) => {
                                    if (String(buffer).search('nothing to commit, working tree clean') > -1) {
                                        this.infoToast(String(buffer))
                                    } else {
                                        this.infoToast(`Commit From Texo At ${now}`)
                                    }
                                }
                                stderr._events.data = (buffer) => {
                                    if (String(buffer).search('up-to-date') === 0) {
                                        this.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                                    }
                                    this.infoToast(`[${command.toUpperCase()}]${String(buffer)}`)
                                    this.dialog = false
                                }
                            })
                            .add(allFiles)
                            .commit(`commit from yexo at ${now}`)
                            .push(['origin', 'master'])
                            .push(['gitee', 'master'])
                        this.vueMap.get('window-articles-innerWindow').refreshStatus()
                    })
                } else {
                    this.errorToast(`Please Set LocalRepoBasePath First!`)
                    this.dialog = false
                }
            },
            discard() {
                if (localStorage.getItem('localRepoBasePath') !== null) {
                    let gitSp = gitP(localStorage.getItem('localRepoBasePath'))
                    let rs = gitSp.checkout('.').then(() => {
                        gitSp.clean('f').then(() => {
                            this.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                            this.successToast(`Discard All Changes Success`)
                            this.vueMap.get('window-articles-innerWindow').refreshStatus()
                        })
                    })
                } else {
                    this.errorToast(`Please Set LocalRepoBasePath First!`)
                }
                this.dialog = false
            }
        },
        watch: {
            dialog(nv) {
                if (!nv) {
                    this.confirmAction = () => {}
                }
            }
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

    .action {
        padding: 0;
    }
</style>