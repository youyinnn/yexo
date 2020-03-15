<template>
    <div id="window-articles-innerWindow">
        <div id="noArticlesFoldersPathSetShow" v-if="!articlesFolderPathSet || (filteredArticles.length === 0 && !searching)">
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
        <div id="articlesFoldersPathSetShow" v-else>
            <div class="c1 text-center">
                <v-text-field 
                    class="articleSearchBar" 
                    v-model="searchText" 
                    label="Search Articles" 
                    :prepend-icon="search" 
                    hide-details 
                    outlined 
                    dense 
                    clearable
                    @focus="() => { searching = true}"
                    @blur="() => { searching = false}"
                ></v-text-field>
                <v-list>
                    <v-list-item dense v-for="article in filteredArticles" :key="article" two-line>
                        <v-card class="mx-auto article-card">
                            <v-card-text class="text-left">
                                {{ article }}
                            </v-card-text>
                            <v-card-actions style="display: block; text-align: right">
                                <v-btn small dark tile color="cyan" @click="openMd(article)">
                                    Open
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-list-item>
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

    export default {
        data: function() {
            return {
                articlesFolderPathSet: localStorage.getItem('articlesFolderPath') !== null,
                filteredArticles: [],
                search: mdiFileDocumentBoxSearchOutline,
                searchText:'',
                searching: false
            }
        },
        computed: {
            articles: {
                get() {
                    if (this.articlesFolderPathSet) {
                        return this.filterMd(fs.readdirSync(localStorage.getItem('articlesFolderPath'), {
                            encoding: 'utf-8'
                        }))
                    } else {
                        return []
                    }
                },
                set(dirfs) {
                    this.filteredArticles = this.filterMd(dirfs)
                }
            }
        },
        watch: {
            searchText (nv, ov) {
                if (nv !== '') {
                    this.filteredArticles = this.articles.filter(article => {
                        return article.toLowerCase().search(nv.toLowerCase()) > 0
                    })
                } else {
                    this.filteredArticles = this.articles
                }
            }
        },
        methods: {
            filterMd(dirfs) {
                let atcs = []
                dirfs.forEach(file => {
                    if (file.endsWith('.md')) {
                        atcs.push(file)
                    }
                })
                return atcs
            },
            jumpToWindowSettings() {
                this.vueMap.get('app-side-drawer').switchWindow('settings')
            },
            openMd(filename) {
                let mdpath = path.join(localStorage.getItem('articlesFolderPath'), filename)
                execa(mdpath)
            }
        },
        mounted: function() {
            this.filteredArticles = this.articles
        }
    }
</script>

<style scoped>
    #window-articles-innerWindow {
        height: 100%;
        background-color: white;
    }
    #noArticlesFoldersPathSetShow {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        user-select: none;
    }

    #articlesFoldersPathSetShow {
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
    
    .article-card:hover{
        background-color: whitesmoke;
    }
    .article-card:hover .v-card__text{
        color: rgb(59, 144, 255);
    }

    .articleSearchBar {
        background-color: white;
        width: 100%;
        padding: 10px;
    }
</style>