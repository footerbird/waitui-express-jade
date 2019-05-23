//验证
var Valid = function(){
    var methods = {};
    methods.isUrl = function(str){//验证域名合法
        return /^(http:\/\/)?(www\.)?.+\..+$/.test(str);
    };

    methods.isEmail = function(str){//验证邮箱
        return /^.+@.+\.[\w]{2,4}$/.test(str);
    };

    methods.isMobile = function(str){//验证手机号码
        return /^1[3|4|5|6|7|8][0-9]\d{8}$/.test(str);
    };

    methods.isCode6 = function(str){//验证手机验证码，6位数字
        return /^\d{6}$/.test(str);
    };

    methods.isInt = function(str){//验证正整数
        return /^\d+$/.test(str);
    };

    methods.isNumber = function(str){//验证是否是数字（包括负数和小数）
        return /^(-)?\d+(\.\d+)?$/.test(str);
    };

    methods.isCardNo = function(str){//验证身份证号码
        var len = str.length;
        if(len == 15){
            return /^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/.test(str);
        }else if(len == 18){
            return /^(\d{6})(19|20)(\d{2})((0\d)|(1[0-2]))(([0-2]\d)|(3[0-1]))(\d{3})(\w)$/.test(str);
        }else{
            return false;
        }
    };

    methods.isCnChar = function(str){//验证中文
        return /^[\u4e00-\u9fa5]+$/.test(str);
    };

    methods.isEqualto = function(str1,str2){//验证一致性
        return str1 === str2?true:false;
    };

    return methods;
}();


//placeholder浏览器兼容(添加label方式)
var placeHolder = (function(){
    var methods = {};
    methods.init = function(){
        var $ele = $("input[data-placeholder]");
        $ele.each(function(){
            var $this = $(this),
                id = this.id,
                placeholder = $(this).data("placeholder");

            var fontSize = $this.css("font-size"),
                lineH = $this.css("height");

            if($this.parent().attr("id")){
                var pid = $this.parent().attr("id");
                if(pid.indexOf("wrap_") == 0){//表示已经添加过父元素了
                    $this.parent().find("label.place-label").remove();
                    $(this).parent().removeAttr("id");
                }
            }

            $this.wrap('<div id="wrap_'+id+'"></div>');
            var $parent = $("#wrap_"+id);
            $parent.css("position","relative");
            var options = {
                "position"      : "absolute",
                "left"          : "10px",
                "top"           : "0",
                "color"         : "#999",
                "font-weight"   : "normal",
                "margin-bottom" : "0",
                "font-size"     : fontSize,
                "line-height"   : lineH,
                "cursor":"auto"
            };

            if($this.data("options")){
                $.extend(true, options, eval('(' + $this.data("options") + ')'));
            }

            var $label = $('<label class="place-label" for="'+id+'">'+placeholder+'</label>');
            $label.css(options);
            $parent.append($label);

            if($this.val() == ""){
                $label.show();
            }else{
                $label.hide();
            }

            $this.on("focus blur keyup",function(){
                if($this.val() == ""){
                    $label.show();
                }else{
                    $label.hide();
                }
            }).on("keydown",function(){
                $label.hide();
            })
        })
    }

    methods.init();
    return methods;
})();


/* 弹出框alert,confirm调用方法示例
 * $(".btn").on("click",function(){
      Pop.alert({
          content : "手机号码不能为空！",
          type    : 0,
          yes     : function(){
              Pop.confirm("确定删除该手机号？",function(){
                  Pop.alert("手机号码删除成功！",function(){},'删除成功',6)
              })
          }
      });
  })*/
