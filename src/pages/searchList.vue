<template lang="pug">
    layout
        .searchList
            .tabs
                el-tabs(type="border-card" v-model="activeName")
                    el-tab-pane(label="搜索结果" name="RESULT")
                    //- el-tab-pane(label="所有分类" name="TAGS")
                    //- el-tab-pane(label="文章推荐" name="RECOMMONED")

            //- 分类标签
            .Tags(v-show="activeName=='TAGS'" @click="clickTag($event)")
                .item(v-for="item in 20" :key="item.id" :data-tag="item") {{item}}
            
            //- 搜索结果
            ul.result_list(v-show="activeName=='RESULT'||activeName=='RECOMMONED'")
                li.ovh(v-for="item in searchRes.data" :key="item.id") 
                    .right.fr
                        .time {{DATE_FORMATE(item.date)}}
                        router-link(:to="'/article/'+item.id" target="_blank" v-if="item.img!=''||item.img!=undefined")
                            img( :src="PROXY_HEAD + item.img" alt="")
                    h2
                        //- 这里需要用自定义指令找出关键字(+span.active)
                        router-link(:to="'/article/'+item.id" target="_blank" v-html="strFilter(item.title)")
                    //- 这里需要用自定义指令找出关键字(+span.active)
                    .intr(v-html="strFilter(item.art)")
                    .tags(@click="clickTag($event)") 分类:
                        span.item( v-for="(tag,key,idx) in par(item.tags)" :key="idx" 
                            :class="isActive(key,activeTag)" :data-tag="tag") {{tag}}
                    .keywords(@click="clickKeyWord($event)") 关键字:
                        span.item( v-for="(kw,key,idx) in par(item.keyws)" :key="idx"
                            :class="isActive(key,activeKeyw)" :data-tag="kw") {{kw}}
                    
            el-pagination(@current-change="handleCurrentChange" :current-page="curpage"  class="pagination" :style="'bottom:'+pageBottom"
                layout="total, prev, pager, next, jumper" :page-size="10" :total="searchRes.total")
</template>
<script>
import layout from '@/components/layout'
import { mapState } from 'vuex';
    export default {
        components:{ layout },
        data(){
            return {
                activeName: 'RESULT',
                curpage: 1,
                pageBottom: '0',
                showList: false,
            }
        },
        computed:{
            ...mapState(['searchRes','activeTag','activeKeyw','searchVal'])
        },
        mounted() {
            
        },
        methods: {
            clickTag(e){
                // console.log(e)
                let bool = false;
                let arr = e.target.classList;
                for(let i=0; i<=arr.length; i++){
                    if(arr[i] == 'item'){
                        bool = true;
                        break;
                    }
                }
                if(bool){
                    let tag = e.target.dataset.tag;
                    this.searchTag(tag);
                }
            },
            clickKeyWord(e) {
                let bool = false;
                let arr = e.target.classList;
                for(let i=0; i<=arr.length; i++){
                    if(arr[i] == 'item'){
                        bool = true;
                        break;
                    }
                }
                if(bool){
                    let tag = e.target.dataset.tag;
                    this.searchTag(tag);
                }
            },
            searchTag(tag) {
                alert(1)
            },
            searchKeyWord(word) {

            },
            async getList(){
                try {
                    let res = await this.AJAX.artList({
                        keyid: this.activeKeyw,
                        tagid: this.activeTag,
                        searchStr: this.searchVal,
                        pageSize: 10,
                        curPage:1
                    })
                    this.$store.commit("C_",{obj:'searchVal', val:this.searchVal});
                    this.$store.commit("C_",{obj:'activeTag', val:this.tagid});
                    this.$store.commit("C_",{obj:'activeKeyw', val:this.keyid});
                    this.$store.commit("C_",{obj:'searchRes', val:res.data})
                } catch (error) {
                    console.log(error)
                }
                
			},
            // 翻页
            handleCurrentChange(page){
                this.curpage = page;
                this.getList();
            },

            par(str){
                return JSON.parse(str)
            },
            // 读取文章内容作为简介
            strFilter(art){
                let result ="";
                let searchValIndex = art.indexOf(this.searchVal);
                if(searchValIndex !=-1){//文中有搜索字符的话
                    let frontStr = art.slice(0, searchValIndex);
                    let lastEndIndex = frontStr.lastIndexOf("。");// 获取前面第一个句号的位置
                    result = art.slice(lastEndIndex+1);
                    let RE = new RegExp(this.searchVal,"g");
                    let replaceVal = "<span style='color:#2768c1;'>"+this.searchVal+"</span>";
                    return result.replace(RE,replaceVal)
                }else {
                    return art
                }
            },

            isActive(word,matchWord){
                if(word.replace(/[a-z]/i,'') == matchWord) return 'active'
                else return ''
            },

            // 获取推荐文章
            async getHotArt(){
                try {
                    let res = this.AJAX.getHotArt();
                    this.$store.commit("C_",{obj:'searchRes', val:res.data})
                } catch (error) {
                    
                }
            }

        },
        watch:{
            activeName:function(n,o) {
                if(n == 'RECOMMONED'){
                    this.getHotArt();
                }
                if(n == 'RESULT') {
                    this.pageBottom = 0;
                }else {
                    this.pageBottom = '-37px';
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "./searchList.scss";
</style>
