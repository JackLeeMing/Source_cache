
/*
 * 依赖util.js
 * class : smart-select
 * sel : seleted value .
 * 		 if pass 'sel-N' , then the N st option will be seleted
 * arg : the key used in url
 * example
 *
	<select class="smart-select" id="sel-postcode" url="/manage/area/citycode" sel="{{bind_args.get('postcode','')}}" kv="_id|name">
 */

var SmartSelect = {
	init: function() {
		$('.smart-select').each(function(index, el) {

			if ($(el).attr('select-inited')) {
				return true;
			}

			// 绑定在属性的变量
			var url            = $(el).attr('url'), // 数据接口
				selected_value = $(el).attr('sel'),	// 根据该值决定哪个optihon被选择
				path           = $(el).attr('path'), // 取得数据的路径（data.data[pasth]
				kv             = $(el).attr('kv'), // 从获取的数据中，根据kv获取所需数据
				_data           = eval($(el).attr('data')) || {},
				functionName   = $(el).attr('function'), // 获取数据的函数名字
				arg            = $(el).attr('arg'); // 当传入functionName时，可传入参数arg

			// ajax获取数据
			if (url) {
				$.get(url, _data, function(data){
					if (path) {
						data = data.data[path];
					} else {
						data = data.data;
					}

					if (kv) {
						var k = kv.split('|')[0],
							v = kv.split('|')[1];
						data = SmartSelect.format(data, k, v);
					}

					$(el).attr('select-inited', true);
					var val_opt = $(el).find('option').eq(0);
					$(el).find('option').remove();
					//$(el).append("<option value=''>请选择</option>");
					$(el).append(val_opt);
					if ($(el).find("option[value='" + Object.keys(data)[0] + "']").length == 0) {
						$(el).append(util.transferToOptions(data));
					}
					util.setOptionSelected(selected_value, el);
					SmartSelect.initChosen(el);
				});
			// 本地方法获取数据
			} else if (functionName) {
					$(el).attr('select-inited', true);
			var data = eval(functionName)(arg);
				$(el).append(util.transferToOptions(data));
				util.setOptionSelected(selected_value, el);
				SmartSelect.initChosen(el);
			} else {
				$(el).attr('select-inited', true);
				util.setOptionSelected(selected_value, el);
				SmartSelect.initChosen(el);
			}

		});
	},

	// 假如该select含有chosen类，就初始化shosen插件
	initChosen: function(el) {
		if ($(el).hasClass('chosen')) {
			$(el).chosen({disable_search_threshold: 10});
		}
	},

	format: function(data, k, v) {
		var result = {};

		$.each(data, function(index, val) {
	        result[val[k]] = val[v];
	    });

	    return result;
	},

	// el（默认body）下所有的smart-select
	getParams: function(el) {
		el = el || 'body';
		var args = {};

	    $(el).find('.smart-select').each(function(i,item){
	        var val = $(item).val();
	        if(val){
	            args[$(item).attr('arg')] = val;
	        }
	    })

	    return args;
	}
};

SmartSelect.init();
