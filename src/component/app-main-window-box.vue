<template>
    <div id="app-main-window">
        <!-- <div id="window-todo" class="main-window cyan"></div> -->
        <window id="window-articles"></window>
        <window id="window-scripts"></window>
        <window id="window-todos"></window>
        <window id="window-friends"></window>
        <window id="window-resumes"></window>
        <window id="window-about"></window>
        <window id="window-settings"></window>
    </div>
</template>

<script>
    var window = {
        props: ['id'],
        template: `
            <div :id="id" :class="show" class="main-window">
                {{ id }}
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
                        this.$data.show = 'show'
                    }, 100);
                } else {
                    this.$data.show = ''
                }
            }
        }
    }
    export default {
        components: {
            'window': window
        }
    }
</script>