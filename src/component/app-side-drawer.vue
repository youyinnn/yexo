<template>
    <v-navigation-drawer class="deep-purple" width="170" absolute dark permanent expand-on-hover>
        <v-list>
            <v-list-item-group v-model="selected" mandatory>
                <v-list-item v-for="item in items" :key="item.title" @click="item.action" link>
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
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
        data: () => ({
            selected: 0,
            items: [{
                    title: 'Articles',
                    icon: mdiGithubBox,
                    action: () => {
                        console.log(123)
                    }
                },
                {
                    title: 'Account',
                    icon: mdiGithubFace,
                    action: () => {
                        console.log(456)
                    }
                },
                {
                    title: 'Github',
                    icon: mdiGithubCircle,
                    action: () => {
                        console.log(789)
                    }
                },
            ],
        })
    }
</script>