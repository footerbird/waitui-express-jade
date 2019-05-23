module.exports = {
    format_article_time: function(fmt_time) {
        if(!fmt_time){
            return '';
        }else{
            fmt_time = new Date(fmt_time);
            var diff = new Date() - fmt_time;
            console.log('diff:'+diff);
            if(diff < 60){//小于1分钟
                return '刚刚';
            }else if(diff < 60*60){//大于等于1分钟，小于1小时
                return floor(diff/60)+'分钟前';
                
            }else if(diff < 60*60*24){//大于等于1小时，小于1天
                return floor(diff/3600)+'小时前';
                
            }else if(diff < 60*60*24*4){//大于等于1天，小于4天
                return floor(diff/86400)+'天前';
                
            }else{//大于等于4天，则用年月日表示
                return fmt_time.toLocaleDateString('cn',{year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
            }
        }
    }
}