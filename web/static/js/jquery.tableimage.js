/**
 * jquery table 图片显示插件
 *  td 内显示图片图标, 鼠标放上去后; 显示图片放大图
**/
(function($) {        
    $.fn.tableimage = function() {      
        var img_preview = $('#img-preview');
        if(img_preview.length==0){
            img_preview = $('<div>').attr('id', 'img-preview');
            img_preview.css({
                position: 'absolute',
                'z-index': 1000000,
                width: '400px',
                height: '430px',
            });   
            $('body').append(img_preview);  
        }

        var winheight = $(window).height();

        return this.each(function() {     
            
            var hoverTimeout;
            $(this).on('click','.imageitem',function(){
                var url = $(this).attr("imgurl");
                 window.open(url);                                            
            });          
            $(this).on('mouseover','.imageitem',function(){
                console.log('mouseover');   
                var wxiamge = $(this).attr("wx");             
                var url = $(this).attr("imgurl");
                if(!url){
                    return;
                }
                var offset = $(this).offset();
                hoverTimeout = setTimeout(function(){
                    var top = offset.top-200;
                    if((winheight-top)<400){
                        top = offset.top-400-20;
                    }
                    if(wxiamge){
                        $("#img-preview").css({left: offset.left-400, top: top});                                                                                    
                    }else{
                        $("#img-preview").css({left: offset.left+10, top: top});                
                    }
                    $("#img-preview").html("<img src='"+url+"' width='400' height='400' />");   
                    $("#img-preview").removeClass("hide"); 
                }, 500);
            })

            $('body').on('mouseout',$(this),function(){
                clearTimeout(hoverTimeout);
                $("#img-preview").html("");
                $("#img-preview").addClass("hide");
            })
        });     
    };      
})(jQuery);     


