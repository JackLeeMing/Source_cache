      var layout = {
            margin:{ l:80, r:80, t:80 , b:80},
            height:700,
            title: '',
            hovermode: 'closest',
            xaxis: {
                //title: x_name+(x_unit ? '('+x_unit+')' : ''),
                showgrid:true,
                gridcolor:"#bbb",
                domain: [0, 0.98],
            },
            yaxis: {
                //title: y_name+(y_unit ? '('+y_unit+')' : ''),
                showgrid:true,
                gridcolor:"#bbb",
            },
            yaxis2 : {
                title: '数据量',
                overlaying: 'y',
                side: 'right',
                showgrid:true,
                gridcolor:"#bbb",
            },
            legend: {
                orientation: "v",
                bordercolor:"#000",
                borderwidth:1,
                font: {
                size: 10,
                color:'#000',
                }
            },
            font: {
                color: '#000',
                size: 12,
            },
            //paper_bgcolor: 'rgba(0,0,0,0)',
           // plot_bgcolor: 'rgba(0,0,0,0)',
            bargap:0.8,
        };

    var layout2 = {
            height:300,
            //title: fj_name+'分组统计',
            hovermode: 'closest',
            xaxis: {
                showgrid:true,
                gridcolor:"#bbb",
                //title: type,
                tickangle: 15,
            },
            yaxis: {
                title: "数据量",
                showgrid:true,
                gridcolor:"#bbb",
                gridcolor:'#adadad',
            },
            legend: {
                font: {
                size: 10,
                color:'#000',
                }
            },
            font: {
                color: '#000',
                size: 11,
            },
            //paper_bgcolor: 'rgba(0,0,0,0)',
            //plot_bgcolor: 'rgba(0,0,0,0)',
            bargap:0.8,
        }; 

     var limit_count = 2;
     var opacity = 0.6;
     var data_length = {};
     data_length.draw_data_length = 0;

function draw_plot_out(back,graphicsType) {
	if (back) {
		var type = back.type;
		var aver = back.aver;
		var fj_name = back.content['wt']['name'];
		var x_name = back.content['x']['name'];
		var x_unit = back.content['x']['unit'];
		var y_name = back.content['y']['name'];
		var y_unit = back.content['y']['unit'];
		var step = parseFloat(back.content['step']);
		var type_title = back.content['type'];
		var z = back.content['z'];
		var z_name = z ? z['name']:'';
		var z_unit = z ? z['unit']:'';

        var params = {};
        params.back = back;
        params.x_name = x_name;
        params.x_unit = x_unit;
        params.y_name = y_name;
        params.y_unit = y_unit;
        params.z_name = z_name;
        params.z_unit = z_unit;
        params.z_obj = z;

        params.fj_name = fj_name;
        params.type = type;
        params.type_title = type_title;
        params.graphicsType = graphicsType;
        params.step = step;

		switch (type) {
			case 1://按 x
				if (aver) {
				 draw_averGroup_x(params);
				}else{
			      draw_group(params);
			    }
				break;
			case 2:// 按 z
				if (aver) {
				 draw_averGroup_z(params);
				}else{
			      draw_group(params);
			    }
				break;
			case 3:// 按 z-period
				//draw_p_group(aver,back);
				if (aver) {
					draw_averGroup_period(params);
				}else {
                    draw_group_period(params);
				}
				break;
			}
		}
}

