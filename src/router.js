import Vue from 'vue'
import VueRouter from 'vue-router';

const Home = r => require.ensure([], () => r(require('./pages/index.vue')));
const searchList = r => require.ensure([], () => r(require('./pages/searchList.vue')));
const article = r => require.ensure([], () => r(require('./pages/article/_id.vue')));
const bdlogin = r => require.ensure([], () => r(require('./pages/bd/login.vue')));
const bdupload = r => require.ensure([], () => r(require('./pages/bd/upload.vue')));


Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Home
        }, {
            path: '/searchList',
            component: searchList
        }, {
            path: '/article/:id',
            component: article
        }, {
            path: '/bd/login',
            component: bdlogin
        }, {
            path: '/bd/upload',
            component: bdupload
        },
        {
            path: '*',
            redirect: '/'
        },
    ]
})