<template>
    <transition-group id="my-curtain" name="my-curtain-transit">
        <div v-if="show" key="my-curtain">
            <div class="my-curtain-center">
                <img id="welcome-logo" :src="welcome" ondragstart="return false;">
                <p id="welcome-text"> {{ welcoming }} </p>
                <v-progress-circular id="welcome-progress-c" indeterminate color="blue-grey" size="40"></v-progress-circular>
            </div>
        </div>
    </transition-group>
</template>

<script>
    import welcome from '../img/welcome_256.png'

    export default {
        data() {
            return {
                welcome: welcome,
                welcoming: 'Hi~',
                show: true
            }
        },
        mounted() {
            this.vueMap.get('window-articles-innerWindow').metadataUpdateDialog = true
            this.vueMap.get('app-side-drawer').dialog = true
            this.vueMap.get('app-side-drawer').switchWindow('settings')
            setTimeout(() => {
                document.getElementById('welcome-logo').style.opacity = '1'
            }, 300)            
            setTimeout(() => {
                document.getElementById('welcome-text').style.opacity = '1'
                document.getElementById('welcome-text').style.transform = 'translateY(0px)'
            }, 300)
            setTimeout(() => {
                document.getElementById('welcome-progress-c').style.opacity = '1'
                document.getElementById('welcome-progress-c').style.transform = 'translateY(0px)'
            }, 500)
            setTimeout(() => {
                this.vueMap.get('window-articles-innerWindow').metadataUpdateDialog = false
                this.vueMap.get('app-side-drawer').dialog = false
            }, 500)
            setTimeout(() => {
                this.vueMap.get('app-side-drawer').switchWindow('articles')
            }, 1000)
            setTimeout(() => {
                document.getElementById('my-curtain').className = 'hide'
                setTimeout(() => {
                    document.getElementById('my-curtain').style.zIndex = '-1'
                }, 290);
                this.show = false
            }, 2000)
        }
    }
</script>

<style scoped>
    #my-curtain {
        position: absolute;
        top: 30px;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        z-index: 9999;
        background-color: #2a2a2a;
        opacity: 1;
        transition: all .3s;
    }

    .hide {
        opacity: 0 !important;
    }

    #my-curtain * {
        transition: all 1s ease-in-out;
    }

    #welcome-logo {
        width: 256px;
        height: 256px;
        opacity: 0;
    }

    #welcome-text {
        transition: all .5s ease-in-out;
        transform: translateY(-10px);
        opacity: 0;
    }

    #welcome-progress-c {
        transition: all .5s ease-in-out;
        transform: translateY(-20px);
        opacity: 0;
    }

    .my-curtain-center {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 100px;
        text-align: center;
        color: rgb(173, 173, 173);
    }

    .my-curtain-transit-enter-active {
        transition: all .8s;
        opacity: 0;
    }

    .my-curtain-transit-enter-to {
        transition: all .8s;
        opacity: 1;
    }

    .my-curtain-transit-leave-active {
        transition: all .3s;
        opacity: 0;
    }
</style>