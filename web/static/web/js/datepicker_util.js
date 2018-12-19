/**
 *  JS 实用工具集, DatePicker 和 DateRangePicker  的一些常用配置和设置
 *  author comger@gmail.com
 */

var range_conf = {
        timePicker: true,
        timePickerIncrement:10,
        timePickerSeconds:true,
        timePicker24Hour:true,
        maxDate: new Date,
        opens : 'right',
        buttonClasses : [ 'btn btn-pink' ],
        applyClass : 'btn-sm btn-pink-light',
        cancelClass : 'btn-sm',
        format : 'YYYY-MM-DD:mm:ss',
        locale : {
           applyLabel : '确定',
           cancelLabel : '取消',
           fromLabel : '起始时间',
           toLabel : '结束时间',
           customRangeLabel : '自定义',
           daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
           monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
               '七月', '八月', '九月', '十月', '十一月', '十二月' ],
           firstDay : 1
       }
}