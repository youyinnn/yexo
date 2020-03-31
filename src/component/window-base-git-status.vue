<template>
    <div id="window-base-git-status-innerWindow">
        <transition-group name="cards">
            <div id="no-status-show" v-if="noChanges" class="unselectable" key="no-status-show">
                <div>
                    <img :src="logo" ondragstart="return false;">
                    <p>No Changes</p>
                </div>
            </div>
            <v-card class="mb-5" v-if="staged.length !== 0" key="staged-card">
                <v-card-subtitle class="grey darken-2 unselectable" style="color: white !important;">Staged</v-card-subtitle>
                <v-card-text>
                    <transition-group name="git-file">
                        <p class="cp" v-for="n in staged" :key="n">
                            {{ n }}
                        </p>
                    </transition-group>
                </v-card-text>
            </v-card>
            <v-card class="mb-5" v-if="notAdded.length !== 0" key="not-added-card">
                <v-card-subtitle class="cyan unselectable" style="color: white !important;">Not Added</v-card-subtitle>
                <v-card-text>
                    <transition-group name="git-file">
                        <p class="cp" v-for="n in notAdded" :key="n">
                            {{ n }}
                        </p>
                    </transition-group>
                </v-card-text>
            </v-card>
            <v-card class="mb-5" v-if="created.length !== 0" key="created-card">
                <v-card-subtitle class="indigo unselectable" style="color: white !important;">Created</v-card-subtitle>
                <v-card-text>
                    <transition-group name="git-file">
                        <p class="cp" v-for="n in created" :key="n">
                            {{ n }}
                        </p>
                    </transition-group>
                </v-card-text>
            </v-card>
            <v-card class="mb-5" v-if="deleted.length !== 0" key="deleted-card">
                <v-card-subtitle class="error unselectable" style="color: white !important;">Deleted</v-card-subtitle>
                <v-card-text>
                    <transition-group name="git-file">
                        <p class="cp" v-for="n in deleted" :key="n">
                            {{ n }}
                        </p>
                    </transition-group>
                </v-card-text>
            </v-card>
            <v-card class="mb-5" v-if="modified.length !== 0" key="modified-card">
                <v-card-subtitle class="orange unselectable" style="color: white !important;">Modified</v-card-subtitle>
                <v-card-text>
                    <transition-group name="git-file">
                        <p class="cp" v-for="n in modified" :key="n">
                            {{ n }}
                        </p>
                    </transition-group>
                </v-card-text>
            </v-card>
            <v-card class="mb-5" v-if="renamed.length !== 0" key="renamed-card">
                <v-card-subtitle class="blue unselectable" style="color: white !important;">Renamed</v-card-subtitle>
                <v-card-text>
                    <transition-group name="git-file">
                        <p class="cp" v-for="n in renamed" :key="n">
                            {{ n }}
                        </p>
                    </transition-group>
                </v-card-text>
            </v-card>
        </transition-group>
    </div>
</template>

<script>
    import git from 'simple-git/promise'
    import logo from '../img/logo2_256.png'

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
        data() {
            return {
                notAdded: [],
                created: [],
                deleted: [],
                modified: [],
                renamed: [],
                staged: [],
                logo: logo,
            }
        },
        computed: {
            noChanges() {
                return this.notAdded.length === 0 &&
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
                    status(localStorage.getItem('articlesFolderPath')).then(status => {
                        this.notAdded = this.processFilesArr(status.not_added)
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
    #no-status-show {
        position: absolute;
        text-align: center;
        color: whitesmoke;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
    }

    #no-status-show>div {
        position: absolute;
        left: 0;
        right: 0;
        height: 290px;
        top: -20px;
        bottom: 0;
        margin: auto;
    }

    #window-base-git-status-innerWindow {
        padding: 10px;
    }

    .cp {
        margin: 0;
        color: black;
        -moz-user-select: none;
        transition: all .5s;
        font-size: 14px;
        user-select: none;
        cursor: pointer;
    }

    .cp:hover {
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

    .cards-enter-active {
        transition: all .8s;
        opacity: 0;
    }

    .cards-enter-to {
        transition: all .8s;
        opacity: 1;
    }

    .cards-leave-active {
        transition: all .3s;
        opacity: 0;
    }
</style>