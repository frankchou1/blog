<template lang="pug">
.searchArea(:class="fixed ? 'fixed' : ''")
    slot
    el-input(v-model="searchVal" @focus="focus" @blur="blur" @keyup.native.enter="search" class="searchInp")
    //- el-checkbox-group( v-model="checked" :min="1" text-color="red" fill="#409EFF")
        el-checkbox(:label="checkedList[0]"  class="search_options") 标题
        el-checkbox(:label="checkedList[1]"  class="search_options") 分类
        el-checkbox(:label="checkedList[2]"  class="search_options") 关键字
        el-checkbox(:label="checkedList[3]"  class="search_options") 文章
</template>
<script>
import { mapState } from 'vuex';
import axios from 'axios';
    export default {
        props:{
            fixed: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                keyid:0,
                tagid:0,
                searchVal:'',
				// checkedList: ['title','tag','keyword','artical'],//标题,标签,关键字,文章
				// checked: ['title']
            }
        },
        computed: {
            ...mapState(['activeAni'])
        },
        mounted() {
            this.searchVal = this.$store.state.searchVal;
        },
        methods:{
            focus(){
                if(this.$route.path != '/') return
                this.$store.commit("C_",{obj:'activeAni', val:1})
			},
			blur(){
                if(this.$route.path != '/') return
                this.$store.commit("C_",{obj:'activeAni', val:0})
			},
			async search(){
                let res = await this.AJAX.artList({
                    keyid: this.keyid,
                    tagid: this.tagid,
                    searchStr: this.searchVal,
                    pageSize: 10,
                    curPage:1
                })
                this.$store.commit("C_",{obj:'searchRes', val:res.data})
                if(res&&res.code=='SUCC_200'){
                    this.$store.commit("C_",{obj:'searchVal', val:this.searchVal});
                    this.$store.commit("C_",{obj:'activeTag', val:this.tagid});
                    this.$store.commit("C_",{obj:'activeKeyw', val:this.keyid});
				    this.$router.push('/searchList')
                }
			}
        }
    }
</script>

<style lang="scss" scoped>
.fixed {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.searchArea {
    width: 500px;
    .searchInp {
        margin-bottom: 15px;
    }
}
</style>