var Pop = (function(){//弹出框
    var methods = {},$obj;
    methods.open = function(id){
        if(typeof($obj) != "undefined" && $obj.is(':visible')){
            methods.exit();
        }
        $("body").append('<div class="upwin-mask"></div>');
        $obj = $("#"+id);
        resetpop($obj);
    }

    methods.exit = function(){//open方法的关闭
        $obj.hide();
        $(".upwin-mask").remove();
        if($(".wrap-upwin").length > 0){
            $("body").append($obj);
            $(".wrap-upwin").remove();
        }
    }

    methods.alert = function(){
        var options = {
            content : 'hello world!',
            yes     : function(){},
            title   : '提示',
            type    : ''//默认没有图标,只有type为数字是才有图标,0感叹，1正确，2错误，3问号，4锁定，5哭脸，6笑脸
        }
        if(typeof(arguments[0]) == "object"){
            $.extend(true, options, arguments[0]);
        }else{
            options.content = arguments[0];
            if(arguments[1] && typeof(arguments[1]) == "function"){
                options.yes = arguments[1];
            }
            if(arguments[2] && arguments[2] != ""){
                options.title = arguments[2];
            }
            if(arguments[3] && typeof(arguments[3]) == "number"){
                options.type = arguments[3];
            }
        }
        
        $("#alert").remove();
        var type_str = typeof(options.type) == "number"?'<i class="alert-ico alert-ico'+options.type+'"></i>':'';
        var alert_str = '<div id="alert" class="upwin" style="min-width:260px;">'+
                            '<div class="upwin-title">'+options.title+'<a href="javascript:;" class="upwin-title-close" onclick="Pop.exit();"></a></div>'+
                            '<div class="upwin-content">'+
                                '<div style="padding:20px 0;font-size:14px;line-height:24px;word-break:break-all;">'+type_str+options.content+'</div>'+
                                '<div style="text-align:right;padding:0 0 12px;"><a href="javascript:;" class="alert-btn0">确定</a></div>'+
                            '</div>'+
                        '</div>';
        $("body").append(alert_str);
        methods.open("alert");
        $("#alert").find(".alert-btn0").off("click").one("click",function(){
            methods.exit();
            options.yes();
        })
    }
    
    methods.confirm = function(){
        var options = {
            content : 'hello world!',
            yes     : function(){},
            cancel  : function(){},
            title   : '提示'
        }
        if(typeof(arguments[0]) == "object"){
            $.extend(true, options, arguments[0]);
        }else{
            options.content = arguments[0];
            if(arguments[1] && typeof(arguments[1]) == "function"){
                options.yes = arguments[1];
            }
            if(arguments[2] && typeof(arguments[2]) == "function"){
                options.cancel = arguments[2];
            }
            if(arguments[3] && arguments[3] != ""){
                options.title = arguments[3];
            }
        }
        
        $("#confirm").remove();
        var confirm_str = '<div id="confirm" class="upwin" style="min-width:260px;">'+
                            '<div class="upwin-title">'+options.title+'<a href="javascript:;" class="upwin-title-close" onclick="Pop.exit();"></a></div>'+
                            '<div class="upwin-content">'+
                                '<div style="padding:20px 0;font-size:14px;line-height:24px;word-break:break-all;"><i class="alert-ico alert-ico3"></i>'+options.content+'</div>'+
                                '<div style="text-align:right;padding:0 0 12px;"><a href="javascript:;" class="alert-btn0">确定</a><a href="javascript:;" class="alert-btn1">取消</a></div>'+
                            '</div>'+
                        '</div>';
        $("body").append(confirm_str);
        methods.open("confirm");
        $("#confirm").find(".alert-btn0").off("click").one("click",function(){
            methods.exit();
            options.yes();
        })
        $("#confirm").find(".alert-btn1").off("click").one("click",function(){
            methods.exit();
            options.cancel();
        })
    }
    
    methods.msg = function(str,callback){
        var msg_str = '<div id="msg" style="position:fixed;z-index:1001;left:50%;top:50%;min-width:100px;background-color:rgba(0,0,0,.6);-webkit-animation-duration: .3s;animation-duration: .3s;-webkit-animation-fill-mode: both;animation-fill-mode: both;">'+
                          '<div style="padding:10px 25px;text-align:center;line-height:24px;font-size:14px;color:#fff;">'+str+'</div>'+
                      '</div>';
        $("body").append(msg_str);
        $("#msg").addClass("zoomIn");
        resetpop($("#msg"));
        setTimeout(function(){
            $("#msg").remove();
            callback();
        },1000)
    }

    function resetpop($ob){
        //外部宽度（默认包括补白和边框）,计算边距在内
        var curDivWidth = $ob.width();
        var curDivHeight = $ob.height();
        if(curDivHeight > $(window).height()){
            $ob.wrap('<div class="wrap-upwin"></div>');
            $ob.css({
                "margin-left"   : -curDivWidth/2,
                "top"           : 0,
                "margin-top"    : "40px",
                "margin-bottom" : "40px"
            }).show();
        }else{
            $ob.css({
                "margin-left" : -curDivWidth/2,
                "margin-top"  : -curDivHeight/2
            }).show();
        }
    }

    return methods;

})();


