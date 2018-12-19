/**
 *  JS 实用工具集, 对基础对象的扩展
 *  
 */

/**
 * [ String formator]
 *  Demo1: 'FirstName:{0}-LastName:{1}'.format('comger','mirro')  => 'FirstName:comger-LastName:mirro'
 *  Demo2: 'FirstName:{fname}-LastName:{lname}'.format({fname:'comger',lname:'mirro'})  => 'FirstName:comger-LastName:mirro'
 *  return formated String
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

/**
 * [ Date formator ]
 * Demo : (new Date()).format('YY-MM-DD hh:mm:ss') => '2016-12-23 08:23:15'
 * return formated Date String
 */
Date.prototype.format = function(format){
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return format;
}

var comger_util = {
    isIe: function(){
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            return true;
        } else {
            return false;
        }
    },
    download: function(buffer, filename) {
        filename = filename || 'data';

        if(this.isIe()){
            var IEwindow = window.open();
            IEwindow.document.write('sep=,\r\n' + buffer);
            IEwindow.document.close();
            IEwindow.document.execCommand('SaveAs', true, fileName + ".csv");
            IEwindow.close();
        }else{
            var blob = new Blob([buffer], { type: 'text/csv,charset=utf-8'});
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.style = "visibility:hidden";
            link.download = filename + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};

var validform_conf_reload ={
        ajaxPost: true,
        tiptype:3,
        beforeSubmit: function(curform){
            this.reload = $(curform).attr('reload');
        },
        callback: function(data) {
            var msg = data.msg || data.data;
            if (msg) {
                alert(msg);
            }
            if (data.status && this.reload=='reload') {
                   location.reload();
            }

        }
    }
var validform_conf_tip ={
        ajaxPost: true,
        tiptype:3,
        beforeSubmit: function(curform){
            this.reload = $(curform).attr('reload');
        },
        callback: function(data) {
            var msg = data.msg || data.data;
            if (msg) {
                alert(msg);
            }
            if(data.status){
                alert('修改成功')
            }else{
                alert('原密码输入错误!')
            }
            if (data.status && this.reload=='reload') {
                   location.reload();
            }

        }
    }

    //选中全选反选功能
      $('tbody').on('click', '.ace', function() {
        var flag = true;
        $('tbody .ace').each(function(i, v) {
            if (!$(v).prop('checked')) {
                flag = false;
                return false;
            }
        })
        $('thead .ace').prop({
            checked: flag
        })

        if ($(this).prop('checked')) {
            $(this).parents().parents('tr').addClass('current');

        } else {
            $(this).parents('tr').removeClass('current')
        }

    })

    $('thead').on('click', '.ace', function() {
        if ($(this).prop('checked')) {
            $('tbody .ace').prop({
                checked: true
            })
            $('tbody tr').addClass('current')
        } else {
            $('tbody .ace').prop({
                checked: false
            })
            $('tbody tr').removeClass('current')
        }

    })
//删除数组指定元素
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
        if (index > -1) {
        this.splice(index, 1);
    }
};