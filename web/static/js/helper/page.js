/*
 * http分页插件
 */

/*example------------------------------
    var setting = {
        page_num: data.page.page_num,
        page_index: 1,
        page_size: 7,
        page_num_show: 5,
        bind_args: {
            url: urlMap.bridgeXunjianCollect,
            toPlace: 'xunj-table',
            data: data, //假如传入了第一次需要放入的页面，则初次加载不会分两次请求分页数据和页面数据
            args : {
	
			}
        }
    };

    $('#xunj-page-btns').page(setting);
---------------------------------------*/

/* warnging-----------------------------
 * 
 * .pagebtn.active 为当前页面,请自行写样式
 * 页面请求的数据请放在data.data里
 * page_index从1开始
------------------------------------- */

(function($){

	// setting 配置数据， 
	// generalDataFirst 是否在第一次初始化分页控件时，加载分页数据
	$.fn.page = function(setting, notGeneralDataFirst) {

		notGeneralDataFirst = notGeneralDataFirst || false;

		var elem = this;

		var placeholder = elem; //容器
		var showAll = setting.showAll || false;
		var page_num = setting.page_num; // 页面数量
		var page_index = setting.page_index || 1;   //当前页
		var page_size = setting.page_size || 10;        //页面大小
		var page_num_show = setting.page_num_show || 5; //分页显示最大值，分页太多时做数量限制
		/* ---------------------
		 	bind_args: {
				url: String,
				toPlace: String,(id without '#')
				args : {
		
				}
			}
		------------------------*/
		var bind_args = setting.bind_args;  //绑定的需要传递的参数 json

		$(elem).empty();

		if (showAll) {
			$.get(bind_args.url + '?findall=1', function(data){
				$(placeholder).append(data.data);
			});
		} else {
			//循环分页
			if (page_num > 1) {
				for (var i = 1; i <= page_num && i<= page_num_show; i++) {
	                var $tmp = $('<button class="btn pagebtn"></button>');
	                
	                $tmp.text(i);
	                $tmp.attr('page_index', i);
	                $tmp.attr('page_size', page_size);

	                //绑定url和参数
	                $(elem).attr('url', bind_args.url);
	                $(elem).attr('toPlace', bind_args.toPlace);

	                if(bind_args.args) {
		                var arg = [];
		                $.each(bind_args.args, function(k, v){
		                	arg.push(k + ':' + v);
		                });
		                arg = arg.join('|');
		                $tmp.attr('arg', arg);
	                }

	                //当前页
	                if (i == page_index) $tmp.addClass('active');
	                $(elem).append($tmp);
	            }
			}

			var toPlace = $(elem).attr('toPlace');

			if(toPlace && toPlace.charAt(0) != '#') {
				toPlace = '#' + toPlace;
			}

			//分页事件按钮注册
			$(elem).on('click', '.pagebtn', function(){

				var that = this;
				var url = $(elem).attr('url');
				var page_index = $(this).attr('page_index');
				var page_size = $(this).attr('page_size');

				//将要传递的参数拼装成字符串绑定在arg属性里
				var arg = $(this).attr('arg') ? $(this).attr('arg').split('|') : '';
				
				var data = {};

				data.page_index = page_index;
				data.page_size = page_size;

				$.each(arg, function(i, v){
					var arr = v.split(':');
					data[arr[0]] = arr[1];
				});

				//放置页面数据,
				$.get(url, data,function(data){
					$(that).addClass('active').siblings('.pagebtn').removeClass('active');
					$(toPlace).empty().append(data.data);
				});
			});
			
			if(!notGeneralDataFirst) {
				if(setting.bind_args.data) {
					$(setting.bind_args.toPlace).empty().append(setting.bind_args.data);
				} else {
					$(elem).find('.pagebtn:eq(' + (parseInt(page_index)-1) + ')').click();	
				}
			}

		}

	};

})(jQuery);