//按x 分组取平均
function draw_averGroup_x(params){
     var datas = [];
	if (params.back.data && params.back.data.length >0) {
		params.back.data.forEach( function(el, index) {
		    var labels = [];
		    var labelBars = [];
		    var barx = [];
            var width_bar  = 0;
            $.each(el['x'],function(index, ele) {
                var x = ele.toFixed(2);
                var y = el['y'][index].toFixed(2);
                var count = el['count'][index];
                var range = el['ranges'][index];
                var title =  params.x_name+":"+x+'('+params.x_unit+')'+' '+params.y_name+':'+y+'('+params.y_unit+')'
                labels.push(title);
		        var rangeMin = range[0];
		        var rangeMax = range[1];
                width_bar = (rangeMax-rangeMin)*0.5;
		        var rangeMiddle = rangeMin+(rangeMax-rangeMin)/2.0;
		        var labelBar = ''+params.x_name+':'+rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2)+" 数据量:"+count; 
		        barx.push(rangeMiddle);
		        labelBars.push(labelBar);
            });
            var unit_name = '';
            if (params.x_unit) {
                unit_name = '按'+params.x_name+'('+params.x_unit+')分组,取平均';
            }else{
               unit_name = '按'+params.x_name+"分组,取平均"; 
            }

           var trace = {
	            x: el['x'],
	            y: el['y'],
	            text:labels,
	            hoverinfo:'text',
	            mode: params.graphicsType,
	            name: unit_name,
	            type: 'scatter',
	            marker: {
                    color:el['color'],
	                size: 8,
	            },
	            line: {
	                width:2.5
	            },
         };
       if (params.graphicsType == 'markers' ) {
          trace['marker']['symbol']= (200+index);
        }

        datas.push(trace);
        var traceBar = {
            x: barx,
            y: el['count'],
            name:'分组数据量分布',
            text:labelBars,
            hoverinfo:'text',
            opacity: opacity,
            visible:'legendonly',
            type:'bar',
            yaxis:'y2',
            colorbar:{
            borderwidth:2,
            },
            marker:{
                color: el['color'],
                opacity: opacity,
            },
        };

        if (params.back.data.length >= limit_count) {
             traceBar.width = width_bar;
          }
            datas.push(traceBar);
      });

     var layout_x = {};
     $.extend(true,layout_x,layout);
     layout_x.title = params.fj_name+'分组统计';
     layout_x.xaxis.title = params.x_name+(params.x_unit ? '('+params.x_unit+')' : '');
     layout_x.yaxis.title = params.y_name+(params.y_unit ? '('+params.y_unit+')' : '');
     data_length.draw_data_length = datas.length;
     Plotly.plot('draw_img', datas, layout_x, plot_config_null);
	}
}

/*
按照x 和z 分组 未平均
*/
function draw_group(params){
     var datas = [];
     var datas2 = [];

  if (params.back.data && params.back.data.length >0) {
 	   params.back.data.forEach( function(el, index) {
 		    var labels = [];
            var barx = [];
            var bary = [];
            var barLabel = [];
            $.each(el['x'],function(index, ele) {
                var x = ele.toFixed(2);
                var y = el['y'][index].toFixed(2);
                var title = '';
                if (params.z_obj) {
                    var z = el['z'][index].toFixed(2); 
                    title =  params.x_name+":"+x+'('+params.x_unit+')'+' '+params.y_name+':'+y+'('+params.y_unit+')'+' '+params.z_name+':'+z+'('+params.z_unit+')';
                }else{
                   title =  params.x_name+":"+x+'('+params.x_unit+')'+' '+params.y_name+':'+y+'('+params.y_unit+')'
                }
                labels.push(title);
            });

	    var rangeMin = el['range'][0];
        var rangeMax = el['range'][1];
        var rangeWidth = (rangeMax-rangeMin)/2.0;
        var rangeMiddle = rangeMin+(rangeMax-rangeMin)/2.0;
        var unit_group_name = '';
        if (params.z_obj) {
            if (params.z_unit) {
                unit_name = ''+params.z_name+'('+params.z_unit+')'+':'+rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2);
                unit_group_label = ''+params.z_name+'('+params.z_unit+')';
                unit_group_name = rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2);
              }else{
                unit_name = ''+params.z_name+':'+rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2); 
                unit_group_label = ''+params.z_name;
                unit_group_name = rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2);
             }
        }else{
            if (params.x_unit) {
                unit_name = ''+params.x_name+'('+params.x_unit+')'+':'+rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2);
            }else{
               unit_name = ''+params.x_name+':'+rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2); 
            }
        }

 	     var trace = {
            x: el['x'],
            y: el['y'],
            text:labels,
            hoverinfo:'text',
            mode: params.graphicsType,
            name: unit_name,
            type: 'scatter',
            marker: {
                color:el['color'],
                size: 8,
            },
            line: {
                width:2.5
            },
         };

       if (params.graphicsType == 'markers' ) {
          trace['marker']['symbol']= (200+index);
        }
        barLabel.push(unit_name+' 数据量:'+el['count']);
        if (params.type == 1) {
             barx.push(rangeMiddle);
        }else{
             barx.push(unit_group_name);
        }
         bary.push(el['count']);
         datas.push(trace);
        var traceBar = {
            x: barx,
            y: bary,
            name:'分组数量分布',
            text:barLabel,
            hoverinfo:'text',
            opacity: 1,
            type:'bar',
            colorbar:{
            borderwidth:2,
            },
            marker:{
                color: el['color'],
                opacity: 1,
            }
        };
        if (params.type == 1) {
            if (params.back.data.length >= limit_count) {
             traceBar.width = rangeWidth;
          }
           traceBar.yaxis='y2';
           traceBar.visible='legendonly';
           traceBar.opacity = opacity;
           traceBar.marker.opacity = opacity;
           datas.push(traceBar);
        }else{
            datas2.push(traceBar);
        }
 	});	

     var layout_p = {};
     $.extend(true,layout_p,layout);
     layout_p.xaxis.title = params.x_name+(params.x_unit ? '('+params.x_unit+')' : '');
     layout_p.yaxis.title = params.y_name+(params.y_unit ? '('+params.y_unit+')' : '');
     
     if (params.type == 1) {
        layout_p.title = params.fj_name+'分组统计';
        data_length.draw_data_length = datas.length;
        Plotly.plot('draw_img', datas, layout_p, plot_config_null);
     }else{
        delete layout_p.yaxis2;
        var layout_top = {};
        $.extend(true,layout_top,layout2);
        layout_top.title = params.fj_name+'分组统计';
        data_length.draw_data_length = 0;
        layout_top.xaxis.title = '按'+params.z_name+(params.z_unit ? '('+params.z_unit+')' : '')+'分组,分组间隔'+params.step;
        layout_top.showlegend = false;
        Plotly.plot('draw_img', datas, layout_p, plot_config_null);
        Plotly.plot('draw_img2', datas2, layout_top, plot_config_null); 
     }

   } 
}

