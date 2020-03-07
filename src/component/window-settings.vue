<template>
    <div>
        <v-card class="mx-auto">
            <v-card-subtitle class="unselectable font-weight-black">
                Github Setting
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-text>
                <v-row dense>
                    <v-col cols="10">
                        <v-text-field :value="localBasePath" label="Local Base Path"></v-text-field>
                    </v-col>
                    <v-col cols="2" align-self="center">
                        <v-btn small color="primary" @click="selectBasePath">
                            <v-icon>{{pathSelectIcon}}</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-text-field label="Blog's Repo Name"></v-text-field>
            </v-card-text>
            <v-card-actions style="display: block; text-align: right">
                <v-btn depressed color="cyan accent-4" dark @click="saveGithubSettings">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import {
        remote
    } from 'electron'

    const dialog = remote.dialog
    import {
        mdiFolderTextOutline
    } from '@mdi/js'

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
        data: function() {
            return {
                localBasePath: localStorage.getItem('localBasePath') !== null ? localStorage.getItem('localBasePath') : '',
                pathSelectIcon: mdiFolderTextOutline
            }
        },
        methods: {
            selectBasePath() {
                let path = dialog.showOpenDialogSync({
                    title: 'Select Your Blog Repo Path',
                    properties: ['openDirectory']
                })
                if (path !== undefined && path !== null)
                    this.$data.localBasePath = path[0]
            },
            saveGithubSettings() {
                localStorage.setItem('localBasePath', this.$data.localBasePath)
                status(this.$data.localBasePath).then(status => console.log(status));
            }
        }
    }
</script>