
var initCalendar = function(uid, bridgeid, href, url) {

    var url = "/calendar/xunjian/task";

    if(bridgeid == undefined) {
        var url = "/calendar/task";
    }

    $('#calendar').empty();
    ///company/bridge/xunjian/info
    //空白的 传bridgeid
    //有数据的 传 bridgeid  type: preview

    $('#calendar').fullCalendar({
        buttonText: {
            prev: ' <i class="icon-chevron-left" title="上一月"></i>',
            next: '<i class="icon-chevron-right" title="下一月"></i>',
            prevYear: '<span class="fc-text-arrow" title="上一年">«</span>',
            nextYear: '<span class="fc-text-arrow" title="下一年">»</span>'
        },
        header: {
            left: 'prevYear,nextYear prev,next today',
            center: 'title',
            right: ''
        },
//        events: {
//            type: 'get',
//            url: url,
//            data: {
//                uid: uid,
//                bridgeid: bridgeid,
//            }
//        },
        events: function(start, end, callback) { // v2: function(start, end, timezone, callback)
            var view = $('#calendar').fullCalendar('getView');
            $.ajax({
                url: url,
                dataType: 'json',
                data: {
                    start:$.fullCalendar.formatDate(view.start, "yyyy-MM-dd"),
                    uid: uid,
                    bridgeid: bridgeid,
                },
                success: function(doc) {
                    callback(doc);
                }
            });
         },
        _events:function(start,end,callback){
            $.get(url+'?start='+start.getTime()/1000+'&bridgeid='+bridgeid+'&end='+end.getTime()/1000,function(rs){
                rs = eval(rs);
                $(rs).each(function(i,item){
                    item.title = item.tasks.length;
                })

                callback(rs);
            })
        },
        eventClick: function(calEvent, jsEvent, view) {
            var date = calEvent.start;
            if(href) {
                var h = href + '&addon=' + new Date(date).getTime() + '&type=preview' + '&uid=' + uid;
                location.href = h;
            }
        },
        dayClick: function(date, jsEvent, view) {
            if(href) {
                var h = href + '&addon=' + new Date(date).getTime();
                location.href = h;
            }
        },
        defaultView:'month',
        viewDisplay: function (view) {//动态把数据查出，按照月份动态查询
//            view.visEnd = view.end;
//            view.visStart = view.start;
            setFocusDays('calendar', view);
        }
    });
}


//usage
//displayed by the args of the class man
//if pass uid, see the man's calendar
//if pass uid and bridgeid, see the bridge's calendar
//if pass calendarHref, click it can location to xunjianinfo page
var uid, bridgeid, calendarHref;

$('body').on('click','.man',function(event) {
    uid = $(this).attr('uid');
    bridgeid = $(this).attr('bridgeid');
    calendarHref  = $(this).attr('href');
    $('#modal-calendar').modal('show');
});

$('#modal-calendar').on('shown.bs.modal',function(){
    var that = this;
    initCalendar(uid,bridgeid,calendarHref);

    if(bridgeid != undefined) {
        // $('#calendar-detail').show();
        var data = SmartData.getBridgeOneInfo(bridgeid);
        var obj = {};
        obj['calendar_bridge_name'] = data.name;
        obj['calendar_xunjry_name'] = data.xunjry_name;
        obj['calendar_xunjzq'] = data.xunjzq;
        obj['calendar_xunjian_lasttime'] = data.xunjian_lasttime;
        obj['calendar_yanghdj_name'] = data.yanghdj_name;
        obj['calendar_yanghlb_name'] = data.yanghlb_name;

        $.each(obj, function(index, val) {
             $('#' + index).text(val);
        });

        $('.fc-header-title').append($('#calendar-detail').clone().removeAttr('id').removeClass('hide'));

    }

})

$('#modal-calendar').on('hide.bs.modal', function(){
    $('#calendar').fullCalendar('destroy');
});

function setFocusDays(calendarID, view) {
    // 非本月日期不显示
    var month = $.fullCalendar.formatDate(view.start, "yyyy-MM");
    $("#"+calendarID).find('.fc-day').each(function() {
        var _date = $(this).attr('data-date');
        if(_date.indexOf(month) == -1)
        {
            $(this).find('.fc-day-number').text('　');
        }
    });
}