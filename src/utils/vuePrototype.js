// import Vue from 'vue';
import AJAX from '../ajax'



export default {
    install: (Vue, options) => {
        Vue.prototype.PROXY_HEAD = process.env.NODE_ENV ==='development' ? '/api' : '';

        Vue.prototype.AJAX = AJAX;

        Vue.prototype.SUCCESS = (str) => {
            Vue.prototype.$message({
                type: 'success',
                showClose: true,
                message: str
            })
        };
        Vue.prototype.WARN = (str) => {
            Vue.prototype.$message({
                type: 'warning',
                showClose: true,
                message: str
            })
        };
        Vue.prototype.ERR = (str, callback) => {
            Vue.prototype.$alert(str, '提示', {
                confirmButtonText: '确定',
                callback
            });
        };
        Vue.prototype.ASK = (str, Ycb, Ncb) => {
            Vue.prototype.$confirm(str, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Ycb();
            }).catch(() => {
                Ncb();
            });
        };

        Vue.prototype.DATE_FORMATE = (TimeNum) => {
            if(TimeNum-0 != TimeNum) return TimeNum
            var date = new Date(Number(TimeNum));
            var Y = date.getFullYear();
            var M = (date.getMonth()+1)<10?('0'+date.getMonth()):(date.getMonth()+1);
            var D = date.getDate()<10?('0'+date.getDate()):date.getDate();
            return Y+'-'+M+'-'+D
        };
    }
}