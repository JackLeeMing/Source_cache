/**
  author comger@gmail.com
  jquery delbtn plugin 

  eg: $('.delbtn').delbtn(api,'#modal-delet');

**/

(function($) {        
	$.fn.delbtn = function(api, del_modal, del_btn) {  
		del_modal = del_modal || $('#modal-delet');
		del_btn = del_btn || $('#deletdobtn');
	     	return $(this).each(function(){
	     		$(this).click(function(){
		     		var param = $(this).attr('param');  // _id=xx
	     			$(del_modal).modal('show');
		     		$(del_btn).click(function(){
		     			$.post(api+'?'+param, function(rs){
				                if (rs.status) {
				                    location.reload();
				                }
		     			})
		     		})
	     		})
	     	})
	};      
})(jQuery);      