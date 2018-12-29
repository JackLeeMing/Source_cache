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
    var line; // 巡检工作统计折线图
    var acl_key = $("#user_acl").attr("key");
    var link_cid = $("#link_cid").val(); //查询管理单位id
    if (acl_key!="") {acl_key = acl_key + "/"};
    var xunjian_url = '/company/road/xunjian/section/collect';
    var xunjian_tj_url = '/manage/road/'+acl_key+'xunjian/section/month';
    console.log(xunjian_tj_url);

    var initXunjTable = function(companyid, page_index) {
        var _data = {companyid:companyid, findall:1};
        var start = $('#datetime-start').val();
        var end = $('#datetime-end').val();

        if (link_cid != undefined && link_cid != '') {
            _data["companyid"] = link_cid;
        }
        if (start == '' || end == ''){
            _data["start"] = util.time.getFirstDayOfMonth();
            _data["end"] = util.time.getToday();
        }
        else{
            _data["start"] = start;
            _data["end"] = end;
        }

        $.get(xunjian_url, _data, function(data) {
            $('#ajax_view').hide();
            $('#table_data').html(data.data);

        });
    }

    function initTime() {
    	var end = util.time.getToday();
    	var start = util.time.getFirstDayOfMonth();

    	$('#datetime-start').val($('#datetime-start').val() || start);
    	$('#datetime-end').val($('#datetime-end').val() || end);

    	$('#xunj-section-year').change(function(e){
    		var year = $(this).find('option:selected').val(),
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
    		minView: 2,
            todayBtn: true
    	});
    }

    function drawMiniPie() {
    	baiduchart.drawMiniPie('xunj-pie');
    }

    function dealXunjianDataTip(show) {
        var $tip = $('#no-data-tip');

        if (show) {
            $tip.removeClass('hide');
            line.clear();
        } else {
            $tip.addClass('hide');
        }

        $('#modal-xunjian-section-chart').prepend('');
    }

    // 绘制月度巡检工作完成率统计图
    function drawXunjLineGraph(roadid, sectionids, start, end) {
        var args = {
                roadid: roadid,
                sectionids: sectionids,
                start: start,
                end: end
            };
        if (acl_key != ''){
            args['companyid'] = roadid
        }
        $.get(xunjian_tj_url, args, function(data){
                var data = data.data;

                if(!$.isArray(data) || data.length === 0) {
                    dealXunjianDataTip(true);
                    return;
                }

                dealXunjianDataTip(false);

                // 转换数据
                var xAxisData = [],
                    yAxisData = [],
                    markPointData = [];


                $.each(data, function(i, v){
                    xAxisData.push(v.addon);
                    yAxisData.push(parseFloat(v.rate));
                    markPointData.push({
                        type: 'value',
                        name: '巡检率',
                        value: v.rate,
                        xAxis: v.addon,
                        yAxis: v.rate
                    });
                });

                // 图表配置
                var option = {
                    showLoading: true,
                    xAxis: [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : xAxisData
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} %'
                            }
                        }
                    ],
                    toolbox: {
                        show : false,
                        x:'-9999',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    series : [
                        {
                            name:'巡检率',
                            type:'line',
                            data: yAxisData,
                            markPoint: {
                                showAllSymbol: true,
                                symbolSize: 20,
                                itemStyle: {
                                    normal: {
                                        color: '#888'
                                    }
                                },
                                data: markPointData
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };
                // 绘图
                if (line) {
                    line.clear();
                    line.setOption(option);
                } else {
                    line = baiduchart.drawLine('modal-xunjian-section-chart', option);
                }
        });
    }

    // 启动入口
    var init = function() {
        initTime();
        initXunjTable();
        initPlugin();
    };

    // 生成巡检统计图
    $('#xunj-section-widget').on('click', '.name', function(event) {
        var roadid = $(this).parents('tr').attr('roadid'),
            sectionids = $(this).parents('tr').attr('sectionids'),
            $modal   = $('#modal-xunjian-section');
        console.log(roadid, sectionids);
        $modal.find('#modal-xunjian-section-chart h3').remove();
        $modal.attr('sectionids', sectionids);
        $modal.attr('roadid', roadid).modal('show');
    });

    // 模态框加载完成后开始绘图
    $('#modal-xunjian-section').on('shown.bs.modal', function(e){
        var sectionids = $(this).attr('sectionids');
        var roadid = $(this).attr('roadid');
        drawXunjLineGraph(roadid, sectionids);
    });

    $('#xunj-section-change-year').change(function(e){
        var year = $(this).find('option:selected').val(),
            roadid = $(this).parents('.modal').attr('roadid'),
            sectionids = $(this).parents('.modal').attr('sectionids'),
            start = year + '-01',
            end   = year + '-12';
        drawXunjLineGraph(roadid, sectionids, start, end);
    });

    // 点击查询按钮
    $('#xunj-section-chaxun').click(function(){
    	var arg = {
    		start: $("#datetime-start").val(),
    		end: $("#datetime-end").val(),
        roadname: $('#xunj-section-roadname').val(),
        sectionname: $('#xunj-section-name').val(),
    		yanghdw: $('select[name="guanldw"]').val() || $('select[name="yanghdw"]').val()
    	};
        $('#ajax_view').show();
        $('#table_data').empty();
        console.log(arg);
    	$.get(xunjian_url, arg, function(data){
    		//$('#xunj-table').html(data.data);
            $('#table_data').html(data.data);
            $('#ajax_view').hide();
    	});
    });

    //
    $('#xunj-section-excel').on('click', function() {
      var arg = {
    		start: $("#datetime-start").val(),
    		end: $("#datetime-end").val(),
        roadname: $('#xunj-section-roadname').val(),
        sectionname: $('#xunj-section-name').val(),
    		yanghdw: $('select[name="guanldw"]').val() || $('select[name="yanghdw"]').val(),
        export: '1'
    	};
      window.open(xunjian_url+'?' + $.param(arg));

      
    });

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
