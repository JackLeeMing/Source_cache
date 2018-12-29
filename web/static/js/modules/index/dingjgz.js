require.config({

    baseUrl: "/static/js",

    paths: {
        "baiduchart": "modules/baiduchart",
        "SmartSelect": "smart_select"
    },

    shim: {
        "SmartSelect": {
            exports: 'SmartSelect'
        }
    }
});

define(['baiduchart', 'SmartSelect'], function(baiduchart, SmartSelect) {


    var initXunjTable = function(companyid, page_index) {
        var _data = {companyid:companyid};

        $.get('/company/bridge/task/collect', _data,function(data) {
            $('#xunj-table').empty().append(data.data);
        });
    }

    function initTime() {
        var end = util.time.getToday();
        var start = util.time.getFirstDayOfMonth();

        $('#datetime-start').val(start);
        $('#datetime-end').val(end);

        $('#xunj-year').change(function(e){
            var year   = $(this).find('option:selected').val(),
                _start = $('#datetime-start').val() || start,
                _end   = $('#datetime-end').val() || end;
            $('#datetime-start').val(util.time.changeYear(_start, year));
            $('#datetime-end').val(util.time.changeYear(_end, year));
        });
    }

    function initPlugin() {
        $('#datetime-start, #datetime-end').datetimepicker({
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            minView: 2
        });
    }

    var init = function() {
        initXunjTable();
        initTime();
        initPlugin();
    };

    $('#xunj-widget').on('click', '.name', function(event) {
        var bridgeid = $(this).parents('tr').attr('bridgeid');

        $.get('/manage/bridge/xunjian/month', {bridgeid: bridgeid}, function(data){
            var data = data.data;

            if(data.length == 0) {
                util.alert('该桥无巡检数据，无法生成统计图!');
            }

            var flow = [], labels = [];
            
            $.each(data, function(index, val) {
                 flow.push(val.rate);
                 labels.push(val.addon);
            });

            drawLine('modal-xunjian-chart', flow, labels);
            $("#modal-xunjian").modal('show');
        });
    });

    // $('#xunj-chaxun').click(function(){
    //     var arg = {
    //         start: $("#datetime-start").val(),
    //         end: $("#datetime-end").val(),
    //         companyid: $('select[name="guanldw"]').val() || $('select[name="yanghdw"]').val() 
    //     };
    //     console.log(arg);

    //     $.get('/company/bridge/task/collect', arg, function(data){
    //         $('#xunj-table').html(data.data);
    //     });
    // });

    $('select[name="guanldw"]').change(function(){
        $('select[name="yanghdw"]').find('option:eq(0)').prop('selected', true);
    });

    $('select[name="yanghdw"]').change(function(){
        $('select[name="guanldw"]').find('option:eq(0)').prop('selected', true);
    });
    
    return {
        init : init
    }

});