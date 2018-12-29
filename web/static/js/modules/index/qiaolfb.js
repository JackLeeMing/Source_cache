require.config({

    baseUrl: "/static/js",

    paths: {
        "baiduchart" : "modules/baiduchart"
    }

});

define(['baiduchart'], function(baiduchart) {
	   
    var graphTitle = '桥梁类型';

    var emptyText = function() {
        $('#qiaolfb-chart-text').empty();
    };

    // 桥梁类型、特殊桥梁……
    var getType = function() {
        return $('#disTab .active').attr('type');
    };

    var getTypeText = function() {
        return $('#disTab .active').find('a').text();
    };

    // 管理单位、养护单位、地区
    var getFlag = function() {
        return $('#btns-flag .dropdown-toggle').attr('type');
    };

    var getFlagText = function() {
        return $('#btns-flag .dropdown-toggle span').text();
    };

	var initTable = function(data, type, flag) {
		var type = type || getType();
		var flag = flag || getFlag();

        $('#module-qiaolfb').attr('type', type);
        $('#dis-' + type).html(data.data);
    }

    var initGraph = function(data) {
        console.log('draw:graph-detail');
        var pie_data = data.pie_data;
        var graphData = [];

        $.each(pie_data, function(index, val) {
            graphData.push({
                name: val[0].split('|')[0],
                value: val[1],
                key: val[0].split('|')[1]
            });
        });

        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            title: {
                text: graphTitle,
                x:'center'
            },
            series: [
                {   
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        }
                    }
                 }   
            ]
        };

        emptyText();
        var pie = baiduchart.drawPie('graph-detail', graphData, option);

        pie.on(baiduchart.ecConfig.EVENT.HOVER, function (param){

            if(param.name) {
                var text = param.name+ ' (' +param.value + ')座';
                $('#qiaolfb-chart-text').text(text);
            }
        });

    }

    var init = function(type, flag) {
    	var type = type || getType();
    	var flag = flag || getFlag();
        var url = '/manage/bridge/area/count';
        if (type == 'jszk') //桥梁技术状况统计
        {
            url = '/manage/bridge/city/count';
        }
 
        $.get(url, {type:type, flag:flag}, function(data){
                initTable(data, type, flag);
                if (type != 'jszk'){
                    $('.opt_type').css('display', 'block');
                    initGraph(data, type, flag);
                }
                else
                {
                    $('.opt_type').css('display', 'none');
                }
        });
    }

	//事件
    $('#disTab').on('click', 'li', function(event) {
        graphTitle = $(this).find('a').text();
        var text = $(this).children('a').text();
        var type = $(this).attr('type');
        $('#dis-type').text(text);

        init(type);
    });


    $('#btns-flag li').click(function(event) {
        graphTitle = $(this).find('a').text() + '(' + getTypeText() + ')';

        var flag = $(this).attr('type');
        var name = $(this).find('a').text();
        var $btn = $(this).parents('ul').siblings('button');
        var outType = $btn.attr('type');
        var outName = $btn.find('span').text();

        $(this).attr('type', outType);
        $(this).find('a').text(outName);
        $btn.attr('type', flag);
        $btn.find('span').text(name);       

        init();
    });
    
    $('#btns-flag li[data-active="true"]').click();

    $('body').on('click', '.gx', function(){
        var x = $(this).text();
        graphTitle = $(this).text() + '(' + getTypeText() + ')';

        $.get('/manage/bridge/area/count', {type:getType(), flag:getFlag(), x:x}, function(data){
            initTable(data);
            initGraph(data);
        });
    });

    $('body').on('click', '.gy', function(){
        var y = $(this).text();
        graphTitle = $(this).text() + '(' + getTypeText() + ')';
        $.get('/manage/bridge/area/count', {type:getType(), flag:getFlag(), y:y}, function(data){
            initTable(data);
            initGraph(data);
        });
    });

    return {
    	init: init,
    	initGraph : initGraph,
    	initTable : initTable
    }

});