/*
按日期分组未平均
*/
function draw_group_period(params){
     var datas = [];
     var datas2 = [];
if (params.back.data && params.back.data.length >0) {
    params.back.data.forEach( function(el, index) {
            var barx = [];
            var bary = [];
            var barLabel = [];
            var labels = [];
            var  time_title = el['time'];
            $.each(el['x'],function(index, ele) {
                var x = ele.toFixed(2);
                var y = el['y'][index].toFixed(2);
                var title = '';
                title =  params.x_name+":"+x+'('+params.x_unit+')'+' '+params.y_name+':'+y+'('+params.y_unit+')'+'  '+time_title;
                labels.push(title);
            });

            var unit_name='';
                unit_name = time_title;

            var trace = {
                x: el['x'],
                y: el['y'],
                text:labels,
                hoverinfo:'text',
                mode: params.graphicsType,
                name: unit_name,
                type: 'scatter',
                marker: {
                    size: 8,
                    color:el['color'],
                },
                line: {
                    width:2.5
                },
            };
            if (params.graphicsType == 'markers' ) {
                trace['marker'].symbol = (200+index);
            }

            barLabel.push(unit_name+' 数据量:'+el['count']);
            var ts = el['index'];
            barx.push(ts);
            bary.push(el['count']);
            datas.push(trace);

        var traceBar = {
            x: barx,
            y: bary,
            name:'分组数据量分布',
            text:barLabel,
            hoverinfo:'text',
            type:'bar',
            opacity: 1,
            opacity:1,
            colorbar:{
             borderwidth:2,
            },
            marker:{
                color: el['color'],
                opacity: 1,
            }   
        };
         datas2.push(traceBar);

    });

     var layout_p = {};
     $.extend(true,layout_p,layout);
     layout_p.xaxis.title = params.x_name+(params.x_unit ? '('+params.x_unit+')' : '');
     layout_p.yaxis.title = params.y_name+(params.y_unit ? '('+params.y_unit+')' : '');
     delete layout_p.yaxis2;

     var layout_top = {};
     $.extend(true,layout_top,layout2);
     layout_top.title = params.fj_name+'分组统计';
     layout_top.xaxis.title = params.type_title;
     layout_top.showlegend = false;
     data_length.draw_data_length = 0;

    Plotly.plot('draw_img', datas, layout_p, plot_config_null);
    Plotly.plot('draw_img2', datas2, layout_top, plot_config_null);
 }
}

