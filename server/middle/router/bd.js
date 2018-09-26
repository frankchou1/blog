

const EXPRESS = require('express');
const MYSQL = require('mysql');
const uploadAny = require('multer')({ dest: './www/upload' }).any();
const { ERR, SUCCESS } = require('../resTemp.js');
const FS = require('fs');
const PATH = require('path');
const rootPath = PATH.join(__dirname,'../../');
// 连接池(数据库)
const db = MYSQL.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'frank_blog'
})
// console.log(db)
const CN = (cb,res)=>{
    db.getConnection(function (err, connection) {
        if (err) {
            return res.status(500).end()
        }
        connection.beginTransaction(function (err) {
            if (err) {
                return res.status(500).end()
            }
            cb(connection);
        })
    })
}

module.exports = function () {
    let router = EXPRESS.Router();






    // 公共访问
    router.use(/\/?!(login)/, (req, res, next) => {
        let q = req.query;
        // console.log(req.session['userInfo'])
        if (req.session['userInfo']) {
            next();
        } else {
            // res.clearCookie(name[, options])
            req.session['userInfo'] = null;
            res.send(ERR(307)).end();
        }
    })








    // 
    /**
     * 后台登陆
     * user
     * pwd
     */
    router.post('/login', (req, res, next) => {
        let q = req.body;
        console.log(q)
        if (q.user == '' || q.pwd == '') return res.send(ERR(401));
        db.query(`SELECT * FROM user_table WHERE userName="${q.user}" LIMIT 1`, (err, data) => {
            if (err) {
                res.status(500).send(ERR(400, err)).end();
            } else {
                if (data.length == 0) return res.send(ERR(305)).end();
                if (data[0].pwd !== q.pwd) return res.send(ERR(306)).end();
                req.session['userInfo'] = data[0];
                res.send(SUCCESS(200, {})).end();
            }
        });
    })








    // 增加关键字
    /**
     * keyword
     */
    router.post('/addKeyWord', (req, res) => {
        let q = req.body;
        db.query(`SELECT * FROM key_table WHERE keyword="${q.keyword}" LIMIT 1`, (err, data) => {
            if (err) { res.status(500).end(); }
            else {
                if (data.length < 1) {//没有重复数据
                    db.query(`INSERT INTO key_table (keyword) VALUES("${q.keyword}")`, (err1, data1) => {
                        if (err1) {
                            res.status(500).end();
                        } else {
                            db.query(`SELECT * FROM key_table WHERE key_id="${data1.insertId}" LIMIT 1`, (err2, data2) => {
                                if (err2) { res.status(500).end(); }
                                else {
                                    res.send(SUCCESS(200, data2[0]));
                                }
                            })
                        }
                    });
                } else {//要添加的数据重复
                    res.send(ERR(400, '该关键字已存在'));
                }
            }
        })
    })







    // 增加分类
    /**
     * tag
     */
    router.post('/addTag', (req, res) => {
        let q = req.body;
        db.query(`SELECT * FROM tag_table WHERE tag="${q.tag}" LIMIT 1`, (err, data) => {
            if (err) { res.status(500).end(); }
            else {
                if (data.length < 1) {//没有重复数据
                    db.query(`INSERT INTO tag_table (tag) VALUES("${q.tag}")`, (err1, data1) => {
                        if (err1) {
                            res.status(500).end();
                        } else {
                            db.query(`SELECT * FROM tag_table WHERE tag_id="${data1.insertId}" LIMIT 1`, (err2, data2) => {
                                if (err2) { res.status(500).end(); }
                                else {
                                    res.send(SUCCESS(200, data2[0]));
                                }
                            })
                        }
                    });
                } else {//要添加的数据重复
                    res.send(ERR(400, '该分类已存在'));
                }
            }
        })
    })









    /**
     * 后台上传文章
     *  title:'',
        keywordsId:[],
        tagsId:[],
        artImg:'',//选填
        article:'',
        date:'',
        author:'',
     */
    router.post('/upload', uploadAny,(req, res, next) => {
        let q = req.body;
        let imgFile = req.files[0];

        if(q.title =='' || q.article=='' || q.date=='' || q.author=='' || q.keywordsId=='' || q.tagsId==''){
            return res.send(ERR(401))
        }

        else CN((connection)=>{
            function saveInfo(pathName = '') {
                // 保存文章
                let nPath = pathName.replace(/^(www)/, '').split('\\').join('/');//不能使用replace(/\\\\/g,'/')
                connection.query(`INSERT INTO art_table 
                    (title,article,img,time,author) 
                    VALUES
                    ("${q.title}","${q.article}","${nPath}","${q.date}","${q.author}")`,async (err, data, fields) => {
                        if (err) {
                            console.log(err)
                            return connection.rollback(function () {
                                if(pathName!="") FS.unlink(rootPath + pathName)
                                res.send(ERR(400, '录入失败'))
                            });
                        } else {
                            // 保存联合表
                            let kwIds = q.keywordsId.split(',');
                            let tIds = q.tagsId.split(',');
                            let noERR = true;
                            for (let i = 0; i < kwIds.length; i++) {
                                for (let l = 0; l < tIds.length; l++) {
                                    await connection.query(`INSERT INTO art_tag_key 
                                        (art_id,tag_id,key_id) 
                                        VALUES
                                        ("${data.insertId}","${tIds[l]}","${kwIds[i]}")`, (err1, results1, fields1) => {
                                            if (err1) {
                                                noERR = false;
                                                console.error(err1)
                                                return connection.rollback(function () {
                                                    if(pathName!="") FS.unlink(rootPath + pathName)
                                                    res.send(ERR(400, '录入失败'))
                                                });
                                            }else {
                                                
                                            }
                                        })
                                }
                            }
                            if(noERR){
                                connection.commit(function (err) {
                                    if (err) {
                                        console.log(err)
                                        return connection.rollback(function () {
                                            if(pathName!="") FS.unlink(rootPath + pathName)
                                            res.send(ERR(400, '录入失败'))
                                        });
                                    }else{
                                        res.send(SUCCESS(200))
                                    }
                                });
                            }
                        }
                    })
            }
            // 保存图片
            if (imgFile) {
                let fileName = imgFile.originalname;//原文件名以及后缀名
                let newPathName = imgFile.path + PATH.extname(fileName);//生成的文件的路径以及文件名+原后缀
                FS.rename(imgFile.path, newPathName, function (err) {
                    if (err) {
                        console.log('图片重命名失败',err)
                        return res.send(ERR(400, '图片录入失败')).end();
                    }else {
                        saveInfo(newPathName)
                    }
                })
            }else{
                saveInfo();
            }
        },res);
    })





    return router;
}
