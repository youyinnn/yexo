<template>
    <div id="window-articles-innerWindow">
        <div id="no-articles-folders-path-set-show" v-if="!articlesFolderPathSet">
            <div class="c1 text-center unselectable" v-if="!articlesFolderPathSet">
                <img :src="logo" ondragstart="return false;">
                <p>Please Set Articles' Folder Path First!</p>
                <div class="my-2">
                    <v-btn tile small color="primary" @click="jumpToWindowSettings">Jump To Settings</v-btn>
                </div>
            </div>
        </div>
        <div id="articles-folders-path-set-show" v-else>
            <div>
                <v-list style="background-color: #302f2f; padding: 8px 0 0;" dense>
                    <v-list-item dark dense>
                        <v-text-field class="articles-search-bar theme--dark" v-model="searchText" label="Search Articles" :prepend-icon="search" hide-details outlined dense clearable></v-text-field>
                    </v-list-item>
                </v-list>
                <transition-group name="article-list-transit">
                    <v-list v-if="filteredArticles.length > 0" style="background-color: #302f2f;" key="article-list">
                        <transition-group name="article-list-transit">
                            <v-list-item dark v-for="article in filteredArticles" :key="article.metadata.title" dense two-line>
                                <v-card class="mx-auto article-card" @click.stop="dialogOpen(article)">
                                    <v-card-text class="text-left">
                                        <div class="article-title-span text-truncate">{{ article.metadata.title }}</div>
                                        <div class="article-date-span">{{ dayjs.utc(article.metadata.date).format('YYYY-MM-DD HH:mm') }}</div>
                                    </v-card-text>
                                    <v-card-actions style="display: flex; height: 40px; padding: 0 10px 10px 10px">
                                        <v-btn v-if="article.gitStatus.icon !== null" small dark tile class="float-left git-status-btn" :class="article.gitStatus.class" @click.stop>
                                            <v-icon v-if="article.gitStatus.icon !== null" left> {{ article.gitStatus.icon }}</v-icon> {{ article.gitStatus.text }}
                                        </v-btn>
                                        <v-btn style="position: absolute; right: 10px;" x-small dark color="cyan darken-4" @click.stop="openMd(article.metadata.title + '.md')">
                                            Open
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-list-item>
                        </transition-group>
                    </v-list>
                    <div class="c1 text-center" v-else-if="ready && filteredArticles.length === 0" key="no-article-for-search">
                        <img :src="logo" ondragstart="return false;">
                        <p>No Articles for “{{ searchText }}”</p>
                    </div>
                </transition-group>
            </div>
            <v-btn fixed dark fab bottom small right color="green darken-2" @click.stop="openCreateArticleDialog">
                <v-icon> {{ addBtnIcon }}</v-icon>
            </v-btn>
            <v-dialog content-class="articleDialog" v-model="metadataUpdateDialog" persistent dark overlay-opacity="0.7" overlay-color="grey darken-3" :transition="$store.state.dialogTransition">
                <v-card>
                    <v-card-title>Update Article's Metadata</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-text-field label="Title" placeholder="Title" v-model="editingArticleTitle" outlined hide-details style="margin-bottom: 10px;"></v-text-field>
                        <combobox-chips :dataCollector="metadataUpdateCollector" :readonly="!metadataUpdateDialog" :reset="resetDialog" myLabel="Series" target="series" :originalValues="editingArticleSeries"></combobox-chips>
                        <combobox-chips :dataCollector="metadataUpdateCollector" :readonly="!metadataUpdateDialog" :reset="resetDialog" myLabel="Categories" target="cates" :originalValues="editingArticleCates"></combobox-chips>
                        <combobox-chips :dataCollector="metadataUpdateCollector" :readonly="!metadataUpdateDialog" :reset="resetDialog" myLabel="Tags" target="tags" :originalValues="editingArticleTags"></combobox-chips>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue lighten-1" small text dark @click="metadataUpdateDialog = false; updateMetadata()" :disabled="!metadataUpdateDialog">
                            Confirm
                        </v-btn>
                        <v-btn color="grey" small text dark @click="metadataUpdateDialog = false; cancelUpdatingMetadata()" :disabled="!metadataUpdateDialog">
                            Cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog content-class="articleDialog" v-model="createArticleDialog" persistent dark overlay-opacity="0.7" overlay-color="grey darken-3" :transition="$store.state.dialogTransition">
                <v-card>
                    <v-card-title>Create a new article</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-text-field label="Title" placeholder="Title" v-model="editingArticleTitle" outlined hide-details style="margin-bottom: 10px;"></v-text-field>
                        <combobox-chips :dataCollector="metadataUpdateCollector" :readonly="!createArticleDialog" :reset="resetDialog" myLabel="Series" target="series" :originalValues="editingArticleSeries"></combobox-chips>
                        <combobox-chips :dataCollector="metadataUpdateCollector" :readonly="!createArticleDialog" :reset="resetDialog" myLabel="Categories" target="cates" :originalValues="editingArticleCates"></combobox-chips>
                        <combobox-chips :dataCollector="metadataUpdateCollector" :readonly="!createArticleDialog" :reset="resetDialog" myLabel="Tags" target="tags" :originalValues="editingArticleTags"></combobox-chips>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue lighten-1" small text dark @click="createArticleDialog = false; createArticle()" :disabled="!createArticleDialog">
                            Confirm
                        </v-btn>
                        <v-btn color="grey" small text dark @click="createArticleDialog = false; resetCreateArticleDialog();" :disabled="!createArticleDialog">
                            Cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import fs from 'fs'
    import path from 'path'
    import execa from 'execa'
    import os from 'os'
    import {
        mdiFileDocumentBoxSearchOutline,
        mdiNewBox,
        mdiCircleEditOutline,
        mdiCreation,
        mdiRefresh,
        mdiPencilPlusOutline
    } from '@mdi/js'
    import metadataExtractor from '../plugins/artricles-data-extract'
    import comboboxChips from './combobox-chips.vue'
    import articleUpdater from '../plugins/article-updater'
    import logo from '../img/logo2_256.png'
    import utc from 'dayjs/plugin/utc'
    import dayjs from 'dayjs'
    dayjs.extend(utc)

    import git from 'simple-git/promise'
    async function status(workingDir) {

        let statusSummary = null;
        try {
            statusSummary = await git(workingDir).status();
        } catch (e) {
            // handle the error
        }
        return statusSummary;
    }

    export default {
        data: function() {
            return {
                articlesFolderPathSet: localStorage.getItem('articlesFolderPath') !== null,
                filteredArticles: [],
                ready: false,
                search: mdiFileDocumentBoxSearchOutline,
                searchText: '',
                cacheUpdate: 0,
                metadataUpdateDialog: false,
                editingArticle: null,
                editingArticleCates: [],
                editingArticleTags: [],
                editingArticleSeries: [],
                editingArticleTitle: '',
                resetDialog: 0,
                metadataUpdateCollector: new Map(),
                dayjs: dayjs,
                refreshBtnIcon: mdiRefresh,
                addBtnIcon: mdiPencilPlusOutline,
                createArticleDialog: false,
                logo: logo,
                setGitStatusCacheClear: 0
            }
        },
        computed: {
            articlesCache: {
                get() {
                    if (this.articlesFolderPathSet) {
                        // add reactive dependence factor
                        (this.cacheUpdate);
                        let mdFiles = []
                        let tz = this
                        fs.readdirSync(localStorage.getItem('articlesFolderPath'), {
                            encoding: 'utf-8'
                        }).forEach(function(whatever, index, arr) {
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
                                } else {
                                    tz.errorToast(`File ${String(whatever)}.md can not extract the metadata.`)
                                }
                            }
                        })
                        return mdFiles.sort((a, b) => {
                            return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
                        })
                    } else {
                        return []
                    }
                },
                set(val) {
                    this.filteredArticles = val
                }
            }
        },
        watch: {
            searchText(nv, ov) {
                if (nv !== '') {
                    this.filteredArticles = this.articlesCache.filter(cache => {
                        return cache.metadata.title.toLowerCase().search(nv.toLowerCase()) >= 0
                    })
                } else {
                    this.resetFilteredArticles()
                }
            },
            editingArticle(nv) {
                if (nv !== undefined && nv !== null) {
                    this.editingArticleCates = nv.metadata.categories
                    this.editingArticleTags = nv.metadata.tags
                    this.editingArticleTitle = nv.metadata.title
                    let a = []
                    if (nv.metadata.series !== undefined) {
                        a.push(nv.metadata.series)
                    }
                    this.editingArticleSeries = a
                } else {
                    this.editingArticleCates = []
                    this.editingArticleTags = []
                    this.editingArticleTitle = ''
                    this.editingArticleSeries = []
                }
            },
            resetDialog(nv) {
                let cache = this.editingArticle
                this.editingArticle = null
                this.editingArticle = cache
            },
            filteredArticles(nv) {
                this.setGitStatusCache()
                this.ready = true
            }
        },
        methods: {
            jumpToWindowSettings() {
                this.vueMap.get('app-side-drawer').switchWindow('settings')
            },
            openMd(fileName) {
                let mdpath = path.join(localStorage.getItem('articlesFolderPath'), fileName)
                if (os.type() == 'Windows_NT') {
                    //windows
                    execa(mdpath)
                } else if (os.type() == 'Darwin') {
                    // mac
                    (async () => {
                        try {
                            const {
                                stdout
                            } = await execa('open', [mdpath])
                            if (stdout.trim().length !== 0) {
                                console.log(stdout)
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    })()
                } else if (os.type() == 'Linux') {
                    //Linux
                }
            },
            refreshArticleGitStatus() {
                this.updateCache()
                this.resetFilteredArticles(true)
            },
            updateCache() {
                // trigger articlesCache's recomputation
                this.cacheUpdate++
            },
            resetFilteredArticles(clearSearchText) {
                this.filteredArticles = this.articlesCache
                if (Boolean(clearSearchText)) {
                    this.searchText = ''
                }
            },
            dialogOpen(article) {
                this.metadataUpdateDialog = true;
                this.editingArticle = article
            },
            updateMetadata() {
                let newArticleCates = this.metadataUpdateCollector.get('newArticleCates')
                let newArticleTags = this.metadataUpdateCollector.get('newArticleTags')
                let newArticleTitle = this.editingArticleTitle
                let newArticleSeries = this.metadataUpdateCollector.get('newArticleSeries')
                let isTitleChanged = newArticleTitle !== this.editingArticle.metadata.title
                let isCatesChanged = newArticleCates !== undefined && newArticleCates.toString() !== this.editingArticle.metadata.categories.toString()
                let isTagsChanged = newArticleTags !== undefined && newArticleTags.toString() !== this.editingArticle.metadata.tags.toString()
                let isSeriesChanged = (this.editingArticle.metadata.series === undefined && newArticleTags !== undefined && newArticleSeries.length > 0) || (this.editingArticle.metadata.series !== undefined && newArticleTags !== undefined && newArticleSeries.toString() !== this.editingArticle.metadata.series.toString())
                if (isTitleChanged || isCatesChanged || isTagsChanged || isSeriesChanged) {
                    let data = {
                        newArticleCates: newArticleCates,
                        newArticleTags: newArticleTags,
                        newArticleTitle: newArticleTitle,
                        newArticleSeries: newArticleSeries,
                    }
                    articleUpdater.update(path.join(localStorage.getItem('articlesFolderPath'), this.editingArticle.metadata.title + '.md'), data)
                    this.updateCache()
                    this.infoToast(`Article "${this.editingArticleTitle}" has been updated`)
                    this.vueMap.get('window-base-git-status-innerWindow').updateStatus()
                } else {
                    this.infoToast('Nothing change')
                }
            },
            cancelUpdatingMetadata() {
                this.resetDialog++
                this.metadataUpdateCollector.clear()
            },
            setGitStatusCache() {
                clearTimeout(this.setGitStatusCacheClear)
                this.setGitStatusCacheClear = setTimeout(() => {
                    let tz = this
                    status(localStorage.getItem('articlesFolderPath')).then(status => {
                        tz.filteredArticles.forEach(atcs => {
                            atcs.gitStatus = tz.checkGitStatusForClass(status, atcs.metadata.title)
                        })
                    })
                }, 100)
            },
            checkGitStatusForClass(status, fileName) {
                if (status.modified.find(mo => {
                        return mo.includes(fileName)
                    })) {
                    return {
                        icon: mdiCircleEditOutline,
                        class: 'green',
                        text: 'modified'
                    }
                } else if (status.created.find(cre => {
                        return cre.includes(fileName)
                    })) {
                    return {
                        icon: mdiCreation,
                        class: 'cyan darken-1',
                        text: 'created'
                    }
                } else if (status.not_added.find(noa => {
                        return noa.includes(fileName)
                    })) {
                    return {
                        icon: mdiNewBox,
                        class: 'deep-orange',
                        text: 'not-added'
                    }
                }
                return {
                    icon: null,
                    class: null,
                    text: null
                }
            },
            openCreateArticleDialog() {
                this.createArticleDialog = true
                this.resetCreateArticleDialog()
            },
            resetCreateArticleDialog() {
                this.editingArticle = {
                    metadata: {
                        title: '',
                        categories: [],
                        tags: []
                    }
                }
            },
            createArticle() {
                let data = {
                    title: this.editingArticleTitle,
                    categories: this.metadataUpdateCollector.get('newArticleCates'),
                    tags: this.metadataUpdateCollector.get('newArticleTags'),
                    series: this.metadataUpdateCollector.get('newArticleSeries'),
                }
                articleUpdater.create(path.join(localStorage.getItem('articlesFolderPath'), `${data.title}.md`), data)
            }
        },
        mounted: function() {
            this.resetFilteredArticles()
        },
        components: {
            'combobox-chips': comboboxChips
        }
    }
</script>

<style scoped>
    #window-articles-innerWindow {
        height: 100%;
        background-color: #302f2f;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    #no-articles-folders-path-set-show {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        user-select: none;
    }

    #articles-folders-path-set-show {
        user-select: none;
    }

    .c1 {
        width: 100%;
        align-self: center;
        color: whitesmoke;
        position: fixed;
        top: 120px;
    }

    .article-card {
        width: 100%;
        margin-bottom: 1rem;
        transition: all .3s;
    }

    .article-card:hover {
        background-color: #252525;
        transform: scale(1.02);
    }

    .v-card__text {
        transition: all .3s;
    }

    .article-card:hover .v-card__text {
        color: rgb(59, 144, 255);
    }

    .articles-search-bar {
        background-color: #302f2f;
        width: 100%;
        padding: 10px 0;
    }

    .article-date-span {
        color: #4db18f;
        font-weight: bold;
    }

    .article-title-span {
        font-weight: bold;
    }

    .article-list-transit-enter-active {
        transition: all .8s;
        opacity: 0;
    }

    .article-list-transit-enter-to {
        transition: all .8s;
        opacity: 1;
    }

    .article-list-transit-leave-active {
        transition: all .3s;
        opacity: 0;
    }

    .git-status-btn {
        position: absolute;
        left: 0;
    }
</style>