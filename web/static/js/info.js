$(function(){
     $('.info-date').daterangepicker({
        format: 'YYYY-MM-DD',
        locale: {
            applyLabel: "确定",
            cancelLabel: "取消",
            fromLabel: "开始时间",
            toLabel: "结束时间",
            weekLabel: "周",
            firstDay: 1
        },
        ranges: {
            '本月': [moment().startOf('month'), moment()],
            '本年': [moment().startOf('year'), moment()]
         },
         startDate: moment().subtract('days', 29),
         endDate: moment()
    });

	$('li').click(function(event) {
        if($(this).hasClass('disabled')){
            return false;
        }
    });

    //get all url args object form html
    $('.page a').click(function(event) {
        //var args = eval( "(" + $("#args").text() + ")" );
        var href = $(this).attr('href');
        //delete args.page_index;
        //var url = $.param(args);
        location.href = href + '&' + $("#args").text();
        return false;
    });

    // $('.info-date').mask('9999-99-99-9999-99-99');

    $('.info-submit').click(function(event) {
    	var obj = {};
        var date = $('.info-date').val();
        var url = $(this).attr('url');

        if ($('#input-key').val()) {
            obj.key = $('#input-key').val();
        }
    	obj.guanldw = $('#sel-gover').find('option:selected').val();
    	obj.yanghdw = $('#sel-company').find('option:selected').val();
        obj.status = $('#sel-status').find('option:selected').val();
        obj.name = $('#inupt_name').val();
        if ($('#sel-flag').find('option:selected').val()) {
            obj.flag = $('#sel-flag').find('option:selected').val();
        }
        // obj.flas = $('#sel-flags').find('option:selected').val();

        if(date == '' || date == undefined) {

        } else {
            obj.start = $.trim(date.split(' - ')[0]);
            obj.end = $.trim(date.split(' - ')[1]);
        }

        location.href = url + '?' + $.param(obj);
    });


})