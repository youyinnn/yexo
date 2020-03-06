<template>
    <div id="app-main-window">
        <!-- <div id="window-todo" class="main-window cyan"></div> -->
        <window id="window-articles"></window>
        <window id="window-scripts"></window>
        <window id="window-todos"></window>
        <window id="window-github"></window>
        <window id="window-setting"></window>
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
            switch: function() {
                return this.$store.state.currentWindow
            }
        },
        watch: {
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