const EXPRESS = require('express');
const MYSQL = require('mysql');
const {ERR,SUCCESS} = require('../resTemp.js');
// 连接池(数据库)
const db = MYSQL.createPool({
    host:'localhost',
    user: 'root',
    password:'123456',
    database: 'frank_blog'
})


// console.log(db)
module.exports = function () {
    let router = EXPRESS.Router();
    // 文章列表
    /**
     * tagid:Num
     * keyid:Num
     * searchStr:String
     * pageSize:Num
     * curPage:Num
     */
    router.use('/list',(req,res)=>{
        let q = req.query;
        let sql_tagid = q.tagid != 0 &&q.tagid != '' ? `tagid=${q.tagid} AND ` : '';
        let sql_keyid = q.keyid != 0 &&q.keyid != '' ? `keyid=${q.keyid} AND ` : '';
        let sql_searchStr = q.searchStr?`(title LIKE '%${q.searchStr}%' OR art LIKE '%${q.searchStr}%') AND `:''
        let where = "";
        if(sql_tagid != '' || sql_keyid != '' || sql_searchStr != ''){
            where = `WHERE  ${sql_tagid}${sql_keyid}${sql_searchStr}`.replace(/ AND $/,'')
        }
        if((!q.pageSize) || (!q.curPage)) res.send(ERR(401)).end(); 
        db.query(`
            SELECT id,title,art,date,img,
            CONCAT('{',GROUP_CONCAT(CONCAT('\"t',tagid,'\":\"',tag,'\"')),'}') AS tags,
            CONCAT('{',GROUP_CONCAT(CONCAT('\"k',keyid,'\":\"',keyw,'\"')),'}') AS keyws 
            FROM art_view_table
            ${where}
            GROUP BY id 
            LIMIT ${(q.curPage-1)*q.pageSize},${q.pageSize * q.curPage}
        `,(err,data)=>{
            if(err) {
                res.status(500).end();
            }else {
                // console.log(`select COUNT(id) AS total FROM art_view_table ${where}`)
                db.query(`select COUNT(distinct id) AS total FROM art_view_table ${where}`,(err1,data1)=>{
                    if(err1) {
                        res.status(500).end();
                    }else {
                        res.send(SUCCESS(200,{
                            data,
                            total:data1[0].total
                        }));
                    }
                });
            }
        });
        
    })


    // 通过id查文章
    /**
     * id:Num
     */
    router.use('/getArtById',(req,res)=>{
        let q = req.query;
        if(!q.id) res.send(ERR(401)).end(); 

        db.query(`
            SELECT id,title,art,date,
            CONCAT('{',GROUP_CONCAT(CONCAT('\"t',tagid,'\":\"',tag,'\"')),'}') AS tags,
            CONCAT('{',GROUP_CONCAT(CONCAT('\"k',keyid,'\":\"',keyw,'\"')),'}') AS keyws 
            FROM art_view_table
            WHERE id=${q.id}
            LIMIT 1
        `,(err,data)=>{
            if(err) {
                res.status(500).end();
            }else {
                res.send(SUCCESS(200,data[0]));
            }
        });
    })


    // 查询推荐文章(外链)
    router.get('/hotart',(req,res)=>{
        db.query("SELECT * FROM outerArt_table",(err,data)=>{
            if(err) {
                res.status(500).end();
            }else {
                db.query("SELECT COUNT(id) AS total FROM outerArt_table",(err,data1)=>{
                    if(err) {
                        res.status(500).end();
                    }else {
                        res.send(SUCCESS(200,{list:data,total:data1[0]}));
                    }
                });
            }
        });
    })

    // 关键字列表
    router.get('/keywords',(req,res)=>{
        db.query("SELECT * FROM key_table",(err,data)=>{
            if(err) {
                res.status(500).end();
            }else {
                res.send(SUCCESS(200,data));
            }
        });
    })
    


    
    // 分类列表
    router.get('/tags',(req,res)=>{
        db.query("SELECT * FROM tag_table",(err,data)=>{
            if(err) {
                res.status(500).end();
            }else {
                res.send(SUCCESS(200,data));
            }
        });
    })
    

    return router;
}