//倒计时发送
function sendCode(obj,seconds,phone,errorId){
    var $this = $(obj), wait = seconds;
    if($this.hasClass("forbid")){
        return;
    }
    $.ajax({
        type:"post",
        data:{
            phone:phone
        },
        url:"/waitui/Index_controller/send_smsCodeAjax",
        async:true,
        dataType:"json",
        success:function(data){
            if(data.state == "success"){
                $this.addClass("forbid");
                time();
            }else{
                $("#"+errorId).text(data.msg);
            }
        }
    });

    function time(){
        wait--;
        if(wait<0){
            $this.removeClass("forbid").text("获取验证码");
            return false;
        }
        $this.text("发送成功("+wait+")");
        
        setTimeout(function(){
            time();
        },1000);
    }
}


//表格全选
function checkAll(boxId,allId1,allId2){
    var $box = $("#"+boxId),$allCheck1 = $("#"+allId1),$allCheck2 = $("#"+allId2);
    var $checkList = $box.find("input[type=checkbox]").not("#"+allId1+",#"+allId2+",:disabled");
    $allCheck1.on("click",function(){
        $checkList.prop("checked",this.checked);
        $allCheck2.prop("checked",this.checked);
    })
    $allCheck2.on("click",function(){
        $checkList.prop("checked",this.checked);
        $allCheck1.prop("checked",this.checked);
    })
    $checkList.on("click",function(){
        if($checkList.length == $checkList.filter(":checked").length){
            $("#"+allId1+",#"+allId2).prop("checked",true);
        }else{
            $("#"+allId1+",#"+allId2).prop("checked",false);
        }

    })
}


function onlyInt(obj){//只能输入正整数
    var $this = $(obj);
    $this.val(isNaN(parseInt(obj.value))?"":parseInt(obj.value));
}


//图片懒加载
function lazyLoading(){
    $("img[data-src]").slice(0,20).each(function(){
        var $this = $(this);
        if(($(window).scrollTop()+$(window).height())>$this.offset().top){
            $this.attr("src",$this.data("src")).removeAttr("data-src");
        }
    })
}


//仿marquee走马灯效果
function showMarquee(id,time){
    var wait = time?time:25;
    var scroll = document.getElementById(id);
    var scrollIndex;
    scrollIndex = setInterval(function(){
        if(scroll.scrollTop == scroll.scrollHeight-scroll.clientHeight){
            scroll.scrollTop = 1;
        }
        scroll.scrollTop+=1;
    },wait);
    $(scroll).on("mouseover",function(){
        clearInterval(scrollIndex);
    }).on("mouseout",function(){
        scrollIndex = setInterval(function(){
            if(scroll.scrollTop == scroll.scrollHeight-scroll.clientHeight){
                scroll.scrollTop = 1;
            }
            scroll.scrollTop+=1;
        },wait);
    })
}

//返回顶部
var scrollTop = function(id){
    var $toTopBar = $("#"+id);
    
    if($(window).scrollTop()>100){
        $toTopBar.show();
    }else{
        $toTopBar.hide();
    }
    
    $(window).on("scroll",function(){
        if($(window).scrollTop()>100){
            $toTopBar.slideDown();
        }else{
            $toTopBar.slideUp();
        }
    })
    
    $toTopBar.on("click",function(){//点击返回顶部
        $("html,body").animate({scrollTop:0},500);
    })
}
