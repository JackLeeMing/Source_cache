var SmartData = {};

SmartData.getBridgeOneInfo = function(bridgeid) {
    return SmartData.post(urlMap.bridgeOne, {
        bridgeid: bridgeid
    }).data;
}

SmartData.getBridgeCard = function() {
    var data = SmartData.get(urlMap.bridgeCard).data;
    var obj = {};

    $.each(data, function(index, val) {
        $.each(val[1], function(index, val) {
            obj[val[1]] = val[0];
        });
    });
    return obj;
}

/*
 *args : label
 *return : {0: "特大桥", 1: "大桥", 2: "中桥", 3: "小桥"}
 */
SmartData.getOption = function(label) {

	var data = SmartData.get(urlMap.option, {
        label: label
    }).data;

    return data.options;
}

SmartData.getWuxiPostcode = function() {
    var data = SmartData.get(urlMap.wuxiPostcode).data;
    var result = {};
    $.each(data, function(index, val) {
        result[val.code] = val.name;
    });
    return result;
}

SmartData.getTree = function(_data) {
    var data = SmartData.get(urlMap.tree, _data).data;
    return data;
}

/*
 * return {'53951ecb9e02ec303a9bfb36':'北塘区城市管理局'...}
 */
SmartData.getGoverAndCompanyList = function() {
    var data = SmartData.get(urlMap.company).data;
    var result = {};
    $.each(data, function(index, val) {
        result[val._id] = val.name;
    });
    return result;
}

/*
 * return {'53951ecb9e02ec303a9bfb36':'北塘区城市管理局'...}
 */
SmartData.getGovermentList = function() {
    var data = SmartData.get(urlMap.company, {
        type: 0
    }).data;
    var result = {};
    $.each(data, function(index, val) {
        result[val._id] = val.name;
    });
    return result;
}

/*
 * return {'53951ecb9e02ec303a9bfb36':'北塘区城市管理局'...}
 */
SmartData.getCompanyList = function() {
    var data = SmartData.get(urlMap.company, {
        type: 1
    }).data;
    var result = {};
    $.each(data, function(index, val) {
        result[val._id] = val.name;
    });
    return result;
}

/*
 * return {status:true,data:{...}}
 */
SmartData.getMap = function(json) {
    var data = SmartData.post(urlMap.map, json);
    return data;
}

SmartData.getBridgePartList = function() {
    var data = SmartData.get(urlMap.partList, {
        location: "1"
    }).data;
    var result = {};

    $.each(data, function(index, val) {
        result[val._id] = val.name;
    });
    return result;
}

SmartData.getDiseaseStatusList = function() {
    return {
        0: '未处理',
        1: '持续观察',
        2: '已处理'
    };
}

/*
 * return {'_id':'name', ...}
 */
SmartData.getCompanyUserList = function(companyid) {
    var data = SmartData.post(urlMap.companyUserList, {
        companyid: companyid
    });

    if (data === undefined) {
        return {};
    }

    var result = {};

    $.each(data.data, function(index, val) {
        result[val._id] = val.nickname || val.username;
    });
    return result;
}

/*
 * return : {'bridgeid':'name',...}
 */
SmartData.getBciIds = function() {
    var data = SmartData.get(urlMap.bciIds).data;
    var result = {};

    $.each(data, function(index, val) {
        result[val._id] = val.name;
    });
    return result;
}

SmartData.getXunjianTask = function(bridgeid, start, end, callback) {
    var data = SmartData.get(urlMap.xunjianTask, {
        bridgeid: bridgeid,
        start: start,
        end: end
    }, callback);
    return data;
}

SmartData.getUserGroup = function() {
    return SmartData.get(urlMap.userGroup).data;
}

SmartData.getMessageCount = function() {
    return SmartData.get(urlMap.messageCount).data;
}

SmartData.getBridgeAreaCount = function(type, flag, x, y) {
    return SmartData.get(urlMap.bridgeAreaCount, {
        type: type,
        flag: flag,
        x: x,
        y: y
    });
}

SmartData.getManageBridgeStatis = function(companyType, timeType, contentType) {
    var data = {
        company_type: companyType,
        time_type: timeType,
        content_type: contentType
    }

    return SmartData.post(urlMap.manageBridgeStatis, data);
}

SmartData.getManageBridgeBciStatis = function(data) {
    return SmartData.get(urlMap.manageBridgeBciStatis, data).data;
}

SmartData.getBridgeXunjianStatis = function(data) {
    return SmartData.get(urlMap.bridgeXunjianStatis, data).data;
}

SmartData.getBridgeXunjianMonth = function(bridgeid) {
    return SmartData.get(urlMap.bridgeXunjianMonth, {
        bridgeid: bridgeid
    }).data;
}

