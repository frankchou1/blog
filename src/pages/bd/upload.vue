<template lang="pug">
    .upload
        h1 文章添加
        el-form(:model="artForm" ref="artForm" label-position="right" label-width="100px")
            el-form-item(label="标题" prop="title" required)
                el-input(v-model="artForm.title")

            el-form-item(label="关键字" prop="keywords" required)
                el-tag(:key="item.key_id" v-for="item in artForm.keywords" closable :disable-transitions="false"  @close="closeKeyW(item)") {{item.keyword}}
                i.el-icon-plus(@click="showKWhistory=true")

            el-form-item(label="标签" prop="tags" required)
                el-tag(:key="item.tag_id" v-for="item in artForm.tags" closable :disable-transitions="false"  @close="closeTag(item)") {{item.tag}}
                i.el-icon-plus(@click="showTaghistory=true")

            //- el-form-item(label="简介" prop="desc")
                el-input(v-model="artForm.desc" type="textarea")

            el-form-item(label="内容" prop="article" required)
                el-input(v-model="artForm.article" type="textarea" :autosize="{ minRows: 25}")

            el-form-item(label="显示图片" style="display:inline-block;vertical-align:top" )
                label.img_file(for="artImg")
                    i.el-icon-plus
                    img(:src="artImgSrc") 
                input#artImg(ref="artImg" @change="changeFile" type="file" accept="image/png,image/jpeg")

            div( style="display:inline-block;vertical-align:top" )
                el-form-item(label="发布时间" prop="date" required)
                    el-date-picker(v-model="artForm.date" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd")
                el-form-item(label="作者" prop="author" required)
                    el-input(v-model="artForm.author")

        .footer
            el-button(type="primary" @click="upload") 上传

        //- 关键字弹层
        el-dialog(title="关键字选取" :visible.sync="showKWhistory" width="30%")
            .dialog_C
                el-tag(:key="item.keyword" v-for="(item,index) in keywordHistory" :disable-transitions="false" @click.native="add2Form_KW(item,index)" :type="item.a?'':'info'") {{item.keyword}}
                el-input.input-new-tag(v-show="inputVisible" v-model="inputValue" ref="saveHistory_KW" size="small" @keyup.enter.native="handleInputConfirm_KW" @blur="handleInputConfirm_KW")
                el-button.button-new-tag(v-show="!inputVisible" size="small" @click="showInput_KW") + New Keyword
            span( slot="footer" class="dialog-footer")
                el-button( type="primary" @click="showKWhistory = false") 确 定
        
        //- 标签弹层
        el-dialog(title="标签选取" :visible.sync="showTaghistory" width="30%")
            .dialog_C
                el-tag(:key="item.tag" v-for="(item,index) in tagHistory" :disable-transitions="false" @click.native="add2Form_tag(item,index)" :type="item.a?'':'info'") {{item.tag}}
                el-input.input-new-tag(v-show="inputVisible" v-model="inputValue" ref="saveHistory_tag" size="small" @keyup.enter.native="handleInputConfirm_tag" @blur="handleInputConfirm_tag")
                el-button.button-new-tag(v-show="!inputVisible" size="small" @click="showInput_tag") + New Tag
            span( slot="footer" class="dialog-footer")
                el-button( type="primary" @click="showTaghistory = false") 确 定
</template>

<script>
    export default {
        name: "upload",
        data(){
            return {
                keywordHistory:[],//a表示是否被选上
                tagHistory:[],
                showKWhistory:false,
                showTaghistory:false,
                inputVisible:'',
                inputValue:'',

                artImgSrc: '',
                artForm:{
                    title:'默认标题',
                    keywords:[],
                    tags:[],
                    // desc:'',
                    artImg: null,//选填
                    article:'文章内容',
                    date:'2018-01-05',
                    author:'阿迪斯发',
                }
            }
        },
        mounted() {
            this.getKeyWordsList();
            this.getTagsList();
        },
        methods:{
            // 获取关键字列表
            async getKeyWordsList(){
                let res = await this.AJAX.getKeyWordsList();
                for (let obj of res.data) {
                    obj.a = false
                }
                this.keywordHistory = res.data;
            },
            // 获取分类列表
            async getTagsList(){
                let res = await this.AJAX.getTagsList();
                for (let obj of res.data) {
                    obj.a = false
                }
                this.tagHistory = res.data;
            },

            // 表单内关闭选取的关键字
            closeKeyW(tag) {
                this.artForm.keywords.splice(this.artForm.keywords.indexOf(tag), 1);
            },
            closeTag(tag) {
                this.artForm.tags.splice(this.artForm.tags.indexOf(tag), 1);
            },

            // 图片上传
            changeFile(e){
                let imgFile = e.target.files[0];
                this.artImgSrc = URL.createObjectURL(imgFile);
                this.artForm.artImg = imgFile;
            },

            // 确认提交
            async upload(){
                // console.log(this.artForm);
                let keyids =[],tagids=[];
                for(let i=0; i<this.artForm.keywords.length; i++){ keyids.push(this.artForm.keywords[i].key_id) }
                for(let i=0; i<this.artForm.tags.length; i++){ tagids.push(this.artForm.tags[i].tag_id) }

                let p = new FormData();
                p.append('title',this.artForm.title)
                p.append('keywordsId',keyids)
                p.append('tagsId',tagids)
                p.append('artImg',this.artForm.artImg)
                p.append('article',this.artForm.article)
                p.append('date',this.artForm.date)
                p.append('author',this.artForm.author)
                // console.log(p)
                try{
                    let res = await this.AJAX.upload(p)
                    this.$refs['artForm'].resetFields();
                    this.SUCCESS('上传成功')
                }catch(e){console.log(e)}
                
            },

            // 关键字弹层
            add2Form_KW(item,index){
                if(this.artForm.keywords.length > 0){
                    if(!this.artForm.keywords.includes({key_id:item.key_id,keyword:item.keyword})){
                        this.artForm.keywords.push({key_id:item.key_id,keyword:item.keyword});
                    }
                }else {
                    this.artForm.keywords.push({key_id:item.key_id,keyword:item.keyword});
                }
            },
            showInput_KW() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveHistory_KW.$refs.input.focus();
                });
            },
            async handleInputConfirm_KW() {
                if (this.inputValue) {
                    try {
                        let res = await this.AJAX.addKeyWord({
                            keyword:this.inputValue
                        })
                        this.keywordHistory.push({...res.data,a:false});
                    }catch(e){console.log(e)}
                }
                this.inputVisible = false;
                this.inputValue = '';
            },

            // 标签弹层
            add2Form_tag(item,index){
                if(this.artForm.tags.length > 0){
                    if(!this.artForm.tags.includes({tag_id:item.tag_id,tag:item.tag})){
                        this.artForm.tags.push({tag_id:item.tag_id,tag:item.tag});
                    }
                }else {
                    this.artForm.tags.push({tag_id:item.tag_id,tag:item.tag});
                }
            },
            showInput_tag() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveHistory_tag.$refs.input.focus();
                });
            },

            async handleInputConfirm_tag() {
                if (this.inputValue) {
                    try {
                        let res = await this.AJAX.addTag({
                            tag:this.inputValue
                        })
                        this.tagHistory.push({...res.data,a:false});
                    }catch(e){console.log(e)}
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        },
        watch:{
            'artForm.keywords': function(n,o){
                for (let i = 0; i < this.keywordHistory.length; i++) {
                    let isSame = false;
                    for(let l=0; l< n.length; l++){
                        if(n[l].keyword == this.keywordHistory[i].keyword){
                            isSame = true;
                        }
                    }
                    if(isSame) {
                        this.keywordHistory[i].a = true;
                    }else {
                        this.keywordHistory[i].a = false;
                    }
                }
            },
            'artForm.tags': function(n,o){
                for (let i = 0; i < this.tagHistory.length; i++) {
                    let isSame = false;
                    for(let l=0; l< n.length; l++){
                        if(n[l].tag == this.tagHistory[i].tag){
                            isSame = true;
                        }
                    }
                    if(isSame) {
                        this.tagHistory[i].a = true;
                    }else {
                        this.tagHistory[i].a = false;
                    }
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "./upload.scss"
</style>