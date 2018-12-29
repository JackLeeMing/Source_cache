require.config({
	paths:{
	'echarts' : '/static/js/echarts-map',
	'echarts/chart/pie' :'/static/js/echarts-map',
    'echarts/chart/bar' :'/static/js/echarts-map',
    'echarts/chart/line' :'/static/js/echarts-map',
    'echarts/chart/gauge' :'/static/js/echarts-map',
	'echarts/config' : '/static/js/echarts-map'
	}
});

define(['echarts', 'echarts/config', 'echarts/chart/pie', 'echarts/chart/bar', 'echarts/chart/line', 'echarts/chart/gauge'],
    function(ec, ecConfig){

    var pie,
        bar,
        line;

    //自定义饼图颜色
    var COLORS = ['#1CAF9A', '#428BCA', '#D9534F', '#259b24', '#ff9800', '#e84e40'];
    var COLORS_LENGTH = COLORS.length;
    
    //默认的饼图option
    var DEFAULT_OPTION_PIE = {

        calculable: true,
        toolbox: {
            show : true,
            padding: [5, 20, 5, 5],
            feature : {
                saveAsImage : {show: true}
            }
        },
        series: [
            {
                minAngle: 8,
                // selectedMode: 'single',
                type: 'pie',
                radius: ['40px', '70px']
            }
        ]
    };

    var DEFAULT_OPTION_BAR = {
        animation: true,
        tooltip : {
            trigger: 'axis'
        },
        toolbox: {
            show: false,
            feature: {
                mark: {show: true},
                dataView: {show: false, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable : true,
        yAxis : [
            {
                type: 'value'
            }
        ]
    };

    var DEFAULT_OPTION_METER = {
        tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        series : [
            {
                name:'业务指标',
                type:'gauge',
                splitNumber: 10,       // 分割段数，默认为5
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.2, '#228b22'],[0.8, '#48b'],[1, '#ff4500']], 
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    splitNumber: 10,   // 每份split细分多少段
                    length :12,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    show: true,        // 默认显示，属性show控制显示与否
                    length :30,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer : {
                    width : 5
                },
                title : {
                    show : true,
                    offsetCenter: [0, '-40%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder'
                    }
                },
                detail : {
                    formatter:'{value}%',
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto',
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: 50, name: '完成率'}]
            }
        ]
    };

    var DEFAULT_OPTION_LINE = {
        tooltip : {
            trigger: 'axis'
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true
    };
                    
    var labelTop = {
        normal : {
            label : {
                show : true,
                position : 'center'
            },
            labelLine : {
                show : false
            }
        }
    };

    var labelBottom = {
        normal : {
            color: '#ccc',
            label : {
                show : true,
                position : 'center',
                formatter : function (a,b,c){return 100 - c + '%'},
                textStyle: {
                    baseline : 'top'
                }
            },
            labelLine : {
                show : false
            }
        },
        emphasis: {
            color: 'rgba(0,0,0,0)'
        }
    };
    
    var radius = [20, 30];
    var DEFAULT_OPTION_MINIPIE = {
        series : [
            {
                type : 'pie',
                radius : radius,
                data : [
                    {value:46, itemStyle : labelBottom},
                    {value:54,itemStyle : labelTop}
                ]
            }
        ]
    };
                    
    // 赋予不同的颜色
    var giveDataCOLORS = function(data) {
        var c = 0;
       
        try {
            $.each(data, function(i, val){
                var extendtion = {
                    itemStyle : {
                        normal : {
                            //饼颜色
                            color : COLORS[c],
                            labelLine : {
                                lineStyle : {
                                    //线颜色
                                    color : COLORS[c]
                                }
                            },
                            label: {
                                textStyle: {
                                    //文本颜色
                                    color: COLORS[c]
                                }
                            }
                        }
                    }
                };
                $.extend(true, data[i], extendtion);
                c = (c+1==COLORS_LENGTH) ? 0 : c + 1;
            });
        } catch(e) {
            console.log(e);
        }
    };

    //为了使饼图更好看，去除value为0的数据
    var popZero = function(data) {

        var tempArr = [];

        $.each(data, function(i, val){
            if(data[i].value !== 0) {
                tempArr.push(data[i]);
            }
        });

       return tempArr;
    };

    //绘制饼图 返回饼图
    var drawPie = function(placeholder, data, option) {
        giveDataCOLORS(data);
        // 基于准备好的dom，初始化echarts图表
        pie = ec.init(document.getElementById(placeholder)); 

        option = $.extend(true, option, DEFAULT_OPTION_PIE);
        //写入数据
        option.series[0].data = data;

        pie.setOption(option);

        //随窗口大小变化，自动重绘
        window.onresize = pie.resize;
        
        return pie;
    };
	   
    var drawBar = function(placeholder, option) {

        bar = ec.init(document.getElementById(placeholder));
        option = $.extend(true, option, DEFAULT_OPTION_BAR);
        console.log(option);
        bar.setOption(option);
        window.onresize = bar.resize;

        return bar;
    };

    var drawMiniPie = function(placeholder, option) {

        miniPie = ec.init(document.getElementById(placeholder));
        option = $.extend(true, option, DEFAULT_OPTION_MINIPIE);
        console.log(option);
        miniPie.setOption(option);
        window.onresize = miniPie.resize;

        return miniPie;
    };


    var drawMeter = function(placeholder, option) {

        meter = ec.init(document.getElementById(placeholder));
        option = $.extend(true, option, DEFAULT_OPTION_METER);
        meter.setOption(option);
        window.onresize = meter.resize;

        return meter;
    };

    var drawLine = function(placeholder, option) {

        option = $.extend(true, option, DEFAULT_OPTION_LINE);

        if (line !== undefined) {
            line.setOption(option);
        } else {
            line = ec.init(document.getElementById(placeholder));
            window.onresize = line.resize();
        }

        line.setOption(option);

        return line;
    }

	return {
        COLORS: COLORS,
        ecConfig: ecConfig,
		drawPie: drawPie,
        drawBar: drawBar,
        drawMeter: drawMeter,
        drawMiniPie: drawMiniPie,
        drawLine: drawLine
	};

});