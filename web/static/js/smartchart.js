var chartColor = '#e7e7e7';
var colors = ['#1CAF9A', '#428BCA', '#D9534F', '#259b24', '#ff9800', '#e84e40'];

var defaultOption = {

        footnote : {
            color : '#486c8f',
            fontsize : 11,
            padding : '0 38'
        },
        center : {
            color:'#3e576f',
            shadow:true,
            shadow_blur : 2,
            shadow_color : '#557797',
            shadow_offsetx : 0,
            shadow_offsety : 0,
            fontsize : 40
        },
        sub_option : {
            label : {
                background_color:null,
                sign:false,//设置禁用label的小图标
                padding:'0 4',
                border:{
                    enable:false,
                    color:'#666666'
                },
                fontsize:11,
                fontweight:600,
                color : '#4572a7'
            }
        },
        border:{
              width:0
        },
        animation:true
    };

var customOption = {
    //add % after label
    showPercent : {
        width:530,
        height:300,
        sub_option: {
            listeners:{
                parseText:function(d, t){
                    return d.get('name') + d.get('value')+"%";
                },
                mouseover:function() {
                    var text = this.get('name')+ this.get('value')+"%";
                    $('#nutrition-chart-text').text(text);
                },
                click:function(r,e,m){
                    $('#ge' + r.get('key')).click();
                }
            }
        },
        radius : 70
    },
    graph_detail_click: {
        sub_option : {
            listeners:{
                click:function(r,e,m){
                    var href = $('#disTab .active').attr('location');
                    window.open(href + r.get('key'));
                }
            }
        }
    },
    graph_bridge_count_click: {
        sub_option : {
            listeners:{
                click:function(r,e,m){
                    var href = '/manage/bridge?postcode=';
                    window.open(href + r.get('key'));
                }
            }
        }
    }
};

var giveDataColor = function(data) {
    var colorIndex = 0;

    $.each(data, function(index, val) {
         colorIndex = (colorIndex == colors.length - 1) ? 0 : ++colorIndex;
         val.color = colors[colorIndex];
    });
}

var getValueSum = function(data) {
    var sum = 0;
    $.each(data, function(index, val) {
        sum += val.value;
    });

    return sum;
}

//placeholder is ID without '#'
var drawIChart = function(placeholder, data, centertext, typeOption) {
    giveDataColor(data);
    var option = $.extend(true,{}, defaultOption, customOption[typeOption]);
    option.render = placeholder;
    option.data = data;
    option.center.centertext = centertext;
    option.background_color = chartColor;
    var width = $('#' + placeholder).css('width');
    option.width = parseInt(width);
    var chart = new iChart.Donut2D(option);
    chart.draw();
}

var drawBar = function(placeholder, data){
    giveDataColor(data);

    var width = $('#' + placeholder).width();

    new iChart.Column2D({
        render : placeholder,
        data: data,
        width: width,
        background_color:chartColor,
        height : 280,
        border:{
              width:0
        },
        sub_option:{
            label : {
                color : '#2c2e2a'
            },
            listeners:{
                parseText:function(r,t){
                    return t+'座';
                }
            }
        },
        coordinate:{
            background_color:'#fefefe',
            scale:[{
                position:'left',
                scale_enable : false,
                decimalsnum : 0,
                listeners:{
                   parseText:function(t,x,y){
                       return {text:t}
                   }
                }
            }]
        },
        animation: true
    }).draw();
}

var drawLine = function(placeholder, flow, labels){

                var data = [
                            {
                                name : '巡检率',
                                value:flow,
                                color:'#0d8ecf',
                                line_width:2
                            }
                         ];

                var line = new iChart.LineBasic2D({
                    render : placeholder,
                    data: data,
                    align:'center',
                    width : 800,
                    height : 400,
                    background_color:chartColor,
                    sub_option:{
                        smooth : true,//平滑曲线
                        point_size:10,
                        listeners:{
                            parseText:function(){
                            }
                        }
                    },
                    legend : {
                        enable : false
                    },
                    border : {
                        width: 0
                    },
                    crosshair:{
                        enable:true,
                        line_color:'#62bce9'
                    },
                    coordinate:{
                        width:600,
                        valid_width:500,
                        height:260,
                        axis:{
                            color:'#9f9f9f',
                            width:[0,0,2,2]
                        },
                        grids:{
                            vertical:{
                                way:'share_alike',
                                value:12
                            }
                        },
                        scale:[{
                             position:'left',
                             start_scale:0,
                             end_scale:100,
                             scale_space:10,
                             scale_size:2,
                             scale_color:'#9f9f9f',
                             listeners:{
                                parseText:function(t,x,y){
                                    return {text:t+"%"}
                                }
                            }
                        },{
                             position:'bottom',
                             labels:labels
                        }]
                    }
                });
            //开始画图
            line.draw();
        }

        var drawBarWidthLables = function(placeholder, data, labels) {

            var width = $('#' + placeholder).width();

            var chart = new iChart.ColumnStacked2D({
                    render : placeholder,
                    data: data,
                    labels:labels,
                    background_color:chartColor,
                    width : width,
                    height : 450,
                    border : {
                        width: 0
                    },
                    padding: '0 -30 0 -30',
                    column_width:70,
                    sub_option:{
                        border : false
                    },
                    legend:{
                        enable:true,
                        background_color:"rgba(254,254,254,0.2)",
                        color:"#444",
                        fontsize:13,
                        border:{
                            color:"#85898f",
                            width:0
                        },
                        column:5,
                        align:"right",
                        valign:"top",
                        offsetx:-70,
                    },
                    column_width:80,
                    animation : true,
                    coordinate : {
                        scale : [{
                            position : 'left',
                            start_scale : 0,
                            scale_space : 2,
                            scale_enable : false
                        }]
                    }
                });

            chart.draw();
        }

        var drawBarCompare = function(placeholder, data, labels) {

            var width = $('#' + placeholder).width();
            var height = $('#' + placeholder).height();

            var chart = new iChart.ColumnMulti2D({
                    render : placeholder,
                    data: data,
                    labels:labels,
                    background_color:chartColor,
                    width : width,
                    height : height,
                    border : {
                        width: 0
                    },
                    padding: '0 -100 0 -100',
                    column_width:70,
                    sub_option:{
                        border : false
                    },
                    legend:{
                        enable:true,
                        background_color:"rgba(254,254,254,0.2)",
                        color:"#444",
                        fontsize:13,
                        border:{
                            color:"#85898f",
                            width:0
                        },
                        column:5,
                        align:"right",
                        valign:"top",
                        offsetx:-125,
                        offsety: -4
                    },
                    column_width:80,
                    animation: true,
                    coordinate : {
                        scale : [{
                            position : 'left',
                            start_scale : 0,
                            scale_space : 2,
                            scale_enable : false
                        }]
                    }
                });

            chart.draw();
        }