SmartData.getBridgeCount = function() {
    return SmartData.post(urlMap.bridgeCount).data;
}

SmartData.getUserCount = function() {
    return SmartData.post(urlMap.userCount).data;
}

SmartData.getDiseaseCount = function() {
    return SmartData.post(urlMap.diseaseCount).data;
}

SmartData.getAreaStatis = function() {
	return SmartData.get(urlMap.areaStatis).data;
}

/*
 * args : placeholder objid , company_type  0 gover 1 company
 */
SmartData.initCompSelect = function(placeholder, company_type, selectedValue) {
    var data;
    switch (company_type) {
        case 0:
            data = SmartData.getGovermentList();
            break;
        case 1:
            data = SmartData.getCompanyList();
            break;
    }
    $(placeholder).append(SmartData.transferToOptions(data, selectedValue));
}

/*
 * args : placeholder objid
 */
SmartData.initAreaSelect = function(placeholder, selectedValue) {
    var data = SmartData.getWuxiPostcode();
    $(placeholder).append(SmartData.transferToOptions(data, selectedValue));
}


/*************core*************/
SmartData.get = function(url, data, callback) {
    var result;

    $.ajax({
        type: "get",
        url: url,
        data: data,
        async: false,
        success: function(data) {
            result = data;
           
            if (callback) {
                callback(result);
            }
        }
    });
    return result;
}

SmartData.getData = function(url, data) {
    var result;

    $.ajax({
        type: "get",
        url: url,
        data: data,
        async: false,
        success: function(data) {
            result = data.data;
        }
    });
    return result;
}

SmartData.post = function(url, data) {
    var result;

    $.ajax({
        type: "post",
        url: url,
        data: data,
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}

SmartData.getJsonLength = function(json) {
    var length = 0;

    $.each(json, function(index, val) {
        length++;
    });
    return length;
}

SmartData.getYear = function() {
	var yearNow = (new Date()).getFullYear();
	var result = [];
	
	for(var i=yearNow; i>=yearNow - 9; i--) {
		result.push(i);
	}

	return result;
}

/*
 * args    example: {0: "特大桥", 1: "大桥", 2: "中桥", 3: "小桥"}
 * return  string '<option></option><option></option>'
 */
SmartData.transferToOptions = function(obj, selectedValue) {
    var opts = '';

    if(!obj) {
    	return '';
    }

    var sel = 0;
    $.each(obj, function(index, val) {

    	if($.isArray(obj)) {
    		var $opt = $('<option>').val(val).text(val);
    	} else {
	        var $opt = $('<option>').val(index).text(val);
    	}

        if (selectedValue == index || selectedValue == 'sel-' + sel) {
            $opt.attr('selected', 'true');
        }
        var strOpt = $('<div>').append($opt).clone().html();
        opts = opts + strOpt;

        sel++;
    });
    return opts;
}

/*
 * args    example: {0: "特大桥", 1: "大桥", 2: "中桥", 3: "小桥"}
 *		   template(jquery object) : need a template which input place value 		   and .lbl place text
 * return  string ''
 */
SmartData.transferToCheckbox = function(json, template, selectedValue) {
    var result = '';

    $.each(json, function(index, val) {

        var $temp = $(template).clone(true);

        $temp.find('input').val(index);
        $temp.find('.lbl').text(val);

        if (selectedValue === index) {
            $($temp.find('input').first()).attr('checked', true);
        }
        var strCheckbox = $('<div>').append($temp).clone(true).html();
        result = result + strCheckbox;
    });
    return result;
}

/*
 * arg : js obj or json data
 */
SmartData.wrapJsonToUrl = function(data, noEscape) {

    var url = '';
    var flag = 0;
    $.each(data, function(index, val) {

        if (val == '' || val == undefined) return true;

        if (!noEscape) {
            val = escape(val);
        }

        if (flag == 0) {
            url = url + index + '=' + val;
        } else {
            url = url + '&' + index + '=' + val;
        }
        flag++;
    });
    return '&' + url;
}

SmartData.initPages = function(placeholder, url, data, callback, arg) {
    var _data = data;
    $.get(url, _data, function(data) {

        var page = data.page;
        var page_index = page.page_index;
        var page_num = page.page_num;

        $(placeholder).empty();

        if (page_num > 1) {
            for (var i = 1; i <= page_num; i++) {
                var $tmp = $('<button class="btn btn-light pagebtn"></button>');
                $tmp.attr('page_index', i).text(i);
                if (i == page_index) $tmp.attr('disabled', 'true').attr('style', 'background:#ffb752!important');;
                $(placeholder).append($tmp);
            }
        }

    });

    $(placeholder).on('click', '.pagebtn', function() {
        var page_index = $(this).attr('page_index');
        callback(arg, page_index);
    });
}
