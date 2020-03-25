<template>
    <div id="app-main-window">
        <window id="window-articles">
            <window-articles></window-articles>
        </window>
        <window id="window-settings">
            <window-settings></window-settings>
        </window>
    </div>
</template>

<script>
    var window = {
        props: ['id'],
        template: `
            <div :id="id" :class="show" class="main-window">
                <slot></slot>
            </div>
        `,
        data: function() {
            return {
                show: this.$store.state.currentWindow === this.id ? 'show' : ''
            }
        },
        computed: {
            // 多用一个switch变量 用于在 currentWindow 变化的同时 也变化switch
            switch: function() {
                return this.$store.state.currentWindow
            }
        },
        watch: {
            // 通过watch来检测switch变化 然后改变show
            switch: function(nv, ov) {
                if (nv === this.id) {
                    setTimeout(() => {
                        this.show = 'show'
                    }, 100);
                } else {
                    this.show = ''
                }
            }
        }
    }
    import windowSettings from './window-settings.vue'
    import windowArticles from './window-articles.vue'
    export default {
        components: {
            'window': window,
            'window-settings': windowSettings,
            'window-articles': windowArticles,
        }
    }
</script>