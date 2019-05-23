$(function(){
//  重置输入框
    $(document).on("click",".form-clear",function(e){
        var $input = $(e.target).siblings(".form-input").val("").focus().trigger("input");
    })
})
