<template>
    <div id="app-side-drawer" class="teal lighten-1">
        <v-list color="teal lighten-1">
            <v-list-item-group v-model="selected" mandatory>
                <v-tooltip v-for="item in items" :key="item.title" right dark style="z-index: 300; position: absolute;">
                    <span> {{ item.title }}</span>
                    <template v-slot:activator="{ on }">
                        <v-list-item @click="switchWindow(item.title)" link v-on="on" style="padding: 0; margin: 0">
                            <v-list-item-icon style="margin: auto">
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                    </template>
                </v-tooltip>
            </v-list-item-group>
        </v-list>
        <v-list-item class="action" style="position: absolute;width: 40px;bottom: 0;" dense>
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
                                <v-list-item-icon style="margin-right: 16px">
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
        <v-dialog persistent v-model="dialog" width="400" overlay-opacity="0.7" overlay-color="grey darken-3" :transition="$store.state.dialogTransition">
            <v-card dark class="unselectable">
                <v-card-title>
                    {{ dialogTitle }}
                    <transition-group name="progress-transit">
                        <v-progress-circular key="progressInConfirm" v-show="showProgressInConfirm" indeterminate color="amber" class="ml-3" size="20"></v-progress-circular>
                    </transition-group>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <span v-html="dialogCardText"></span>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" text @click.stop="confirmAction()" :disabled="disabled">
                        Yes
                    </v-btn>
                    <v-btn color="error" text @click.stop="dialog = false;" :disabled="disabled">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
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
        mdiUndoVariant,
        mdiSourceCommit
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
                        title: 'Push To GitPages',
                        func: this.pushConfirmDialog,
                        icon: mdiCloudUploadOutline
                    },
                    {
                        title: 'Commit Changes',
                        func: this.commitConfirmDialog,
                        icon: mdiSourceCommit
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
                    {
                        title: 'Push Algolia Records',
                        func: this.pushAlgoliaRecordsDialog,
                        icon: mdiUndoVariant
                    },
                ],
                dialog: false,
                dialogTitle: '',
                dialogCardText: '',
                confirmAction: () => {},
                disabled: false,
                showProgressInConfirm: false,
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
                this.confirmDialog('Action Confirm', 'Do you want to <code>push</code> changes?', () => {
                    this.disabled = true
                    this.push()
                })
            },
            commitConfirmDialog() {
                this.confirmDialog('Action Confirm', 'Do you want to <code>commit</code> changes?', () => {
                    this.disabled = true
                    this.commit()
                })
            },
            buildConfirmDialog() {
                this.confirmDialog('Action Confirm', 'Do you want to <code>build</code> a new site?', () => {
                    this.disabled = true
                    this.build()
                })
            },
            discardChangesDialog() {
                this.confirmDialog('Action Confirm', 'Do you want to <code>discard</code> all changes?', () => {
                    this.disabled = true
                    this.discard()
                })
            },
            pushAlgoliaRecordsDialog() {
                this.confirmDialog('Action Confirm', 'Do you want to <code>push</code> all articles keywords to Algolia Search?', () => {
                    this.disabled = true
                    this.algolia()
                })
            },
            confirmDialog(title, text, func) {
                this.dialog = true
                this.dialogTitle = title
                this.dialogCardText = text
                this.confirmAction = func
            },
            build() {
                this.showProgressInConfirm = true
                let localRepoBasePath = localStorage.getItem('localRepoBasePath')
                let buildJsFilePath = localStorage.getItem('buildJsFilePath')
                if (localRepoBasePath !== null && buildJsFilePath !== null) {
                    (async () => {
                        try {
                            let rs
                            rs = await execa('node', [buildJsFilePath], {
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
                            this.dialog = false
                        } catch (error) {
                            this.errorToast(`Build Faild`)
                            console.error(error)
                            this.dialog = false
                        }
                    })()
                } else {
                    this.errorToast(`Please Set LocalRepoBasePath And BuildJsFilePath First!`)
                    this.dialog = false
                }
            },
            commit() {
                this.showProgressInConfirm = true
                if (localStorage.getItem('localRepoBasePath') !== null) {
                    let gitS = git(localStorage.getItem('localRepoBasePath'))
                    let status = gitS.status((err, status) => {
                        let allFiles = []
                        let pre = status.not_added.concat(status.modified, status.created, status.deleted)
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
                                        this.infoToast(`Commit From Yexo At ${now}`)
                                        this.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                                        this.vueMap.get('window-articles-innerWindow').refreshArticleGitStatus()
                                    }
                                    this.dialog = false
                                }
                                stderr._events.data = (buffer) => {
                                    this.infoToast(`[${command.toUpperCase()}]${String(buffer)}`)
                                    this.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                                    this.vueMap.get('window-articles-innerWindow').refreshArticleGitStatus()
                                    this.dialog = false
                                }
                            })
                            .add(allFiles, () => {
                                gitS.commit(`commit from yexo at ${now}`)
                            })
                    })
                } else {
                    this.errorToast(`Please Set LocalRepoBasePath First!`)
                    this.dialog = false
                }
            },
            push() {
                this.showProgressInConfirm = true
                let gitS = git(localStorage.getItem('localRepoBasePath'))
                let withHandler = gitS
                    .outputHandler((command, stdout, stderr) => {
                        stdout._events.data = (buffer) => {
                            this.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                            this.vueMap.get('window-articles-innerWindow').refreshArticleGitStatus()
                            this.infoToast(`[${command.toUpperCase()}]${String(buffer)}`)
                            this.dialog = false
                        }
                        stderr._events.data = (buffer) => {
                            this.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                            this.vueMap.get('window-articles-innerWindow').refreshArticleGitStatus()
                            this.infoToast(`[${command.toUpperCase()}]${String(buffer)}`)
                            this.dialog = false
                        }
                    });
                
                let remotes = localStorage.getItem('gitRemoteNames').split(',')
                for (let i = 0; i < remotes.length; i++) {
                    withHandler.push([remotes[i], 'master'])
                }
            },
            discard() {
                this.showProgressInConfirm = true
                if (localStorage.getItem('localRepoBasePath') !== null) {
                    let gitSp = gitP(localStorage.getItem('localRepoBasePath'))
                    let rs = gitSp.checkout('.').then(() => {
                        gitSp.clean('f').then(() => {
                            this.vueMap.get('window-articles-innerWindow').refreshArticleGitStatus()
                            this.successToast(`Discard All Changes Success`)
                            this.dialog = false
                        })
                    })
                } else {
                    this.errorToast(`Please Set LocalRepoBasePath First!`)
                    this.dialog = false
                }
            },
            algolia() {
                let algoliaHelperJsPath = localStorage.getItem('algoliaHelperJsPath')
                let localRepoBasePath = localStorage.getItem('localRepoBasePath')
                if (path.isAbsolute(algoliaHelperJsPath)) {
                    this.showProgressInConfirm = true;
                    (async () => {
                        try {
                            let rs
                            rs = await execa('node', [
                                algoliaHelperJsPath,
                                localStorage.getItem('algoliaAppId'),
                                localStorage.getItem('algoliaApiAdminKey'),
                                localStorage.getItem('algoliaAppIndex')
                            ], {
                                preferLocal: true,
                                execPath: localRepoBasePath,
                                localDir: localRepoBasePath,
                            })
                            if (rs.stdout === '') {
                                this.errorToast(`Push Algolia Records Faild`)
                                this.errorToast(JSON.parse(rs.stderr).error.name)
                                this.errorToast(JSON.parse(rs.stderr).error.message)
                            } else {
                                this.successToast(`Push Algolia Records Sueccess`)
                                this.successToast(`Push ${JSON.parse(rs.stdout).objectIDs.length} Records To Algolia`)
                            }
                            this.dialog = false
                        } catch (error) {
                            this.errorToast(`Push Algolia Records Faild`)
                            console.log(error)
                            this.dialog = false
                        }
                    })()
                } else {
                    this.dialog = false
                }
            }
        },
        watch: {
            dialog(nv) {
                if (!nv) {
                    this.confirmAction = () => {}
                    this.showProgressInConfirm = false
                }
                this.disabled = !nv
            }
        }
    }
</script>

<style scoped>
    #app-side-drawer {
        width: 40px;
        height: 100%;
    }

    .actionsMenuClass,
    .actionsMenuClass .v-list {
        border-radius: 0 !important;
    }

    .action {
        padding: 0;
    }

    .progress-transit-enter-active {
        transition: all .8s;
        opacity: 0;
    }

    .progress-transit-enter-to {
        transition: all .8s;
        opacity: 1;
    }

    .progress-transit-leave-active {
        transition: all .3s;
        opacity: 0;
    }
</style>