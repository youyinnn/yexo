<template>
    <v-navigation-drawer class="deep-purple" width="170" absolute dark permanent expand-on-hover>
        <v-list nav dense>
            <v-list-item v-for="item in items" :key="item.title" link>
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>

    import {
        mdiGithubBox,
        mdiGithubFace,
        mdiGithubCircle
    } from '@mdi/js'

    export default {
        data() {
            return {
                items: [{
                        title: 'Articles',
                        icon: mdiGithubBox
                    },
                    {
                        title: 'Account',
                        icon: mdiGithubFace
                    },
                    {
                        title: 'Github',
                        icon: mdiGithubCircle
                    },
                ],
            }
        },
    }
</script>