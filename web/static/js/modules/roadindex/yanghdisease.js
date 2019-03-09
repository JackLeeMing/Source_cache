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
    var road_yh_disease_url = '/action/road/yangh/road/disease/count';
    var yh_disease_url = '/action/road/yangh/disease/count';
    var yh_diseasecate_url = '/action/road/yangh/diseasecategory/count';

    function initTable(arg) {
        $.get(road_yh_disease_url + '?view=html', arg, function(data) {
            $('#road-yangh-disease-table').html(data.data);
        });
    }

    function initDisease(arg) {
        $.get(yh_diseasecate_url + '?view=html', arg, function(data) {
            $('#yangh-diseasecate-table').html(data.data);
        });
    }

    function initYanghdwTable(arg) {
      $.get(yh_disease_url + '?showtag=yangh&view=html', arg, function(data) {
          $('#yangh-disease-table').html(data.data);
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
        var $opt =$('#module-yanghdisease select.active').find('option:selected'),
            selName = $('#module-yanghdisease select.active').attr('name'),
            roadname = $('#yangh-roadname').find("input[name='roadname']").val();

        var arg = {
            start: $('#datetime-start').val(),
            end: $('#datetime-end').val()
        };

        if ('all' === $opt.val()) {
            if ('yanghdw' === selName) {
                arg.type = 1;
            } else {
                arg.type = 0;
            }
        } else {
            arg.companyid = $opt.val();
        }

        if ('' != acl_key) {
            arg.acl = acl_key
        }

        if (roadname != '') {
          arg.roadname = roadname;
        }
        console.log(arg);
        return arg;
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
            series[0].data.push(v.chuzhi);
            series[1].data.push(v.count);
            series[2].data.push(v.undo);
            series[3].data.push(v.weixiu);
        });

        return series;
    }

    function initGraph(arg) {

        $.get(yh_disease_url + '?showtag=yangh&view=json', arg, function(data) {

            var option = {
                title: {
                    text: '道路养护状况病害维修处置统计图'
                },
                legend: {
                    data: ['发现病害', '已维修', '已处置', '未维修']
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

            baiduchart.drawBar('yangh-disease-graph', option);

        });
    }

    function initTime() {
        var end = util.time.getToday();
        var start = util.time.getFirstDayOfMonth();

        $('#datetime-start').val(start);
        $('#datetime-end').val(end);

        $('#yangh-year').change(function(e) {
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
        initTable(getArg());
    };

    $('#yangh-disease-chaxun').click(function() {
        if ($('#road-yangh-table-view').is(':visible')) {
            initTable(getArg());
        }

        if ($('#yangh-diseasecate-view').is(':visible')) {
            initDisease(getArg());
        }

        if ($('#yangh-table-view').is(':visible')) {
            initYanghdwTable(getArg());
        }

        if ($('#yangh-graph-view').is(':visible')) {
            initGraph(getArg());
        }
    });

    $('#yangh-disease-excel').on('click', function() {
      var arg = getArg();
      arg.export = '1';
      if ($('#road-yangh-table-view').is(':visible')) {
        window.open(road_yh_disease_url+'?' + $.param(arg));
      }

      if ($('#yangh-table-view').is(':visible')) {
        window.open(yh_disease_url+'?' + $.param(arg));
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

    $('#yangh-all-company').on('click', '.chosen-container', function() {
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
        initTable('');
        initGraph('');
    });

    $('a[href="#yangh-graph-view"]').on('shown.bs.tab', function() {
      $('#yangh-all-company').attr('style', 'display:inline-block');
      $('#yangh-all-company').find('.chosen-container').attr('style', 'width: 150px;');
      $('#yangh-roadname').attr('style', 'display:none');
        initGraph(getArg());
    });

    $('a[href="#yangh-diseasecate-view"]').on('show.bs.tab', function() {
      $('#yangh-all-company').attr('style', 'display:inline-block');
      $('#yangh-all-company').find('.chosen-container').attr('style', 'width: 150px;');
      $('#yangh-roadname').attr('style', 'display:none');
      initDisease(getArg());
    });

    $('a[href="#yangh-table-view"]').on('show.bs.tab', function() {
      $('#yangh-all-company').attr('style', 'display:inline-block');
      $('#yangh-all-company').find('.chosen-container').attr('style', 'width: 150px;');
      $('#yangh-roadname').attr('style', 'display:none');
      initYanghdwTable(getArg());
    });

    $('a[href="#road-yangh-table-view"]').on('show.bs.tab', function() {
      $('#yangh-all-company').attr('style', 'display:none');
      $('#yangh-roadname').attr('style', 'display:inline-block');
      initYanghdwTable(getArg());
    });

    return {
        init: init
    }

});