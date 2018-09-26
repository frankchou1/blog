<template lang="pug">
div
    searchBg
    transition(name="slide-fade")
        .layout(v-show="showHeader" :class="showHeader ? 'fff':''")
            nav.clearfix
                h1.logo.fl
                    router-link(to="/") FrankChou's Blog
                searchArea.fr
            slot
</template>

<script>
import searchArea from './searchArea'
import searchBg from './searchBg'
    export default {
        name: "layoutHeader",
        components:{ searchArea,searchBg },
        data(){
            return {
                showHeader:false
            }
        },
        created() {
            this.$store.state.activeAni = 0;
            setTimeout(() => {
                this.showHeader = true;
                // this.$store.state.activeAni = 0;
                this.$store.state.activeAni = 2;
            }, 500);
        },
        methods:{
            
        }
    }
</script>

<style lang="scss" scoped>
@import "./../assets/css/main.scss";
    .layout {
        width: $wrapW;
        // min-height: 100vh;
        padding: 20px;
        margin: 0 auto;
        box-sizing: border-box;
        background-color: transparent;
        transition: all 0.5s;
        &.fff {
            background-color: #fff;
        }
    }
    // 头部
    nav {
        margin-bottom: 55px;
        .logo {
            color: $defC;
            font-size: 35px;
            // line-height: 70px;
        }
    }
    .slide-fade-enter-active, .slide-fade-leave-active {
        transition: all .5s cubic-bezier(.23,.74,.66,.99);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(300px);
        opacity: 0;
    }
</style>