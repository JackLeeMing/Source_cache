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
    var acl_key = $("#user_acl").attr("key");
    var xj_disease_url = '/action/xunjian/disease/count';
    var dj_disease_url = '/action/task/disease/count';
    var tj_disease_url = '/company/bridge/xunjian/print/disease';//后台给我的路径//

    function getUrl(diseaseType) {
        switch (diseaseType) {
            case 'xunj':
                return xj_disease_url;
            case 'dingj':
                return dj_disease_url;
            case 'tongj':
                return tj_disease_url;
        }
    }

    function initTable(arg, diseaseType) {
        $.get(getUrl(diseaseType) + '?view=html', arg, function(data) {
            $('#disease-table').html(data.data);
        });
    }


   function bhtjTable(arg, diseaseType) {
        $.get(getUrl('tongj') , arg, function(data) {
            $('#bhtj-table').html(data.data);

        });
    }

    function getCompanys(data) {
        var companys = [];

        $.each(data, function(i, v) {
            companys.push(v.name);
        });

        return companys;
    }

    function getArg() {
        var $opt = $('#module-disease select.active').find('option:selected'),
            selName = $('#module-disease select.active').attr('name');

        var arg = {
            start: $("#datetime-start").val(),
            end: $("#datetime-end").val()
        };

        if ($opt.val() === 'all') {
            if (selName === 'yanghdw') {
                arg.type = 1;
            } else {
                arg.type = 0;
            }
        } else {
            arg.companyid = $opt.val();
        }

        if (acl_key != '') {
            arg.acl = acl_key
        };

        return arg;
    }

    function getDiseaseType() {
        return $('input[name="disease-type"]:checked').val();
    }


    function getSeries(data) {
        var series = [{}, {}, {}, {}];

        series[0] = {
            name: '已处置',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: '#1CAF9A'
                }
            },
            data: []
        };

        series[1] = {
            name: '发现病害',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: '#D9534F'
                }
            },
            data: []
        };

        series[2] = {
            name: '未维修',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: '#f0ad4e'
                }
            },
            data: []
        };

        series[3] = {
            name: '已维修',
            type: 'bar',
            itemStyle: {
                normal: {
                    color: '#5bc0de'
                }
            },
            data: []
        };

        $.each(data, function(i, v) {
            var set = v.disease_count,
                json;
            series[0].data.push(set.chuzhi_count);
            series[1].data.push(set.disease_count);
            series[2].data.push(set.not_state_count);
            series[3].data.push(set.weixiu_count);
        });

        return series;
    }

    function initGraph(arg, diseaseType) {
        console.log('drawBar');
        $.get(getUrl(diseaseType) + '?view=json', arg, function(data) {

            var option = {
               
                title: {
                    text: (diseaseType === 'xunj') ? '桥梁日常巡视发现与处置视图' : '桥梁定期检测计划完成情况视图'
                },
                legend: {
                    data: ['发现病害', '已维修', '已处置', '未维修']
                },
                toolbox: {
                    show : false,
                    showTitle:false
                },
                xAxis: [{
                    type: 'category',
                    data: getCompanys(data.data)
                }],
                series: getSeries(data.data)
            }

            if (data.data.length > 10) {
                option.xAxis[0].axisLabel = {
                    interval: '0',
                    rotate: -20,
                    margin: 0,
                    textStyle: {
                        fontWeight: 'bold'
                    }
                }
            }

            baiduchart.drawBar('disease-graph', option);

        });
    }

    function initTime() {
        var end = util.time.getToday();
        var start = util.time.getFirstDayOfMonth();

        $('#datetime-start').val(start);
        $('#datetime-end').val(end);

        $('#xunj-year').change(function(e) {
            var year = $(this).find('option:selected').val(),
                _start = $('#datetime-start').val() || start,
                _end = $('#datetime-end').val() || end;
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

    function showLoading() {
        var $loading = $('<span>')
            .addClass('fa fa-spinner fa-spin fa-3x')
            .css({
                'margin-top': '100px',
                'margin-left': '47%'
            });

        $('.tab-pane.active>div').html($loading);
    }

    var init = function() {
        initTime();
        initPlugin();
        initTable(getArg(), getDiseaseType());
    };

    $('#disease-chaxun').click(function() {
        initTable(getArg(), getDiseaseType());
        showLoading();

        if ($('#graph-view').is(':visible')) {
            initGraph(getArg(), getDiseaseType());
        }

        if ($('#bhtj').is(':visible')) {
            bhtjTable(getArg(), getDiseaseType());
        }
    });

    $('select[name="guanldw"]').click(function() {
        $(this).addClass('active');
        $('select[name="yanghdw"]').removeClass('active');
    });

    $('select[name="yanghdw"]').click(function() {
        $(this).addClass('active');
        $('select[name="guanldw"]').removeClass('active');
    });

    $('#all-company').on('click', '.chosen-container', function() {
        var $sel = $(this).prev();
        $sel.addClass('active');

        switch ($sel.attr('name')) {
            case 'guanldw':
                $('select[name="yanghdw"]').removeClass('active');
                break;
            case 'yanghdw':
                $('select[name="guanldw"]').removeClass('active');
                break;
        }
    });

    $('select[name="guanldw"]').change(function() {
        $('select[name="yanghdw"]').find('option:eq(0)').prop('selected', true);
    });

    $('select[name="yanghdw"]').change(function() {
        $('select[name="guanldw"]').find('option:eq(0)').prop('selected', true);
    });

    $('#showAllDisease').click(function() {
        var diseaseType = $('#disease-type').find('option:selected').val();
        initTable('', diseaseType);
        initGraph('', diseaseType);
    });

    $('a[href="#graph-view"]').on('shown.bs.tab', function() {
        initGraph(getArg(), getDiseaseType());
    });

    $('a[href="#bhtj"]').on('shown.bs.tab', function() {
        bhtjTable(getArg(), getDiseaseType());
    });

    $('.btn-excel-disease').click(function() {
        var sel = getArg();
        var type = getDiseaseType();

        var url = type === 'xunj' ? xj_disease_url+'?' : dj_disease_url+'?';

        var arg = {
            start: sel.start,
            end: sel.end,
            export: 1
        };

        if (sel.companyid) {
            arg.companyid = sel.companyid;
        }
        
        if (acl_key != '') {
            arg.acl = acl_key
        };

        window.open(url + $.param(arg));
    });

    return {
        init: init
    }

});
