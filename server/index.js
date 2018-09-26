const express = require('express');
const static = require('express-static');
// const expressRoute = require('express-route');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
// const multer = require('multer');
// const mysql = require('mysql');
// const proxy = require('http-proxy-middleware');

// 连接池(数据库)
// const db = mysql.createPool({
//     host:'localhost',
//     user: 'root',
//     password:'123456',
//     database: 'frank_blog'
// })

let server = express();
server.listen(1111);

let keys = ['123','456'];
// for (let i = 0; i < 1000; i++) {
//     keys[i] = 'key_' + Math.random();
// }
// 1.解析cookie
server.use(cookieParser(keys));

//2.使用session
server.use(cookieSession({
    name: 'sess_id',
    keys: keys,
    maxAge: 24 * 60 * 60 * 1000
}));

//3. post数据
server.use(bodyParser.urlencoded({ extended: false }));
// server.use(multer().any());
// 4.接收请求
server.use('/bd/', require('./middle/router/bd')());//后台
server.use('/art/', require('./middle/router/art')());//文章列表

// 5.static数据
server.use(static('./www'))

// 每日更新数据
require('./updata/hot_art.js')();
