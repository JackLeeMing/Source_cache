require.config({

    baseUrl: "/static/js",

    paths: {
        "baiduchart" : "modules/baiduchart"
    }

});

define(['baiduchart'], function(baiduchart) {

    var getTimeType = function() {
        return $('#btns-time .dropdown-toggle').attr('type');
    }

    var getCompanyType = function() {
        return $('#btns-company .dropdown-toggle').attr('type');
    }

    var getContentType = function() {
        return $('#btns-content .selected').attr('type');
    }

    var emptyAddonAndPages = function () {
        $('#addon').empty();
        $('#page-btns').empty();
        $('#tip').addClass('hide');
    }

    //点击查看详细信息
    var showTip = function() {
        $('#tip').removeClass('hide');
    }

    //画图
    var initGraph = function(data) {
        $('#nutrition-chart-text').text('');
        var chartData = [];

        $.each(data, function(index, val) {

            var name = val['name'];
            var rate = val[getContentType()]['rate'];
            var id = val['_id'];

            chartData.push({
                name: name,
                value: rate,
                key: id
            });
        });

        var option = {
            series : [
                {
                    itemStyle : {
                        normal : {
                            label : {
                                formatter : function(a,b,c,d) {
                                    return c + '%' + b;
                                }
                            }
                        }
                    }
                }
            ]
        };

        var pie = baiduchart.drawPie('nutrition-chart', chartData, option);
        
        pie.on(baiduchart.ecConfig.EVENT.CLICK, function (param, set){
            var data = pie.getSeries()[0].data;
            $('#ge' + data[param.dataIndex].key).click();
        });

        pie.on(baiduchart.ecConfig.EVENT.HOVER, function (param){
            if(param.name) {
                var text = param.name+ param.value+"%";
                $('#nutrition-chart-text').text(text);

                // var series = pie.getSeries();

                // $.each(series[0].data, function(i, v){
                //     if(param.dataIndex == i) {
                //         v.selected = v.selected ? false : true;
                //     } else {
                //         v.selected = false;
                //     }
                // });

                // pie.setSeries(series);
            }
        });

    }

    //进度条模板
    var barTmp = '<div class="ge-modal col-xs-6 col-md-6 col-lg-6"><span class="sublabel title">(<span class="rate"></span>%)<span class="name"></span></span><div class="progress progress-sm"><div style="width: 42%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="40" role="progressbar" class="progress-bar  progress-bar-striped active"></div></div></div>';
    var barColors = ['progress-bar-danger', 'progress-bar-warning', 'progress-bar-primary', 'progress-bar-success'];

    //画进度条
    var initBars = function(data) {
	    $('#bars').empty();

        $.each(data, function(index, val) {
            var rate = val[getContentType()].rate.toFixed(0);
            var name = val.name;
            var _id = val._id;
            var numRate = parseInt(rate) / 25;
            numRate = numRate == 4 ? 3 : numRate;

            $tmp = $(barTmp);
            $tmp.attr('title', name);
            $tmp.attr('content-type', getContentType());
            $tmp.attr('_id', _id);
            $tmp.attr('id', 'ge' + _id);
            $tmp.find('.name').text(name);
            $tmp.find('.rate').text(rate);

            rate = (numRate >= 0 && numRate <= 1) ? '1%' : rate;

            $tmp.find('.progress-bar').css('width', rate + '%').addClass(barColors[numRate]);
            $('#bars').append($tmp);
        });
    }

    var init = function() {        
        var arg = {
            company_type: getCompanyType(),
            time_type: getTimeType(),
            content_type: getContentType()
        }

        $.post('/manage/bridge/statis', arg,function(data){
            if(data.data.length == 0) {
                 return;
            }

            initGraph(data.pie_data);
            initBars(data.data);
        });


    }

    //模态框里的表格
    var initTable = function(url, obj, page_index, companyid, status,type) {

         $.get(url, {companyid:companyid,page_index:page_index,page_size:10, status:status, type:type}, function(data, textStatus, xhr) {

            emptyAddonAndPages();

            var page = data.page;
            var page_index = page.page_index;
            var page_num= page.page_num;

            var setting = {
                page_num: data.page.page_num,
                bind_args: {
                    url: url,
                    toPlace: obj,
                    data: data.data,
                    args: {
                        companyid: companyid
                    }
                }
            };

            if(status) setting.bind_args.args.status = status;
            if(type) setting.bind_args.args.type = type;

            $('#page-btns').page(setting);

        });
    };

    //events
    $('#btns-company li').click(function(event) {
        var type = $(this).attr('type');
        var name = $(this).find('a').text();
        var $btn = $(this).parents('ul').siblings('button');
        var outType = $btn.attr('type');
        var outName = $btn.find('span').text();

        $(this).attr('type', outType);
        $(this).find('a').text(outName);
        $btn.attr('type', type);
        $btn.find('span').text(name);

        init();
    });

    $('#btns-content .btn').click(function(event) {
        $('#btns-content .btn').removeClass('selected');
        $(this).addClass('selected');
        var type = $(this).attr('type');

        init();
    });

    $('#btns-time li ,#btns-time-dingj li').click(function(event) {
        var type = $(this).attr('type');
        var name = $(this).find('a').text();
        var $btn = $(this).parents('ul').siblings('button');
        var outType = $btn.attr('type');
        var outName = $btn.find('span').text();

        $(this).attr('type', outType);
        $(this).find('a').text(outName);
        $btn.attr('type', type);
        $btn.find('span').text(name);

        init();
    });

    //modal
    //when click bars, generate a detail modal
    $('#module-qiaolgy').on('click', '.ge-modal', function(event) {
        var _id = $(this).attr('_id');
        var contentType = $(this).attr('content-type');
        var timeType = $('#btns-time button span').text();

        var $tr = $('#tr-' + getContentType());
        $tr.siblings().addClass('hide');
        $tr.removeClass('hide');

        var data = SmartData.getManageBridgeStatis(getCompanyType(), getTimeType(), getContentType()).data;
        emptyAddonAndPages();
        showTip();

        $.each(data, function(index, val) {
            if (_id == val._id) {
                $('#modal-bars-detail').attr('companyid', _id);

                var obj = {};

                obj.detail_name = val.name + '(' + timeType + ')';
                obj.detail_bridge_count = val.bridge_count;
                obj.detail_rate = val.rate.toFixed(2) + '%';
                obj.detail_disease_count = val.disease.disease_count;
                obj.detail_done_count = val.disease.done_count;
                obj.detail_deal_count = val.disease.deal_count;
                obj.detail_disease_rate = val.disease.rate.toFixed(2) + '%';
                obj.detail_xunjian_count = val.xunjian.xunjian_count;
                obj.detail_done_xunjian_count = val.xunjian.done_xunjian_count;
                obj.detail_xunjian_rate = val.xunjian.rate.toFixed(2) + '%';
                obj.detail_dingjian_count = val.dingjian.dingjian_count;
                obj.detail_done_dingjian_count = val.dingjian.done_dingjian_count;
                obj.detail_dingjian_rate = val.dingjian.rate.toFixed(2) + '%';

                $.each(obj, function(index, val) {
                    $('#' + index).text(val);
                });
                $('#tr-' + getContentType()).find('td:eq(0)').click();
            }

        });
        $('#modal-bars-detail').modal('show');
    });

    $('#modal-bars-detail').on('click', '#tr-xunjian', function(event) {
        var companyid = $(this).parents('.modal').attr('companyid');
        initTable('/company/bridge/xunjian/collect', '#addon', 1, companyid);

    });

    $('#modal-bars-detail').on('click', '#tr-disease td', function(event) {
        var companyid = $(this).parents('.modal').attr('companyid');
        var status = $(this).find('span').attr('status');
        initTable('/company/disease/list', '#addon', 1, companyid, status);
    });

    $('#modal-bars-detail').on('click', '#tr-dingjian td', function(event) {
        var companyid = $(this).parents('.modal').attr('companyid');
        var $iframe = $('<iframe>').attr('src', '/manage/task/list?companyid=' + companyid + '&view=true');
        emptyAddonAndPages();
        $('#addon').append($iframe);
    });

    $('#modal-bars-detail').on('click', '#detail_bridge_count', function(event) {
        var companyid = $(this).parents('.modal').attr('companyid');
        var type = getCompanyType();
        var strType = (type == 0) ? 'guanldw' : 'yanghdw';
        window.open('/manage/bridge?' + strType + '=' + companyid);
    });

    return {
    	init : init,
    	initGraph : initGraph,
    	initBars : initBars
    }

});
