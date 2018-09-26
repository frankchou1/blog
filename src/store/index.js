import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = () => {
    return new Vuex.Store({
        state: {
            activeAni: 0,//搜索背景动画模式012
            searchRes:{
                data:[],
                total:0
            },
            searchVal:'',
            activeTag: 0,
            activeKeyw: 0,
        },
        mutations: {
            C_(state,{obj,val}){ state[obj] = val;},
            
        }
    })
}

export default store