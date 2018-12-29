require.config({
    baseUrl: "/static/js",
    paths: {
        "baiduchart" : "modules/baiduchart"
    }
});


define(['baiduchart'],function(baiduchart){

    var graphtitle = $('#disTab').find(".active").text();
    var RS = null;
    var flag = null;
    //路面结构，道路等级
    $('#module-lwtj #disTab a').on('click', function() {
        graphtitle = $(this).text();
        var y_type = $('#btns-flag .dropdown-toggle').attr('type');
        var x_type = $(this).attr("name");

        $.get("/manage/roadnet/area/count", {'y_type' : y_type, 'x_type' : x_type}, function(rs) {
            if (rs.data) {
                flag == 1;
                RS = rs;
                createdata(y_type,x_type,RS);
            }
        });
    });
    //管理单位，地区
    $('#module-lwtj #btns-flag li').on("click", function() {
        graphtitle = $('#disTab').find(".active").text();
        var y_type = $(this).attr('type');
        var name = $(this).find('a').text();
        var x_type = $('#disTab').find(".active").attr("name");
        var $btn = $(this).parents('ul').siblings('button');
        var outType = $btn.attr('type');
        var outname = $btn.find('span').text();
        $(this).attr('type', outType);
        $(this).find('a').text(outname);
        $btn.attr('type', y_type);
        $btn.find('span').text(name);
        $.get("/manage/roadnet/area/count", {'y_type' : y_type, 'x_type' : x_type}, function(rs) {
            if (rs.data) {
                flag == 1;
                RS = rs;
                createdata(y_type,x_type,RS);
            }
        });
    });

    $('#module-lwtj .table-export').on('click', function() {
        var y_type = $('#btns-flag .dropdown-toggle').attr('type');
        var x_type = $('#disTab').find("li.active").attr("name");
        location.href = "/manage/roadnet/area/count?y_type=" + y_type + '&x_type=' + x_type + "&export=1";
    });

    //th
    $('body').on('click','#module-lwtj .gx',function(){
        graphtitle = $(this).text() +'(' + $.trim($('#disTab').find(".active").text()) + ')';
        var y_type = $('#btns-flag .dropdown-toggle').attr('type');
        var x_type = $('#disTab').find(".active").attr("name");
        var rx = $(this).attr('thtitle');        
        if (RS.data) {
            flag == 0;
            var rs = RS;
            if (rx) {
                $("#dis-" + x_type).html(RS.data);   
                var data = [];
                var name = [];
                for(var key in RS.mapYX){
                    name.push(RS.mapCompanyName[key] || RS.mapCodeName[key]);
                    data.push(RS.mapYX[key][rx]);
                } 
                var graphdata = [];
                for (var i = 0; i < name.length; i++) {
                    graphdata.push({
                        name: name[i],
                        value:data[i]
                    });               
                };
                drawgraph(graphdata);          
            }else{                
                createdata(y_type,x_type,RS);
            }
                
        }       
    });

    //td
    $('body').on('click','#module-lwtj .gy',function(){
        graphtitle = $(this).text() +'(' + $.trim($('#disTab').find(".active").text()) + ')';
        var y_type = $('#btns-flag .dropdown-toggle').attr('type');
        var x_type = $('#disTab').find(".active").attr("name");
        var rx = $(this).attr('tdtitle');    
            if (RS.data) {
                $("#dis-" + x_type).html(RS.data);                  
                if (rx) {  
                    var data = [];
                    var name = []; 
                    var graphdata = [];                                     
                    for(var key in RS.mapYX[rx]){
                        name.push(key);                        
                        data.push(RS.mapYX[rx][key]);
                    } 
                    for (var i = 0; i < name.length; i++) {
                        graphdata.push({
                            name: name[i],
                            value:data[i]
                        });                   
                    };                   
                }else{                       
                    if (flag == 1) {
                        var totallength = RS.total['zxzh'].length - 1;
                        var totaldata = RS.total['zxzh'].splice(0,totallength);
                    }else{
                        var totaldata = RS.total['zxzh']
                    }        
                    var data = [];
                    var name = []; 
                    var graphdata = [];
                    for (var key in  RS.X_type_arr) {
                        name.push(RS.X_type_arr[key]);
                    };
                    
                    for (var i = 0; i < name.length; i++) {
                        graphdata.push({
                            name:name[i],
                            value:totaldata[i]
                        });
                    };                                                                                     
                }
                drawgraph(graphdata);
                flag == 0;
            }           
    });
    
    function createdata(y_type,x_type,rs) {
        $("#dis-" + x_type).html(rs.data);
        var horizontaldata = rs.total['hxzh'];
        var horizontalname = [];
         for (var key in rs.mapYX) {
            horizontalname.push(rs.mapCompanyName[key] || rs.mapCodeName[key]);
        };
        
        var graphdata = [];
        for (var i = 0; i < horizontalname.length; i++) {
            graphdata.push({
                name:horizontalname[i],
                value:horizontaldata[i]
            });
        };
        drawgraph(graphdata);
    }


    var drawgraph = function(graphdata){
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            title: {
                text: graphtitle,
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

        $('#module-lwtj #daolfb-chart-text').empty();
        var pie = baiduchart.drawPie('daolu-graph-detail',graphdata,option);
         pie.on(baiduchart.ecConfig.EVENT.HOVER, function (param){

            if(param.name) {
                var text = param.name+ ' (' +param.value + ')座';
                $('#daolfb-chart-text').text(text);
            }
        });
    };

    var init = function(type, flag) {
        var y_type = $('#btns-flag .dropdown-toggle').attr('type');
        var x_type = $('#disTab').find("li.active").attr("name");
        
        $.get("/manage/roadnet/area/count", {'y_type' : y_type, 'x_type' : x_type}, function(rs) {
            if (rs.data) {
                RS = rs;
                createdata(y_type,x_type,rs);
            }
        });
    }

    return {
        init: init,
    }
})

