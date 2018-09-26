import axios from 'axios';
import Vue from 'vue';
import App from '../App.vue';

//开发代理
let base = process.env.NODE_ENV === 'development' ? '/api' : '';


//响应拦截器
axios.interceptors.response.use(function (res) {
    if (/ERR_/.test(res.data.code)) {
        return Promise.reject(res);
    }
    return res;
}, function (err) {
    return Promise.reject(err);
});


const resCode = (code, msg) => {
    switch (code) {
        case 'SUCC_200':
            // Vue.prototype.SUCCESS('成功了');
            break;
        default:
            Vue.prototype.WARN(msg);
            break;
    }
}
const QS = require('querystring');
const ajax = async (method,url,params) =>{
    try {
        let res;
        if(method=='post'){
            res = await axios.post(base + url, QS.stringify(params))
        }else if(method == 'get'){
            res = await axios.get(base + url, { params })
        }else if(method == 'upload'){
            res = await axios.post(base + url,  params )
        }
        resCode(res.data.code, res.data.msg);
        return res.data
    } catch (e) {
        if(e.data) {
            resCode(e.data.code, e.data.msg);
            return Promise.reject(e.data);
        }else{
            return Promise.reject(e);
        }
    }
}
const get = (url, params) => ajax('get',url,params)
const post = (url, params) => ajax('post',url,params)
const upload = (url, params) => ajax('upload',url,params)

export default {
    // 前端接口
    getKeyWordsList: (params) => get('/art/keywords', params),
    getTagsList: (params) => get('/art/tags', params),
    artList: (params) => get('/art/list', params),
    getArtById: (params) => get('/art/getArtById', params),
    getHotArt: (params) => get('/art/hotart', params),

    // 后台接口
    login: (params) => post('/bd/login', params),
    upload: (params) => upload('/bd/upload', params),
    addTag: (params) => post('/bd/addTag', params),
    addKeyWord: (params) => post('/bd/addKeyWord', params),
}