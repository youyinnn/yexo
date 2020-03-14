<template>
    <div id="window-articles-innerWindow">
        <vue-scrollbar classes="my-scrollbar" ref="Scrollbar" :speed=200>
            <div id="noArticlesFoldersPathSetShow" class="scroll-me" v-if="!articlesFolderPathSet">
                <div id="c1" class="text-center">
                    Please Set Articles' Folder Path First!
                    <div class="my-2">
                        <v-btn tile small color="primary" @click="jumpToWindowSettings">Jump To Settings</v-btn>
                    </div>
                </div>
            </div>
            <div id="articlesFoldersPathSetShow" class="scroll-me" v-else>
                <div id="c1" class="text-center">
                    <v-list>
                        <v-list-item v-for="article in articles" :key="article.name" two-line>
                            <v-list-item-content>
                                <v-list-item-title class="text-left">{{ article }}</v-list-item-title>
                                <v-list-item-subtitle>

                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </div>
            </div>
        </vue-scrollbar>
    </div>
</template>

<script>
    import VueScrollbar from 'vue2-scrollbar';
    import fs from 'fs'

    export default {
        data: function() {
            return {
                articlesFolderPathSet: localStorage.getItem('articlesFolderPath') !== null,
            }
        },
        computed: {
            articles: function() {
                let atcs = []
                if (this.articlesFolderPathSet) {
                    atcs = fs.readdirSync(localStorage.getItem('articlesFolderPath'), {
                        encoding: 'utf-8'
                    })
                }
                return atcs
            }
        },
        methods: {
            jumpToWindowSettings() {
                this.vueMap.get('app-side-drawer').switchWindow('settings')
            }
        },
        components: {
            VueScrollbar
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

    .my-scrollbar {
        min-width: 334px;
        max-height: 574px;
        transition: none !important;
    }

    .scroll-me {
        min-width: 324px;
    }
</style>