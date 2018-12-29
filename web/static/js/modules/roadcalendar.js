
var initCalendar = function(uid, roadid, href, url) {

    var url = "/calendar/road/xunjian/task";

    if(roadid == undefined) {
        var url = "/calendar/task";
    }

    $('#calendar').empty();
    ///company/road/xunjian/info
    //空白的 传roadid
    //有数据的 传 roadid  type: preview

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
        events: {
            type: 'get',
            url: url,
            data: {
                uid: uid,
                roadid: roadid
            }
        },
        eventClick: function(calEvent, jsEvent, view) {
            var date = calEvent.start;
            if(href) {
                var h = href + '&addon=' + new Date(date).getTime()/1000 + '&type=preview' + '&uid=' + uid;
                location.href = h;
            }
        },
        dayClick: function(date, jsEvent, view) {
            if(href) {
                var h = href + '&addon=' + new Date(date).getTime()/1000;
                location.href = h;
            }
        }

    });

}


//usage
//displayed by the args of the class man
//if pass uid, see the man's calendar
//if pass uid and roadid, see the road's calendar
//if pass calendarHref, click it can location to xunjianinfo page
var uid, roadid, calendarHref;

$('body').on('click','.man',function(event) {
    console.log(1);
    uid = $(this).attr('uid');
    roadid = $(this).attr('roadid');
    calendarHref  = $(this).attr('href');
    $('#modal-calendar').modal('show');
});

$('#modal-calendar').on('shown.bs.modal',function(){
    var that = this;
    initCalendar(uid,roadid,calendarHref);

    if(roadid != undefined) {
        // $('#calendar-detail').show();
        $.post('/company/road/one',{'roadid':roadid},function(rs){

            var data = rs.data;
            var obj = {};
            obj['calendar_road_name'] = data.name;
            obj['calendar_xunjry_name'] = data.xunjry_name;
            obj['calendar_xunjzq'] = data.xunjzq+'(天)';
            obj['calendar_xunjian_lasttime'] = data.xunjian_lasttime;
            obj['calendar_yanghdj_name'] = data.daolyanhdj_name;
            obj['calendar_yanghlb_name'] = data.daollb_name;

            $.each(obj, function(index, val) {
                 $('#' + index).text(val);
            });

            $('.fc-header-title').append($('#calendar-detail').clone().removeAttr('id').removeClass('hide'));

        })


    }

})

$('#modal-calendar').on('hide.bs.modal', function(){
    $('#calendar').fullCalendar('destroy');
});


