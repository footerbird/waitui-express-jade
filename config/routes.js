var express = require('express');
var router = express.Router();
//关联主程序
var waitui = require('../controllers/waitui.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    waitui.index(req, res, next);
});

router.get('/article_list.html', function(req, res, next) {
    waitui.article_list(req, res, next);
});

router.post('/get_articleListAjax_tpl', function(req, res, next) {
    waitui.get_articleListAjax_tpl(req, res, next);
});

router.all('/article_search/:keyword', function(req, res, next) {
    waitui.article_search(req, res, next);
});

router.post('/get_articleSearchAjax_tpl', function(req, res, next) {
    waitui.get_articleSearchAjax_tpl(req, res, next);
});

router.get('/article_detail/:article_id.html', function(req, res, next) {
    waitui.article_detail(req, res, next);
});

module.exports = router;
