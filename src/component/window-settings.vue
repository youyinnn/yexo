<template>
    <div id="window-settings-innerWindow">
        <v-card class="mx-auto mb-2" dark>
            <v-card-subtitle class="unselectable font-weight-black">
                Local Base Settings
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
                <v-row v-for="set in settings" :key="set.label" dense class="mt-2">
                    <v-col cols="10">
                        <v-text-field dense readonly hide-details placeholder=" " v-model="set.value" :label="set.label" @focus="showFullPath(set)" @blur="showShortPath(set)"></v-text-field>
                    </v-col>
                    <v-col cols="2" style="align-self:flex-end;">
                        <v-btn class="btn" depressed small @click="set.action(set)">
                            <v-icon>{{pathSelectIcon}}</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions style="display: block; text-align: right">
                <v-btn x-small depressed color="cyan accent-4" dark @click="saveGithubSettings">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-card class="mx-auto mb-2" dark>
            <v-card-subtitle class="unselectable font-weight-black">
                App Settings
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
                <v-row dense class="mt-2">
                    <v-col cols="12">
                        <v-select dense dark placeholder=" " hide-details v-model="dialogTransitionSelect" :items="dialogTransitionSelectList" label="Dialog Transition" :menu-props="{ maxHeight: 160, dark: true, dense: true, contentClass: 'mc', bottom: true, nudgeBottom: 37}"></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions style="display: block; text-align: right">
                <v-btn x-small depressed color="cyan accent-4" dark @click="saveAppSettings">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-row dense>
            <v-col v-for="rs in firstRowOfRs" :key="rs.title">
                <v-card v-if="rs.title !== 'undefined'" dark>
                    <v-card-text class="unselectable">
                        <div>{{ rs.title }}</div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions style="display: block; text-align: right">
                        <v-btn x-small dark color="blue-grey darken-1" @click="openRs(rs.fileName)">
                            Open
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col v-for="rs in secondRowOfRs" :key="rs.title">
                <v-card v-if="rs.title !== 'undefined'" dark>
                    <v-card-text class="unselectable">
                        <div>{{ rs.title }}</div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions style="display: block; text-align: right">
                        <v-btn x-small dark color="blue-grey darken-1" @click="openRs(rs.fileName)">
                            Open
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <div id="footer">
            {{ version }}
        </div>
    </div>
</template>

