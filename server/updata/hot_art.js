var cheerio = require('cheerio');
var superagent = require('superagent');
const MYSQL = require('mysql');
const db = MYSQL.createPool({
    host:'localhost',
    user: 'root',
    password:'123456',
    database: 'frank_blog'
})
module.exports = function(){
    console.log(1111)
    function getdata(){
        var arr = [];
        var $=[];
        console.log(222222)
        superagent.get('https://juejin.im/welcome/frontend/').end(function (err, data) {//页面获取到的数据
            if (err) return next(err);
            $[1] = cheerio.load(data.text);//用cheerio解析页面数据
            var page = [];
            console.log(33333)
            $[1]('.info-box').each(function (index, el) {
                var title = $[1](el).find('.info-row.title-row a');
                var author = $[1](el).find('.item.username a');
                page[index] = new Promise((resolve,reject)=>{
                    superagent.get('https://juejin.im'+title.attr('href')).end(function(err,data1){
                        if (err) {
                            console.log(err)
                            return reject(err)
                        }
                        $[2] = cheerio.load(data1.text);
                        resolve({
                            title:title.text(),
                            href:'https://juejin.im'+title.attr('href'),
                            art:$[2]('.article-content').text(),
                            author:author.text(),
                            time: $[2]('.time').text()
                        })
                    })
                })
                
            })
            Promise.all(page).then(val=>{
                console.log(44444)
                arr = val
                db.query(`SELECT title FROM outerArt_table`,(err,data)=>{
                    if(err) console.error(err)
                    else{
                        if(data.length>0){
                            // 数据去重
                            for (let i = 0; i < data.length; i++) {
                                for (let l = 0; l < arr.length; l++) {
                                    if(data[i].title == arr[l].title) arr.splice(l--,1)
                                }
                            }
                        }
                        // 写入
                        for (let i = 0; i < arr.length; i++) {
                            let art = '';
                            // let art = arr[i].art.replace(/\\n/g,'');
                            db.query(`INSERT INTO outerArt_table 
                                (title,article,time,author,href) 
                                VALUES
                                ("${arr[i].title}","${art}","${arr[i].time}","${arr[i].author}","${arr[i].href}")`,(err,data)=>{
                                if(err) console.error(err)
                                else console.log('Bingo')
                            })
                        }
                        
                    }
                })
            })
        })
    }
    getdata();
    setInterval(getdata,24*60*60*1000)
}