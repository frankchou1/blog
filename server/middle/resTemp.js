
class RESBODY{
    static SUCCESS(code,data) {
        let res = {
            code:"SUCC_",
            data,
            msg:''
        }
        switch (code) {
            case 200:
                res.msg = '这是200的msg' 
                break;
            default:
                res.msg = '这是def的msg' 
                break;
        }
        res.code+=code
        return res
    };
    static ERR(code,msg,data) {
        let res = {
            code:'ERR_',
            data,
            msg:''
        }
        switch (code) {
            case 400:
                res.msg = msg;break; 
            case 401:
                res.msg = '参数缺失';break;
            case 305:
                res.msg = '用户不存在';break; 
            case 306:
                res.msg = '密码错误';break; 
            case 307:
                res.msg = '未登录';break; 
            default:
                res.msg = msg;break; 
        }
        res.code+=code
        return res
    }
}

module.exports = RESBODY;