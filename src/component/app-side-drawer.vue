<template>
    <v-navigation-drawer id="app-side-drawer" class="deep-purple" width="170" absolute dark permanent expand-on-hover>
        <v-list>
            <v-list-item-group v-model="selected" mandatory>
                <v-list-item v-for="item in items" :key="item.title" @click="action(item.title)" link>
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
        mdiFileOutline,
        mdiScriptTextOutline,
        mdiClipboardListOutline,
        mdiAccountSupervisor,
        mdiAccountBadge,
        mdiGoogleDownasaur,
        mdiSettings
    } from '@mdi/js'

    export default {
        data: () => ({
            selected: 0,
            items: [{
                    title: 'Articles',
                    icon: mdiFileOutline,
                },
                {
                    title: 'Scripts',
                    icon: mdiScriptTextOutline,
                },
                {
                    title: 'Todos',
                    icon: mdiClipboardListOutline,
                },
                {
                    title: 'Friends',
                    icon: mdiAccountSupervisor,
                },                
                {
                    title: 'Resumes',
                    icon: mdiAccountBadge,
                },                
                {
                    title: 'About',
                    icon: mdiGoogleDownasaur,
                },
                {
                    title: 'Settings',
                    icon: mdiSettings,
                }
            ],
        }),
        methods: {
            action: function(str) {
                this.$store.commit('switchWindow',
                    'window' + '-' + str.toLowerCase())
            }
        }
    }
</script>