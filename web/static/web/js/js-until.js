function stamptostr(list) {
    var _linex = [];
    for (var n = 0; n < list.x.length; n++) {
        var time = new Date(list.x[n] * 1000);
        var _x = (time.getMonth() + 1) + '-' + time.getDate() + '  ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
        _linex.push(_x);
    };
    line.x = _linex;
}

Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
} 

function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).format("MM/dd/yyyy hh:mm:ss");
}
function getLocalTime1(nS) {
    return new Date(parseInt(nS) * 1000).format("yyyy-MM-dd hh:mm");
}


function getLocalTime2(nS) {
    return new Date(parseInt(nS) * 1000).format("dd日hh:mm");
}

function getLocalTime3(nS) {
    return new Date(parseInt(nS) * 1000).format("MM月dd日hh:mm");
}

function getLocalTime_s() {
    return new Date().format("yyyy-MM-dd hh:mm:ss");
}

var now = new Date(); //当前日期 
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; //

//获得本月的开始日期 
function getMonthStartDate(){ 
return  new Date(nowYear, nowMonth, 1); 

} 
//获得本周的开始日期 
// function getWeekStartDate() { 
// return  new Date(nowYear, nowMonth, nowDay - nowDayOfWeek,1); 
// } 
function getWeekStartDate() { 
return  new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1); 
} 
function getYearStartDate() { 
return  new Date(nowYear,0); 
} 