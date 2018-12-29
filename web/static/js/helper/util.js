if (!window.util) {
    window.util = {};
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
util.add = function(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}

// 设置左边栏导航定位 
util.setNav = function(navClass) {
    $('.nav-kpages ' + navClass).addClass('active').parents('li').addClass('active nav-active open');
}

/*
 * args    example: {0: "特大桥", 1: "大桥", 2: "中桥", 3: "小桥"}
 *                  or [[0, '特大桥'], [1, '大桥'], [2, '中桥'], [3, '小桥']]
 *                  or ['特大桥', '大桥', '中桥', '小桥']
 * return  string '<option></option><option></option>'
 */
util.transferToOptions = function(obj, selectedValue) {
    var opts = '';

    if(!obj) {
        return '';
    }
    var sel = 0;
    $.each(obj, function(index, val) {

        if ($.isArray(obj) && $.isArray(val)) {
            var $opt = $('<option>').val(val[0]).text(val[1]);
            if(val.length >= 3){
                $opt.attr({bci_puci: val[2]});
            }
        } else if ($.isArray(obj)) {
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

util.setOptionSelected = function(selectedValue, selectObj) {
    $(selectObj).find('option').each(function(i, opt){
        if ($(opt).attr('value') === selectedValue ) {
            $(opt).prop('selected', true);
            return true;
        }
    });

    $(selectObj).find('option').each(function(i, opt){
        if ($(opt).text() === selectedValue ) {
            $(opt).prop('selected', true);
            return true;
        }
    });
}


/*
 * based on: http://www.jq22.com/Demo432
 */
util.initTreeAction = function(placeholder) {
    $(placeholder).find('li:has(ul)').addClass('parent_li').find(' > span').attr('title', '闭合');
    $(placeholder).find('li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).attr('title', '展开').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
        } else {
            children.show('fast');
            $(this).attr('title', '闭合').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
        }
    });
};


util.setModalVal = function(modal, name, val) {
    modal.find('input[name="' + name + '"]').val(val);
}

util.getModalVal = function(modal, name) {
    return modal.find('input[name="' + name + '"]').val();
}

// 打印页面中的一部分，传入不带#的id
util.print = function(id) {
    var headstr = "<html><head><title></title></head><body>";  
    var footstr = "</body>";  
    var printData = document.getElementById(id).innerHTML; //获得 div 里的所有 html 数据
    var oldstr = document.body.innerHTML;  
    document.body.innerHTML = headstr+printData+footstr;  
    window.print();  
    document.body.innerHTML = oldstr;  
    return false;
}

util.time = {
    // 获取今年（包括今年）的前n年
    getYears: function(n) {
        var date    = new Date(),
            nowYear = date.getFullYear(),
            years   = [];

        while(n--){
            years.push(nowYear--);
        }

        return years;
    },

    getToday: function(date) {
        var date = date || new Date(),
            nowYear = date.getFullYear(),
            nowMonth = date.getMonth() + 1,
            nowDay   = date.getDate();

        //return [nowYear, nowMonth, nowDay].join('-');
        return date.toISOString().substr(0,10);
    },

    getDayLastMonth: function() {
        var date = date || new Date();
        var month = date.getMonth();

        date.setMonth(month - 1);

        var nowYear = date.getFullYear(),
            nowMonth = date.getMonth() + 1,
            nowDay   = date.getDate();

        //return [nowYear, nowMonth, nowDay].join('-');
        return date.toISOString().substr(0,10);
    },

    getFirstDayOfYear: function() {
        var date = date || new Date();

        date.setMonth(0);
        date.setDate(1);

        var nowYear = date.getFullYear(),
            nowMonth = date.getMonth() + 1,
            nowDay   = date.getDate();

        //return [nowYear, nowMonth, nowDay].join('-');
        return date.toISOString().substr(0,10);
    },

    getFirstDayOfMonth: function() {
        var today = this.getToday().split('-');
        today[2] = '01';
        return today.join('-');
    },

    changeYear: function(date, year) {
        var date = date.split('-');
        date[0] = year;
        return date.join('-');
    }
};

// 根据iframe面body的高度自动调整iframe的高度
util.setIframeAutoHeight = function(iframe, minHeight) {
    var mainheight;

    minHeight = minHeight || 0;
    iframe = iframe || 'iframe';

    $(iframe).load(function(){
       mainheight = $(this).contents().find("body").height()+10;

       mainheight = mainheight < minHeight ? minHeight : mainheight;
       $(this).height(mainheight);
    }); 

    $(window).resize(function(){
        mainheight = $(iframe).contents().find("body").height()+10;
        mainheight = mainheight < minHeight ? minHeight : mainheight;
        $(iframe).height(mainheight);
    });

    return mainheight;
};

util.getJsonLength = function(json) {
    var length = 0;

    $.each(json, function(index, val) {
        length++;
    });
    return length;
}

// 写入cookie
util.setCookie = function(key, v) {
    document.cookie = key + '=' + v;
}

// 按key从cookie中取值
util.getCookie = function(key) {
    var arrCookie = document.cookie.split(';');
   
    for (var i=0; i<arrCookie.length; i++) {

        var arr = arrCookie[i].split('=');

        // arr[0] 前多了一个空格？
        if (key === $.trim(arr[0])) {
            return arr[1];
        }
    }

    // 没有找到返回空字符串
    return '';
};

// 获取modal（modal可放在当前页面或者父页面）， modalId不带#号
util.getModal = function(modalId) {
    return $(document.getElementById(modalId) 
                    || window.parent.document.getElementById(modalId)
                    || window.parent.parent.document.getElementById(modalId));
}

// 获取modal（modal可放在当前页面或者父页面）， modalId不带#号
util.getModal = function(modalId) {
    return $(document.getElementById(modalId) 
                    || window.parent.document.getElementById(modalId)
                    || window.parent.parent.document.getElementById(modalId));
};

util.alert = function(txt) {
    var tmp = '<div class="myalert widget-box light-border" style="opacity: 1;"><div class="widget-header"><h5 class="smaller">桥梁信息管理系统</h5><div class="widget-toolbar no-border"><a href="#" data-action="close"> <i class="icon-remove"></i></a></div></div><div class="widget-body"><div class="widget-main padding-6"><div class="alert"></div><a class="btn btn-sm btn-danger" href="#" data-action="close">确定</a></div></div></div>';

    $tmp = $(tmp);
    $tmp.find('.alert').text(txt);
    $('body').append($tmp);

    $('.myalert a').click(function(event) {
        $('.myalert').css('opacity', '0');
    });
};

// 格式化日期
util.formatTime = function(date, showTime, showMilli, showYear) {
    date = new Date(date);

    if (showYear == undefined) {
        showYear = true;
    }

    var two_digits = function(d) {
        if ((d+"").length==1)
          return "0"+d;
        else
          return d;
    };

    var yy    = date.getFullYear(),
        mm    = two_digits( date.getMonth()+1 ),
        dd    = two_digits( date.getDate() ),
        HH    = two_digits( date.getHours() ),
        MM    = two_digits( date.getMinutes() ),
        SS    = two_digits( date.getSeconds() ),
        Milli = date.getMilliseconds();

    var time = '';

    if (showYear) {
        time = yy+"-";
    }

    time += mm+'-'+dd;

    if (showTime) {
        time +=  ' ' + HH + ':' + MM + ':' +SS;
    }
    if (showMilli) {
        time += ':' + Milli;
    }

    return time;
};
