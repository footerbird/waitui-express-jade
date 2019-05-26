//实现与mysql交互
var mysql = require('mysql');
var db = require('../config/database.js');
//使用连接池
var pool = mysql.createPool(db.mysql);
var util = require('../util/util.js');

module.exports = {
    //首页
    index: function (req, res, next) {
        res.render('index', { 
            title: '外推网（waitui.com） - 不如把我向外推 | 您的一站式品牌管家' ,
            module: 'home'
        });
    },
    //资讯列表
    article_list: function (req, res, next) {
        pool.getConnection(async function(err, connection) {
            var article_model = require('../models/article_model.js');
            var flash_model = require('../models/flash_model.js');
            
            var queryCategory = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleCategory, function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryList = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleList,[0,10], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryAuthor = function(id){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_authorinfoById,id, function(err, result) {
                        if(result){
                            resolve(result[0].author_name);
                        }
                    })
                })
            }
            
            var queryRecommend = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleRecommend,[0,3], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryHotword = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleHotword,[0,10], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryFlash = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(flash_model.get_flashList,[0,5], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var article_category = await queryCategory();
            var article_list = await queryList();
            for(var i=0; i<article_list.length; i++){
                article_list[i].create_time = util.format_article_time(article_list[i].create_time);
                article_list[i].author_name = await queryAuthor(article_list[i].author_id);
            }
            var article_first = article_list[0],
                article_second = article_list[1],
                article_third = article_list[2];
            article_list.splice(0,3);
            
            var article_recommend = await queryRecommend();
            var article_hotword = await queryHotword();
            var flash_list = await queryFlash();
            for(var i=0; i<flash_list.length; i++){
                flash_list[i].create_time = util.format_article_time(flash_list[i].create_time);
            }
            
            connection.release();// 释放连接
            res.render('article_list', { 
                title: '外推头条 - 专业的品牌资讯分享平台 | 外推网' ,
                module: 'article',
                article_category: article_category,
                article_first: article_first,
                article_second: article_second,
                article_third: article_third,
                article_list: article_list,
                article_recommend: article_recommend,
                article_hotword: article_hotword,
                flash_list: flash_list,
            });
        });
    },
    //资讯列表加载更多（模板加載）
    get_articleListAjax_tpl: function (req, res, next) {
        pool.getConnection(async function(err, connection) {
            var article_model = require('../models/article_model.js');
            //req.params取的是url段的参数，req.query取的是?后的参数，req.body取的是ajax或者说是取你post方法中form里的传来的key value
            var category = req.body.category?req.body.category:'';
            var page = req.body.page?req.body.page:1;
            var repeat = req.body['repeat[]']?req.body['repeat[]']:[];
            var page_size = 10;//单页记录数
            var offset = (page-1)*page_size;//偏移量
            
            var queryList = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleList,[offset,page_size], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryCategoryList = function(cate){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleListByCategory,[cate,offset,page_size], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryAuthor = function(id){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_authorinfoById,id, function(err, result) {
                        if(result){
                            resolve(result[0].author_name);
                        }
                    })
                })
            }
            
            if(category == ''){
                var article_list = await queryList();
            }else{
                var article_list = await queryCategoryList(category);
            }
            
            for(var i=0; i<article_list.length; i++){
                article_list[i].create_time = util.format_article_time(article_list[i].create_time);
                article_list[i].author_name = await queryAuthor(article_list[i].author_id);
            }
            
            if(repeat.length != 0){
                for(var i=0; i<article_list.length; i++){
                    if(repeat.indexOf((article_list[i].article_id).toString()) != -1){
                        article_list.splice(i,1);
                    }
                }
            }
            
            connection.release();// 释放连接
            res.render('tpl_article', { 
                article_list: article_list,
            });
        })
    },
    //资讯搜索
    article_search: function (req, res, next) {
        pool.getConnection(async function(err, connection) {
            var article_model = require('../models/article_model.js');
            var flash_model = require('../models/flash_model.js');
            var keyword = req.params.keyword;
            
            var querySearchList = function(kwd){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleSearch,['%'+kwd+'%',0,10], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryAuthor = function(id){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_authorinfoById,id, function(err, result) {
                        if(result){
                            resolve(result[0].author_name);
                        }
                    })
                })
            }
            
            var queryRecommend = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleRecommend,[0,3], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryHotword = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleHotword,[0,10], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryFlash = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(flash_model.get_flashList,[0,5], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var article_list = await querySearchList(keyword);
            for(var i=0; i<article_list.length; i++){
                article_list[i].create_time = util.format_article_time(article_list[i].create_time);
                article_list[i].author_name = await queryAuthor(article_list[i].author_id);
            }
            
            var article_recommend = await queryRecommend();
            var article_hotword = await queryHotword();
            var flash_list = await queryFlash();
            for(var i=0; i<flash_list.length; i++){
                flash_list[i].create_time = util.format_article_time(flash_list[i].create_time);
            }
            
            connection.release();// 释放连接
            res.render('article_search', { 
                title: '外推头条 - 专业的品牌资讯分享平台 | 外推网' ,
                module: 'article',
                keyword: keyword,
                article_list: article_list,
                article_recommend: article_recommend,
                article_hotword: article_hotword,
                flash_list: flash_list,
            });
        });
    },
    //资讯搜索加载更多（模板加載）
    get_articleSearchAjax_tpl: function (req, res, next) {
        pool.getConnection(async function(err, connection) {
            var article_model = require('../models/article_model.js');
            //req.params取的是url段的参数，req.query取的是?后的参数，req.body取的是ajax或者说是取你post方法中form里的传来的key value
            var keyword = req.body.keyword?req.body.keyword:'';
            var page = req.body.page?req.body.page:1;
            var page_size = 10;//单页记录数
            var offset = (page-1)*page_size;//偏移量
            
            var querySearchList = function(kwd){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleSearch,['%'+kwd+'%',offset,page_size], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryAuthor = function(id){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_authorinfoById,id, function(err, result) {
                        if(result){
                            resolve(result[0].author_name);
                        }
                    })
                })
            }
            
            var article_list = await querySearchList(keyword);
            for(var i=0; i<article_list.length; i++){
                article_list[i].create_time = util.format_article_time(article_list[i].create_time);
                article_list[i].author_name = await queryAuthor(article_list[i].author_id);
            }
            
            connection.release();// 释放连接
            res.render('tpl_article', { 
                article_list: article_list,
            });
            
        })
    },
    //资讯详情
    article_detail: function (req, res, next) {
        pool.getConnection(async function(err, connection) {
            var article_model = require('../models/article_model.js');
            var flash_model = require('../models/flash_model.js');
            var article_id = req.params.article_id;
            
            var queryArticle = function(id){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleDetail,id, function(err, result) {
                        if(result){
                            resolve(result[0]);
                        }
                    })
                })
            }
            
            var queryAuthor = function(id){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_authorinfoById,id, function(err, result) {
                        if(result){
                            resolve(result[0]);
                        }
                    })
                })
            }
            
            var queryRelative = function(category){
                return new Promise(function (resolve, reject) {
                    connection.query(article_model.get_articleListByCategory,[category,0,10], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var queryFlash = function(){
                return new Promise(function (resolve, reject) {
                    connection.query(flash_model.get_flashList,[0,5], function(err, result) {
                        if(result){
                            resolve(result);
                        }
                    })
                })
            }
            
            var article = await queryArticle(article_id);
            article.create_time = util.format_article_time(article.create_time);
            var author_info = await queryAuthor(article.author_id);
            article.author_name = author_info.author_name;
            article.figure_path = author_info.figure_path;
            
            var article_relative = await queryRelative(article.article_category);
            var relative_index = -1;
            for(var i=0; i<article_relative.length; i++){
                if(article_relative[i].article_id == article_id){
                    relative_index = i;
                }
            }
            if(relative_index != -1){
                article_relative.splice(relative_index,1);
            }
            
            var flash_list = await queryFlash();
            for(var i=0; i<flash_list.length; i++){
                flash_list[i].create_time = util.format_article_time(flash_list[i].create_time);
            }
            
            connection.release();// 释放连接
            res.render('article_detail', { 
                title: article.article_title+' | 外推头条' ,
                module: 'article',
                article: article,
                article_relative: article_relative,
                flash_list: flash_list,
            });
        });
    },
}