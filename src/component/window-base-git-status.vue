<template>
    <div id="window-base-git-status-innerWindow">
        <div id="no-status" v-if="noChanges" style="position: absolute;height: 544px;width: 324px;line-height: 544px;text-align: center; color: whitesmoke;">
            No Changes
        </div>
        <v-card class="mb-5" v-if="staged.length !== 0">
            <v-card-subtitle class="grey darken-2" style="color: white !important;">Staged</v-card-subtitle>
            <v-card-text>
                <transition-group name="git-file">
                    <p v-for="n in staged" :key="n">
                        {{ n }}
                    </p>
                </transition-group>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="notAddedFiles.length !== 0">
            <v-card-subtitle class="cyan" style="color: white !important;">Not Added</v-card-subtitle>
            <v-card-text>
                <transition-group name="git-file">
                    <p v-for="n in notAddedFiles" :key="n">
                        {{ n }}
                    </p>
                </transition-group>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="created.length !== 0">
            <v-card-subtitle class="indigo" style="color: white !important;">Created</v-card-subtitle>
            <v-card-text>
                <transition-group name="git-file">
                    <p v-for="n in created" :key="n">
                        {{ n }}
                    </p>
                </transition-group>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="deleted.length !== 0">
            <v-card-subtitle class="error" style="color: white !important;">Deleted</v-card-subtitle>
            <v-card-text>
                <transition-group name="git-file">
                    <p v-for="n in deleted" :key="n">
                        {{ n }}
                    </p>
                </transition-group>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="modified.length !== 0">
            <v-card-subtitle class="orange" style="color: white !important;">Modified</v-card-subtitle>
            <v-card-text>
                <transition-group name="git-file">
                    <p v-for="n in modified" :key="n">
                        {{ n }}
                    </p>
                </transition-group>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="renamed.length !== 0">
            <v-card-subtitle class="blue" style="color: white !important;">Renamed</v-card-subtitle>
            <v-card-text>
                <transition-group name="git-file">
                    <p v-for="n in renamed" :key="n">
                        {{ n }}
                    </p>
                </transition-group>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import git from '../plugins/git-handler'

    export default {
        data() {
            return {
                notAddedFiles: [],
                created: [],
                deleted: [],
                modified: [],
                renamed: [],
                staged: [],
            }
        },
        computed: {
            noChanges() {
                return this.notAddedFiles.length === 0 &&
                    this.created.length === 0 &&
                    this.deleted.length === 0 &&
                    this.modified.length === 0 &&
                    this.staged.length === 0 &&
                    this.renamed.length === 0
            }
        },
        methods: {
            updateStatus() {
                if (localStorage.getItem('articlesFolderPath') !== null) {
                    git.status(localStorage.getItem('articlesFolderPath')).then(status => {
                        this.notAddedFiles = this.processFilesArr(status.not_added)
                        this.created = this.processFilesArr(status.created)
                        this.deleted = this.processFilesArr(status.deleted)
                        this.modified = this.processFilesArr(status.modified)
                        this.renamed = this.processFilesArr(status.renamed)
                        this.staged = this.processFilesArr(status.staged)
                    })
                }
            },
            processFilesArr(arr) {
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].replace(/"|'/g, '')
                }
                return arr.sort()
            }
        },
        mounted() {
            this.updateStatus()
        }
    }
</script>

<style scoped>
    #window-base-git-status-innerWindow {
        padding: 10px;
    }

    #window-base-git-status-innerWindow>>>p {
        margin: 0;
        color: black;
        -moz-user-select: none;
        transition: all .8s;
        font-size: 14px;
        user-select: none;
        cursor: pointer;
    }

    #window-base-git-status-innerWindow>>>p:hover {
        background-color: rgb(173, 173, 173);
        transform: translateX(5px);
    }

    .git-file-enter-active {
        opacity: 0;
        transform-origin: top;
        transform: rotateX(90deg);
    }

    .git-file-enter-to {
        opacity: 1;
        transform-origin: top;
        transform: rotateX(0deg);
    }

    .git-file-leave-active {
        transition: all .5s;
        opacity: 0;
        transform-origin: top;
        transform: rotateX(90deg);
        height: 0;
        padding: 0;
    }
</style>