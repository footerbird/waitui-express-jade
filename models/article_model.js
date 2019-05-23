var article={
    //获取资讯列表
    get_articleList: 'select article_id,article_title,thumb_path,article_lead,article_tag,author_id,create_time from article_info where status = 1 order by create_time desc limit ?,?',
    //根据category获取资讯列表
    get_articleListByCategory: 'select article_id,article_title,thumb_path,article_lead,article_tag,author_id,create_time from article_info where status = 1 and article_category = ? order by create_time desc limit ?,?',
    //文章搜索列表
    get_articleSearch: 'select article_id,article_title,thumb_path,article_lead,article_tag,author_id,create_time from article_info where status = 1 and article_content like ? order by create_time desc limit ?,?',
    //获取文章分类信息
    get_articleCategory: 'select category_type,category_name from article_category order by category_order asc',
    //获取推荐阅读列表
    get_articleRecommend: 'select article_id,article_title,thumb_path,article_lead,article_tag,author_id,create_time from article_info where status = 1 order by article_read desc limit ?,?',
    //热搜词列表
    get_articleHotword: 'select hotword_name,COUNT(hotword_name) as hotword_count from article_hotword where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(create_time) group by hotword_name order by hotword_count desc limit ?,?',
    //根据作者id获取作者信息
    get_authorinfoById: 'select * from article_author where author_id = ?',
    //根据文章id获取文章信息
    get_articleDetail: 'select * from article_info where article_id = ?',
}

module.exports=article;