<template>
    <div id="window-articles-innerWindow">
        <div id="noArticlesFoldersPathSetShow" v-if="!articlesFolderPathSet">
            <div id="c1" class="text-center">
                Please Set Articles' Folder Path First!
                <div class="my-2">
                    <v-btn tile small color="primary" @click="jumpToWindowSettings">Jump To Settings</v-btn>
                </div>
            </div>
        </div>
        <div id="articlesFoldersPathSetShow" v-else>
            <div id="c1" class="text-center">
                <v-list height="574">
                    <v-list-item dense v-for="article in filteredArticles" :key="article" two-line>
                        <v-card class="mx-auto article-card">
                            <v-card-text class="text-left">
                                {{ article }}
                            </v-card-text>
                            <v-card-actions style="display: block; text-align: right">
                                <v-btn small dark tile color="cyan">
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

    #c1 {
        width: 100%;
        align-self: center;
    }

    .article-card {
        width: 100%;
        margin-bottom: 1rem;
    }
</style>