//
/*
按 z 分组取平均
*/
function draw_averGroup_z(params){
     var datas = [];
     var datas2 = [];
	if (params.back.data && params.back.data.length >0) {
		params.back.data.forEach( function(el, index) {
		    var labels = [];
		    var labelBars = [];
		    var width_bar = 0;
            var barx_out = [];
            var bary_out = [];
            var barLabels = [];

            var group_unit_name = '';
            var unit_group_label = '';
            var unit_group_name = '';
            var rangeMin = el['range'][0];
            var rangeMax = el['range'][1];
            var rangeWidth = (rangeMax-rangeMin)/2.0;
            var rangeMiddle = rangeMin+(rangeMax-rangeMin)/2.0;

            if (params.z_unit) {
                group_unit_name = ''+params.z_name+'('+params.z_unit+')'+':'+rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2);
                unit_group_label = ''+params.z_name+'('+params.z_unit+')';
                unit_group_name = rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2);
              }else{
                group_unit_name = ''+params.z_name+':'+rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2); 
                unit_group_label = ''+params.z_name;
                unit_group_name = rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2);
             }


             el['d'] = [];
            $.each(el['x'],function(index, ele) {
                var x = ele.toFixed(2);
                var y = el['y'][index].toFixed(2);
                var count = el['count'][index];
                var range = el['ranges'][index];
                var title =  params.x_name+":"+x+'('+params.x_unit+')'+' '+params.y_name+':'+y+'('+params.y_unit+')'+" ["+group_unit_name+"]"
                labels.push(title);
		        var rangeMin = range[0];
		        var rangeMax = range[1];
		        var rangeMiddle = rangeMin+(rangeMax-rangeMin)/2.0;
                el['d'].push(rangeMiddle);
		        width_bar = (rangeMax-rangeMin)*0.5;
		        var labelBar = ''+params.x_name+':'+rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2)+" 数据量:"+count+" ["+group_unit_name+"]"; 
		        labelBars.push(labelBar);
            });

           var trace = {
	            x: el['x'],
	            y: el['y'],
	            text:labels,
	            hoverinfo:'text',
	            mode: params.graphicsType,
	            name: group_unit_name,
	            type: 'scatter',
	            marker: {
                    color:el['color'],
	                size: 8,
	            },
	            line: {
	                width:2.5
	            },
         };
       if (params.graphicsType == 'markers' ) {
          trace['marker'].symbol = (200+index);
        }

         datas.push(trace);

        var traceBar = {
            x: el['d'],
            y: el['count'],
            name:'分组数据量分布',
            text:labelBars,
            hoverinfo:'text',
            visible:'legendonly',
            opacity: opacity,
            type:'bar',
            yaxis:'y2',
            colorbar:{
            borderwidth:2,
            },
            marker:{
                color:el['color'],
                opacity: opacity,
            },
        };

        if (el['x'].length >= limit_count) {
            traceBar.width = width_bar;
        }

         datas.push(traceBar);

        barLabels.push(group_unit_name+' 数据量:'+el['sum']);
        barx_out.push(unit_group_name);
        bary_out.push(el['sum']);

        var traceBar_out = {
            x: barx_out,
            y: bary_out,
            name:'数量分布',
            text:barLabels,
            hoverinfo:'text',
            opacity: 1,
            type:'bar',
            colorbar:{
            borderwidth:2,
            },
            marker:{
                color: 'rgb(158,202,225)',
                opacity: 1,
            } 
        };
         datas2.push(traceBar_out);
      });

     var layout_z = {};
     $.extend(true,layout_z,layout);
     layout_z.xaxis.title = params.x_name+(params.x_unit ? '('+params.x_unit+')' : '');
     layout_z.yaxis.title = params.y_name+(params.y_unit ? '('+params.y_unit+')' : '');

     var layout_top = {};
     $.extend(true,layout_top,layout2);
     layout_top.title = params.fj_name+'分组统计';
     layout_top.xaxis.title = '按'+params.z_name+(params.z_unit ? '('+params.z_unit+')' : '')+'分组,分组间隔'+params.step;
     data_length.draw_data_length = datas.length;
     layout_top.showlegend = false;
     Plotly.plot('draw_img2', datas2, layout_top, plot_config_null);
     Plotly.plot('draw_img', datas, layout_z, plot_config_null);
	}
}


