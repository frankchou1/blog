<template lang="pug">
    layout
        .articleId
            h1 {{artData.title}}
            header.ovh
                .time.fr {{artData.date}}
                .tags(@click="clickTag($event)") 分类:
                    span.item( v-for="(tag,key,idx) in par(artData.tags)" :key="idx" :data-val="tag" :data-key="key" ) {{tag}}
                .keywords( @click="clickKeyWord($event)") 关键字:
                    span.item( v-for="(keyw,key,idx) in par(artData.keyws)" :key="idx" :data-val="keyw" :data-key="key" ) {{keyw}}
            
            article {{artData.art}}

            //- 评论区 
            .comment
        </div>
</template>

<script>
import layout from '@/components/layout'
    export default {
        name: "articleId",
        components:{ layout },
        data(){
            return {
                artData:{
                    tags:'{}',
                    keyws:'{}',
                }
            }
        },
        async mounted() {
            let res = await this.AJAX.getArtById({
                    id:this.$route.params.id
                })
            if(res.data.date) res.data.date = this.DATE_FORMATE(res.data.date)
            this.artData = res.data;
        },
        methods:{
            par(str){
                return JSON.parse(str)
            },
            clickTag(e){
                // console.log(e)
                if(e.target.nodeName === 'SPAN') {
                    console.log(e.target.dataset.key.replace(/[a-z]/i,''),e.target.dataset.val)
                }
            },
            clickKeyWord(e){
                if(e.target.nodeName === 'SPAN') {
                    console.log(e.target.dataset.key.replace(/[a-z]/i,''),e.target.dataset.val)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../../assets/css/main.scss";
    .articleId {
        padding: 0 30px;
        h1 {
            font-size: 35px;
            text-align: center;
            margin-bottom: 40px;
        }

        .tags,.keywords {
            margin-bottom: 15px;
            .item {
                display: inline-block;
                padding: 5px 8px;
                margin-left: 15px;
                // margin-bottom: 15px;
                border:1px solid #c0c0c0;
                color: #c0c0c0;
                border-radius: 3px;
                cursor: pointer;
                transition: all 0.3s;
                // &.active {
                //     background-color: rgb(192, 192, 192);
                //     color: $defC3;
                // }
                &:hover {
                    color: $defC;
                }
            }
        }
        &>article {
            padding-bottom: 70px;
            margin-top: 30px;
            font-size: 20px;
            white-space: 0.5em;
            line-height: 1.8em;
            text-align: justify;
            word-break: normal;
        }
    }
    
</style>