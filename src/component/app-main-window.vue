<template>
    <div id="app-main-window">
        <div id="window-articles" :class="{ show: this.$store.state.currentWindow === 'window-articles' }" class="main-window pink"></div>
        <div id="window-scripts" class="main-window indigo"></div>
        <div id="window-todo" class="main-window cyan"></div>
    </div>
</template>

<script>
    export default {
    }
</script>