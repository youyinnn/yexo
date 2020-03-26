<template>
    <div id="window-base-git-status-innerWindow">
        <v-card class="mb-5" v-if="notAddedFiles.length !== 0">
            <v-card-subtitle class="cyan" style="color: white !important;">Not Added</v-card-subtitle>
            <v-card-text>
                <p v-for="n in notAddedFiles" :key="n">
                    {{ n }}
                </p>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="created.length !== 0">
            <v-card-subtitle class="indigo" style="color: white !important;">Created</v-card-subtitle>
            <v-card-text>
                <p v-for="n in created" :key="n">
                    {{ n }}
                </p>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="deleted.length !== 0">
            <v-card-subtitle class="error" style="color: white !important;">Deleted</v-card-subtitle>
            <v-card-text>
                <p v-for="n in deleted" :key="n">
                    {{ n }}
                </p>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="modified.length !== 0">
            <v-card-subtitle class="orange" style="color: white !important;">Modified</v-card-subtitle>
            <v-card-text>
                <p v-for="n in modified" :key="n">
                    {{ n }}
                </p>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="renamed.length !== 0">
            <v-card-subtitle class="blue" style="color: white !important;">Renamed</v-card-subtitle>
            <v-card-text>
                <p v-for="n in renamed" :key="n">
                    {{ n }}
                </p>
            </v-card-text>
        </v-card>
        <v-card class="mb-5" v-if="staged.length !== 0">
            <v-card-subtitle class="grey darken-2" style="color: white !important;">Staged</v-card-subtitle>
            <v-card-text>
                <p v-for="n in staged" :key="n">
                    {{ n }}
                </p>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import git from 'simple-git'
    async function status(workingDir) {
        const git = require('simple-git/promise');

        let statusSummary = null;
        try {
            statusSummary = await git(workingDir).status();
        } catch (e) {
            // handle the error
        }
        return statusSummary;
    }

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
        methods: {
            updateStatus() {
                status(localStorage.getItem('articlesFolderPath')).then(status => {
                    this.notAddedFiles = this.processFilesArr(status.not_added)
                    this.created = this.processFilesArr(status.created)
                    this.deleted = this.processFilesArr(status.deleted)
                    this.modified = this.processFilesArr(status.modified)
                    this.renamed = this.processFilesArr(status.renamed)
                    this.staged = this.processFilesArr(status.staged)
                })
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
    #window-base-git-status-innerWindow>>> p {
        padding: 3px;
        margin: 0;
        color: black;
        -moz-user-select: none;
        transition: all .3s;
        font-size: 14px;
        user-select: none;
        cursor: pointer;
    }

    #window-base-git-status-innerWindow>>> p:hover {
        background-color: rgb(173, 173, 173);
        padding: 4px;
        transform: translateX(5px);
    }
</style>