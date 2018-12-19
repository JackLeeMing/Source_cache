// var layout = {
//     legend:{
//         orientation:"h",
//     },
//     autosize: false,
//     xaxis: {
//         showticklabels: false,
//         showgrid: true,
//         zeroline: true,
//     },
//     yaxis: {
//         linewidth: 1,
//         showgrid: true,
//         zeroline: true,
//     }
// };
var tmp = Date.parse( new Date() ).toString();
tmp = tmp.substr(0,10)-500;
var stopdraw;

var draw = function() {
    $.get('/analysis/colony/data', {
        start: tmp
    }, function(rs) {
        var d = []
        var data = rs.datas;
        for(var i = 0; i < data.length; i++) {
            var line = {
                x: [],
                y: [],
                name: '',
            };
            // console.log('以下为前')
            // console.log(data[i].x);
           	var _linex = [];
           	for(var n = 0;n<data[i].x.length;n++){
           		var time = new Date(data[i].x[n]*1000);
           		var _x = (time.getMonth()+1) + '-' + time.getDate() + '  ' + time.getHours() + ':' + time.getMinutes() + ':' +time.getSeconds();
           		_linex.push(_x);
           	};//还没有改完
            line.x =_linex;
            // console.log('以下为后');
            // console.log(line.x);
            line.y = data[i].y;
            line.name = '节点'+data[i].node_number+'_'+data[i].unit_name+'('+data[i].unit+')';
            d.push(line);
        };

        Plotly.newPlot('draw_img', d,layout,{modeBarButtonsToRemove:['sendDataToCloud','autoScale2d','select2d','lasso2d','hoverCompareCartesian'],displaylogo: false,displayModeBar: false});

    });
}
draw();

