<template>
    <div id="window-articles-innerWindow">
        <div id="no-articles-folders-path-set-show" v-if="!articlesFolderPathSet || (filteredArticles.length === 0 && !searching)">
            <div class="c1 text-center" v-if="!articlesFolderPathSet">
                Please Set Articles' Folder Path First!
                <div class="my-2">
                    <v-btn tile small color="primary" @click="jumpToWindowSettings">Jump To Settings</v-btn>
                </div>
            </div>
            <div class="c1 text-center" v-else-if="filteredArticles.length === 0">
                No Markdown File In Here!
                <div class="my-2">
                    <v-btn tile small color="primary" @click="jumpToWindowSettings">Choose Another Folder.</v-btn>
                </div>
            </div>
        </div>
        <div id="articles-folders-path-set-show" v-else>
            <div class="c1 text-center">
                <v-text-field class="articles-search-bar" v-model="searchText" label="Search Articles" :prepend-icon="search" hide-details outlined dense clearable @focus="() => { searching = true}" @blur="() => { searching = false}"></v-text-field>
                <v-list>
                    <transition-group name="article-list-transit">
                        <v-list-item dense v-for="article in filteredArticles" :key="article.metadata.title" two-line>
                            <v-card class="mx-auto article-card">
                                <v-card-text class="text-left">
                                    {{ article.metadata.title }}
                                </v-card-text>
                                <v-card-actions style="display: block; text-align: right">
                                    <v-btn small dark tile color="cyan" @click="openMd(article.metadata.title + '.md')">
                                        Open
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-list-item>
                    </transition-group>
                </v-list>
            </div>
        </div>
    </div>
</template>

<script>
    import fs from 'fs'
    import path from 'path'
    import execa from 'execa'
    import {
        mdiFileDocumentBoxSearchOutline
    } from '@mdi/js'
    import metadataExtractor, {
        extract
    } from '../plugins/artricles-data-extract'

    export default {
        data: function() {
            return {
                articlesFolderPathSet: localStorage.getItem('articlesFolderPath') !== null,
                filteredArticles: [],
                search: mdiFileDocumentBoxSearchOutline,
                searchText: '',
                searching: false,
                cacheUpdate: 0
            }
        },
        computed: {
            articlesCache: {
                get() {
                    if (this.articlesFolderPathSet) {
                        // add reactive dependence factor
                        (this.cacheUpdate);
                        let mdFiles = []
                        fs.readdirSync(localStorage.getItem('articlesFolderPath'), {
                            encoding: 'utf-8'
                        }).forEach(function(fileName, index, arr) {
                            if (fileName.endsWith('.md')) {
                                let mdText = fs.readFileSync(path.join(localStorage.getItem('articlesFolderPath'), fileName), {
                                    encoding: 'utf-8'
                                })
                                let extractRs = metadataExtractor.extract(mdText)
                                mdFiles.push(extractRs)
                            }
                        })
                        return mdFiles.sort((a, b) => {
                            return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
                        })
                    } else {
                        return []
                    }
                },
                set(dirfs) {
                    this.filteredArticles = dirfs.filter(fileName => {
                        return fileName.endsWith('.md')
                    })
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
            }
        },
        methods: {
            jumpToWindowSettings() {
                this.vueMap.get('app-side-drawer').switchWindow('settings')
            },
            openMd(fileName) {
                let mdpath = path.join(localStorage.getItem('articlesFolderPath'), fileName)
                execa(mdpath)
            },
            updateCache() {
                // trigger articlesCache's recomputation
                this.cacheUpdate++
            },
            resetFilteredArticles() {
                this.filteredArticles = this.articlesCache
            }
        },
        mounted: function() {
            this.resetFilteredArticles()
        }
    }
</script>

<style scoped>
    #window-articles-innerWindow {
        height: 100%;
        background-color: white;
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
    }

    .article-card {
        width: 100%;
        margin-bottom: 1rem;
        transition: all .3s;
    }

    .article-card:hover {
        background-color: whitesmoke;
    }

    .article-card:hover .v-card__text {
        color: rgb(59, 144, 255);
    }

    .articles-search-bar {
        background-color: white;
        width: 100%;
        padding: 10px;
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

</style>