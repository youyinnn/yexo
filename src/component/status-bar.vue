<template>
    <div id="status-bar" :class="color" class="darken-3 white--text text-center" style="text-align: right;">
        {{ text }}
    </div>
</template>

<script>

    export default {
        data: function() {
            return {
                color: 'blue',
                text: 'Blue'
            }
        }
    }
</script>

<style scoped>
    #status-bar {
        position: absolute;
        height: 20px;
        bottom: 0;
        left: 56px;
        right: 0;
        padding: 0 8px;
        line-height: 20px;
    }

</style>