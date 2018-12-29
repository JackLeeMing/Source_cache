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
    var xunjian_url = '/company/bridge/xunjian/'+acl_key+'collect';
    var xunjian_tj_url = '/manage/bridge/'+acl_key+'xunjian/month';

    function build_table(opt,sorted){

        function init_plugin(){
            if(!sorted){
               var unsort = [ 0, 11 ];
               $('#table_sort').dataTable({
                    "bPaginate": false, //翻页功能
                    "bLengthChange": true, //改变每页显示数据数量
                    "bFilter": false, //过滤功能
                    "bSort": true, //排序功能
                    "bInfo": false,//页脚信息
                    "bAutoWidth": false,//自动宽度
                    "sScrollY": "700px",
                    "bScrollCollapse": true,
                    "sPaginationType": "full_numbers",
                    "oLanguage": {                          //汉化
                        "sLengthMenu": "每页显示 _MENU_ 条记录",
                        "sZeroRecords": "没有检索到数据",
                        "sInfo": "当前数据为从第 _START_ 到第 _END_ 条数据；总共有 _TOTAL_ 条记录",
                        "sInfoEmtpy": "没有数据",
                        "sEmptyTable": "无数据",
                        "sProcessing": "正在加载数据...",
                        "oPaginate": {
                            "sFirst": "首页",
                            "sPrevious": "前页",
                            "sNext": "后页",
                            "sLast": "尾页"
                        }
                    },
                    "aoColumnDefs": [
                    { "bSortable": false, "aTargets": unsort } ]
                });
            }

        }


        var tbody = $('#table_data tbody');
        $.get(xunjian_url, opt, function(rs) {
            $('#ajax_view').hide();

            var statics = rs.statics;
            var data = rs.data;

            var th = $('#th_tr');
            th.find('.th3 p').html('共'+statics.ql+'座');
            th.find('.th2 p').html(statics.yanghudw);
            th.find('.th4 p').html(statics.xjr);
            th.find('.th6 p').html(statics.days || 0);
            th.find('.th7 p').html(statics.xunjian_count || 0);
            th.find('.th8 p').html(statics.xunjian_wc || 0);
            th.find('.th9 p').html((statics.total_rate || 0));

            for(var i=1; i<=data.length; i++){
                var b = data[i-1];
                var temp_tr = $($('#tr_container').html().trim());
                temp_tr.attr('bridgeid', b[9]);
                temp_tr.find('.th1').html(i);
                var ahref = $('<a>').attr('href','/manage/bridge/guany?tab=xunj&bridgeid='+b[9]).attr('class','pointer');
                ahref.html(b[1]);
                temp_tr.find('.th3').append(ahref);
                temp_tr.find('.th2').html(b[0]);
                temp_tr.find('.th4').html(b[2]);
                temp_tr.find('.th5').html(b[3]);
                temp_tr.find('.th6').html(b[4]);
                temp_tr.find('.th7').html(b[5]);
                if(b[4]>b[5]){
                    temp_tr.find('.th8').html(b[4]-b[5]);
                }else{
                    console.log(b);
                    temp_tr.find('.th8').html(0);
                }

                temp_tr.find('.th9').html(b[7]);
                temp_tr.find('.th10').html(b[8]);
                temp_tr.find('.th11 span').attr('bridgeid', b[9]);
                temp_tr.find('.th11 span').attr('href', '/company/bridge/xunjian/info?bridgeid='+b[9]);
                temp_tr.find('.th0').html(b[10]);

                tbody.append(temp_tr);
            }

            setTimeout(init_plugin,5000);

        });
    }

    var initXunjTable = function(companyid, page_index) {
        var _data = {companyid:companyid};
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

        build_table(_data);

    }

    function initTime() {
    	var end = util.time.getToday();
    	var start = util.time.getFirstDayOfMonth();

    	$('#datetime-start').val($('#datetime-start').val() || start);
    	$('#datetime-end').val($('#datetime-end').val() || end);

    	$('#xunj-year').change(function(e){
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

        $('#modal-xunjian-chart').prepend('');
    }

    // 绘制月度巡检工作完成率统计图
    function drawXunjLineGraph(bridgeid, start, end) {
        var args = {
                bridgeid: bridgeid,
                start: start,
                end: end
            };
        if (acl_key != ''){
            args['companyid'] = bridgeid
        }
        $.get(xunjian_tj_url, args, function(data){
                var data = data.data;

                if(data.length === 0) {
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
                    line = baiduchart.drawLine('modal-xunjian-chart', option);
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
    $('#xunj-widget').on('click', '.name', function(event) {
        var bridgeid = $(this).parents('tr').attr('bridgeid'),
            $modal   = $('#modal-xunjian');

        $modal.find('#modal-xunjian-chart h3').remove();
        $modal.attr('bridgeid', bridgeid).modal('show');
    });

    // 模态框加载完成后开始绘图
    $('#modal-xunjian').on('shown.bs.modal', function(e){
        var bridgeid = $(this).attr('bridgeid');
        drawXunjLineGraph(bridgeid);
    });

    $('#xunj-change-year').change(function(e){
        var year = $(this).find('option:selected').val(),
            bridgeid = $(this).parents('.modal').attr('bridgeid'),
            start = year + '-01',
            end   = year + '-12';

        drawXunjLineGraph(bridgeid, start, end);
    });

    // 点击查询按钮
    $('#xunj-chaxun').click(function(){
    	var arg = {
    		start: $("#datetime-start").val(),
    		end: $("#datetime-end").val(),
    		companyid: $('select[name="guanldw"]').val() || $('select[name="yanghdw"]').val()
    	};
        $('#ajax_view').show();
        $('#table_data tbody tr').remove();
        build_table(arg,true);
    });

    $('.btn-excel').click(function(){
        var arg = {
            start: $("#datetime-start").val(),
            end: $("#datetime-end").val(),
            companyid: $('select[name="guanldw"]').val() || $('select[name="yanghdw"]').val(),
            export: 1
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
