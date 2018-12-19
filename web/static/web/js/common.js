/**
    common.js

    sensorcmd 时间处理约定:
    1. web 前端显示 格式为 YYYY-MM-DD HH:mm  (eg: 2016-03-24 11:00)
    2. 服务器接口输入时间格式为 10位 时间戳 (eg: 1458787680)

**/

// web前端时间标准格式
var time_format = {
    format:'YYYY-MM-DD HH:mm',
};
var date_format = {
    format:'YYYY-MM-DD',
};

var datepicke_locale = {
    applyLabel: _("确定"),
    cancelLabel: _("取消"),
    fromLabel: _("开始时间"),
    toLabel: _("结束时间"),
    weekLabel: _("周"),
    firstDay: 1,
    customRangeLabel:_('自定义'),
    daysOfWeek: [_('日'),_('一'),_('二'),_('三'),_('四'),_('五'),_('六')],
    monthNames: [_('一月'),_('二月'),_('三月'),_('四月'),_('五月'),_('六月'),_('七月'),_('八月'),_('九月'),_('十月'),_('十一月'),_('十二月')],
}

var datetimerange_locale = $.extend(time_format,datepicke_locale);
var daterange_locale = $.extend(date_format,datepicke_locale);

// 日期选择配置
var datepicker_opt = {}

// 时间选择配置
var datetimepicker_opt = {}

// 日期期间选择配置
var daterangepicker_opt = {
    locale: daterange_locale,
    startDate: moment().subtract(29,'days'),
    endDate:moment(),
    maxDate: new Date()
}

// 时间期间选择配置
var ranges = {};
ranges[_("一小时")] = [moment().subtract(1,'hours'), moment()];
ranges[_("一天")] = [moment().subtract(1,'days'), moment()];
ranges[_("一周")] = [moment().subtract(6, 'days'), moment()];
ranges[_("一月 ")] = [moment().subtract(29, 'days'), moment()];
ranges[_("一年 ")] = [moment().subtract(365, 'days'), moment()];
ranges[_("本年")] = [moment().startOf('year'), moment().endOf('month')];

var datetimerangepicker_opt = {
    timePicker: true,
    timePicker24Hour: true,
    timePickerIncrement: 10,
    locale: datetimerange_locale,
    endDate:moment(),
    maxDate: new Date(),
    ranges: ranges
}

//固定日期选择
var datetimepicker = {
    locale: datetimerange_locale,
    timePicker: true,
    timePicker24Hour: true,
    timePickerIncrement: 10,
    autoclose: true,
    todayBtn: true,
    minuteStep: 10,
    pickerPosition: "bottom-left",
    language: 'zh-CN'
}
