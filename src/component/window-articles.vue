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
                Articles' Folder Path Set
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                articlesFolderPathSet: localStorage.getItem('articlesFolderPath') !== null
            }
        },
        methods: {
            jumpToWindowSettings() {
                this.vueMap.get('app-side-drawer').switchWindow('settings')
            }
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
</style>