//
/*
按周期时间分组取平均
*/
function draw_averGroup_period(params){
     var datas = [];
     var datas2 = [];
	if (params.back.data && params.back.data.length >0) {
		params.back.data.forEach( function(el, index) {

            var barx_out = [];
            var bary_out = [];
            var barLabels = [];
		    var labels = [];
		    var labelBars = [];
		    var width_bar = 0;
		    var time_title = el['time'];
            el['d'] = [];
            $.each(el['x'],function(index, ele) {
                var x = ele.toFixed(2);
                var y = el['y'][index].toFixed(2);
                var count = el['count'][index];
                var range = el['ranges'][index];
                var title =  params.x_name+":"+x+'('+params.x_unit+')'+' '+params.y_name+':'+y+'('+params.y_unit+')'+" ["+time_title+"]"
                labels.push(title);
		        var rangeMin = range[0];
		        var rangeMax = range[1];
		        var rangeMiddle = rangeMin+(rangeMax-rangeMin)/2.0;
                el['d'].push(rangeMiddle);

		        width_bar = (rangeMax-rangeMin)*0.5;
		        var labelBar = ''+params.x_name+"("+params.x_unit+")"+':'+rangeMin.toFixed(2)+'~'+rangeMax.toFixed(2)+" 数据量:"+count+" ["+time_title+"]"; 
		        labelBars.push(labelBar);
            });

           var trace = {
	            x: el['x'],
	            y: el['y'],
	            text:labels,
	            hoverinfo:'text',
	            mode: params.graphicsType,
	            name: time_title,
	            type: 'scatter',
	            marker: {
                    color:el['color'],
	                size: 8,
	            },
	            line: {
	                width:2.5
	            },
         };
       if (params.graphicsType == 'markers' ) {
          trace['marker'].symbol = (200+index);
        }
         datas.push(trace);
        var traceBar = {
            x: el['d'],
            y: el['count'],
            name:'分组数据量分布',
            text:labelBars,
            visible:'legendonly',
            hoverinfo:'text',
            opacity: opacity,
            type:'bar',
            yaxis:'y2',
            colorbar:{
            borderwidth:2,
            },
            marker:{
                color:el['color'],
                opacity: opacity,
            },
        };

        if (el['x'].length >= limit_count) {
            traceBar.width = width_bar;
        }

        datas.push(traceBar);
        var ts = el['index'];
        barLabels.push(time_title+' 数据量:'+el['sum']);
        barx_out.push(ts);
        bary_out.push(el['sum']);

       var traceBar_out = {
            x: barx_out,
            y: bary_out,
            name:'数量分布',
            text:barLabels,
            hoverinfo:'text',
            opacity: 1,
            type:'bar',
            colorbar:{
            borderwidth:2,
            },
            marker:{
                color: el['color'],
                opacity: 1,
            }
        };
         datas2.push(traceBar_out);
      });

     var layout_time = {};
     $.extend(true,layout_time,layout);
     layout_time.xaxis.title = params.x_name+(params.x_unit ? '('+params.x_unit+')' : '');
     layout_time.yaxis.title = params.y_name+(params.y_unit ? '('+params.y_unit+')' : '');

     var layout_top = {};
     $.extend(true,layout_top,layout2);
     layout_top.title = params.fj_name+'分组统计';
     layout_top.xaxis.title = params.type_title;
     layout_top.showlegend = false;
     data_length.draw_data_length = datas.length;
     Plotly.plot('draw_img2', datas2, layout_top, plot_config_null);
     Plotly.plot('draw_img', datas, layout_time, plot_config_null);
  }
}



