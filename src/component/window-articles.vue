<template>
    <div id="window-articles-innerWindow">
        <div id="noArticlesFoldersPathSetShow" v-if="!articlesFolderPathSet || filteredArticles.length === 0">
            <div class="c1 text-center" v-if="!articlesFolderPathSet && filteredArticles.length > 0">
                Please Set Articles' Folder Path First!
                <div class="my-2">
                    <v-btn tile small color="primary" @click="jumpToWindowSettings">Jump To Settings</v-btn>
                </div>
            </div>
            <div class="c1 text-center" v-else>
                No Markdown File In Here!
                <div class="my-2">
                    <v-btn tile small color="primary" @click="jumpToWindowSettings">Choose Another Folder.</v-btn>
                </div>
            </div>
        </div>
        <div id="articlesFoldersPathSetShow" v-else>
            <div class="c1 text-center">
                <v-list height="574">
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

    export default {
        data: function() {
            return {
                articlesFolderPathSet: localStorage.getItem('articlesFolderPath') !== null,
                filteredArticles: []
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
        mounted: function () {
            this.filteredArticles = this.articles
        }
    }
</script>

<style scoped>
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
    }
</style>