<script>
    import {
        remote
    } from 'electron'
    const dialog = remote.dialog
    import {
        mdiFolderTextOutline
    } from '@mdi/js'
    import path from 'path'
    import fs from 'fs'
    import metadataExtractor from '../plugins/artricles-data-extract'
    import execa from 'execa'
    import chokidar from 'chokidar'
    import packageJson from '../../package.json'

    var clear

    export default {
        data: function() {
            return {
                pathSelectIcon: mdiFolderTextOutline,
                settings: [{
                        key: 'localRepoBasePath',
                        label: 'Local Repo Base Path',
                        value: this.getPathForShow(localStorage.getItem('localRepoBasePath')),
                        action: this.selectFolder,
                        dialogTitle: 'Select Your Local Base Path',
                        path: localStorage.getItem('localRepoBasePath') === null ? 'Not Set' : localStorage.getItem('localRepoBasePath')
                    },
                    {
                        key: 'buildJsFilePath',
                        label: 'BuildJs File Path',
                        value: this.getPathForShow(localStorage.getItem('buildJsFilePath')),
                        action: this.selectFile,
                        dialogTitle: 'Select Your BuildJs File Path',
                        path: localStorage.getItem('buildJsFilePath') === null ? 'Not Set' : localStorage.getItem('buildJsFilePath')
                    }
                ],
                firstRowOfRs: [{
                    title: 'Scripts',
                    fileName: 'scripts.md'
                }, {
                    title: 'Todos',
                    fileName: 'todos.md'
                }, {
                    title: 'Resume',
                    fileName: 'resume.md'
                }],
                secondRowOfRs: [{
                    title: 'About',
                    fileName: 'about.md'
                }, {
                    title: 'FriendsLink',
                    fileName: 'friendslink.json'
                }, {
                    title: 'undefined'
                }],
                version: 'Yexo ' + packageJson.version,
                dialogTransitionSelectList: ['fade-transition', 'scroll-x-transition', 'scroll-y-transition'],
                dialogTransitionSelect: this.$store.state.dialogTransition
            }
        },
        methods: {
            getPathForShow(p) {
                if (p !== undefined && p !== null && p !== 'Not Set') {
                    return '..' + path.sep + path.basename(p)
                } else {
                    return ''
                }
            },
            findSet(key) {
                return this.settings.find((set) => {
                    return set.key === key
                })
            },
            selectFolder(set) {
                let pth = dialog.showOpenDialogSync({
                    title: set.dialogTitle,
                    properties: ['openDirectory'],
                })
                if (pth !== undefined) {
                    pth = pth[0]
                    set.value = this.getPathForShow(pth)
                    set.path = pth
                }
            },
            selectFile(set) {
                let pth = dialog.showOpenDialogSync({
                    title: set.dialogTitle,
                    properties: ['openFile'],
                })
                if (pth !== undefined) {
                    pth = pth[0]
                    set.value = this.getPathForShow(pth)
                    set.path = pth
                }
            },
            showFullPath(set) {
                set.value = set.path
            },
            showShortPath(set) {
                set.value = this.getPathForShow(set.path)
            },
            saveGithubSettings() {
                if (this.findSet('localRepoBasePath').path !== 'Not Set' && this.findSet('localRepoBasePath').path !== localStorage.getItem('localRepoBasePath')) {
                    localStorage.setItem('localRepoBasePath', this.findSet('localRepoBasePath').path)
                    localStorage.setItem('webResourcesFolderPath', path.join(localStorage.getItem('localRepoBasePath'), '_websrc'))
                    localStorage.setItem('articlesFolderPath', path.join(localStorage.getItem('localRepoBasePath'), '_posts'))
                    let windowArticlesInnerWindow = this.vueMap.get('window-articles-innerWindow')
                    windowArticlesInnerWindow.articlesFolderPathSet = true
                    this.infoToast('Articles\' Folder Path Has Been Updated')
                    let tz = this
                    fs.readdir(localStorage.getItem('articlesFolderPath'), {
                        encoding: 'utf-8'
                    }, function(err, files) {
                        let mdFiles = []
                        files.forEach(function(whatever, index, arr) {
                            if (String(whatever).endsWith('.md')) {
                                let mdText = fs.readFileSync(path.join(localStorage.getItem('articlesFolderPath'), String(whatever)), {
                                    encoding: 'utf-8'
                                })
                                let extractRs = metadataExtractor.extract(mdText)
                                if (extractRs !== undefined) {
                                    extractRs.gitStatus = {
                                        icon: null,
                                        class: null,
                                        text: null
                                    }
                                    if (extractRs !== undefined) {
                                        mdFiles.push(extractRs)
                                    }
                                }
                            }
                        })
                        windowArticlesInnerWindow.articlesCache = mdFiles.sort((a, b) => {
                            return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
                        })
                        tz.infoToast(`${mdFiles.length} Articles Has Been Loaded`)
                        tz.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                    })
                    this.setWatch()
                }
                if (this.findSet('buildJsFilePath').path !== 'Not Set' && this.findSet('buildJsFilePath').path !== localStorage.getItem('buildJsFilePath')) {
                    localStorage.setItem('buildJsFilePath', this.findSet('buildJsFilePath').path)
                }
                this.successToast('Local Base Settings Saved')
            },
            openRs(rs) {
                let rsp = localStorage.getItem('webResourcesFolderPath')
                if (rsp !== null) {
                    execa(path.join(rsp, rs))
                } else {
                    this.errorToast(`No Web Resources Folder Path Or No Such File`)
                }
            },
            setWatch() {
                const watcher = chokidar.watch(localStorage.getItem('localRepoBasePath'), {
                    ignored: [/node_modules/, /(^|[\/\\])\../], // ignore dotfiles
                    persistent: true,
                    ignoreInitial: true
                })
                let tz = this
                watcher.on('all', (event, path) => {
                    clearTimeout(clear)
                    clear = setTimeout(() => {
                        tz.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                        if (path.search('_posts') > -1 && path.endsWith('.md')) {
                            tz.vueMap.get('window-articles-innerWindow').refreshArticleGitStatus()
                        }
                    }, 200);
                })
            },
            saveAppSettings() {
                this.$store.commit('setDialogTransition', this.dialogTransitionSelect)
                this.successToast('App Settings Saved')
            }
        },
        mounted() {
            if (localStorage.getItem('localRepoBasePath') !== null) {
                this.setWatch()
            }
        }
    }
</script>

<style scoped>
    #window-settings-innerWindow>>>.btn {
        width: 100%;
        min-width: initial;
    }

    #window-settings-innerWindow {
        padding: 10px;
        overflow: auto;
        height: 100%;
    }

    #footer {
        user-select: none;
        margin-top: 10px;
        text-align: center;
        color: #888888;
        font-size: 12px;
    }

    .mc div {
        background-color: #353434 !important;
    }
</style>