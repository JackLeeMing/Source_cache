//编辑轨迹
var maps = [];
// 存储所有的折线
var polylinelists = [];
// 存储所有的点
var markerlists = [];
// 存储所有的统计表options
var options = [];

var winopts = {
    width:400,
    height: 250,
    enableMessage:false
};

// 清空界面
function clearmap(index){
    for (var j = 0; j < polylinelists[index].length; j++) {
        maps[index].removeOverlay(polylinelists[index][j]);
    }
    polylinelists[index]= [];
    for (var j = 0; j < markerlists[index].length; j++) {
        maps[index].removeOverlay(markerlists[index][j]);
    }
    markerlists[index] = [];
}

// 根据传递进来的路段的经纬度,进行绘制
function drawByLngLat(data, level, id, roadid, level_arr, map, polylinelist) {
    if (!Array.isArray(data)) {
        return;
    }
    var pointarr = [];
    for (var i = 0; i < data.length; i++) {
        var lng = data[i][1],
            lat = data[i][0];
        if ("number" == typeof lng && "number" == typeof lat) {
            pointarr.push(new BMap.Point(lng, lat));
        }
    }
    var polyline;
    // 根据不同的等级,具有不同的颜色: A(blue), B(yellow), C(green), D(red)
    if (level_arr[0] === level) {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "#1CAF9A", strokeWeight : 5, strokeOpacity : 1});
    } else if (level_arr[1] === level) {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "#428bca", strokeWeight : 5, strokeOpacity : 1});
    } else if (level_arr[2] === level) {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "#f0ad4e", strokeWeight : 5, strokeOpacity : 1});
    } else if (level_arr[3] === level) {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "#d9534f", strokeWeight : 5, strokeOpacity : 1});
    } else  {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "#DA70D6", strokeWeight : 5, strokeOpacity : 1});
    } 

    
    map.addOverlay(polyline);
    polylinelist.push(polyline);
    //单击事件
    polyline.addEventListener('click',function(e){
        var point = e.point;
        $.post('/manage/roadsection/info',{_id:id,roadid:roadid},function(rs){
            if (rs.status) {
                var infowindow = new BMap.InfoWindow(rs.data,winopts);
                map.openInfoWindow(infowindow,point);
            };
        })
    });
}


// 显示等级的统计图
var roadOptions = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        renderTo:'lm_tj',
        type:'column'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        type : 'value',
        minTickInterval: 1,
        title: {
            text: '数量（个）'
        }

    },
    series: [{
        name: '等级',
        data: [],
        color: '#7cb5ec'
    }],
    credits: {
      enabled:false
    }
};
var sectionOptions = {};
$.extend(true, sectionOptions, roadOptions);
sectionOptions.chart.renderTo = 'ld_tj';
var yanghOptions = {};
$.extend(true, yanghOptions, roadOptions);
yanghOptions.chart.renderTo = 'yh_tj';
options = [roadOptions, sectionOptions, yanghOptions];

// 绘制等级统计图
function drawLevelCount(keys, mapLevelCount, option){
    var nums = [],
        levels = [];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (mapLevelCount[key]) {
            levels.push(key);
            nums.push(mapLevelCount[key]);
        }
    }
    option.series = [{
        name : '数量',
        data : nums,
        color : '#7cb5ec'
    }];
    option.xAxis.categories = levels;

    var chart = new Highcharts.Chart(option);
}

// 初始化地图
function init(arr) {
    for (var i = 0; i < arr.length; i++) {
        polylinelists.push([]);
        markerlists.push([]);
        maps.push(new BMap.Map(arr[i]));
        var cityname = $('#cityname').attr('cityname');
        console.log(arr[i], cityname);
        maps[i].centerAndZoom(cityname,15);
        maps[i].enableScrollWheelZoom();
        // 地图平移缩放控件
        maps[i].addControl(new BMap.NavigationControl);
        // 地图类型控件
     /*   maps[i].addControl(new BMap.MapTypeControl);*/

        var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});   //设置版权控件位置
        maps[i].addControl(cr); //添加版权控件

        var bs = maps[i].getBounds();   //返回地图可视区域
        cr.addCopyright({id: 1, content: "<a href='#' style='color:#fff; background:#817fd1; font:normal 12px 微软雅黑; border-radius:2px; padding:5px 10px; text-decoration: none; line-height:26px;'>源清慧虹科技有限公司</a>", bounds: bs});
    }

    

    // 绘制道路路面技术状况GIS分布图
    var cond = {};
    cond['level'] = 'A|B|C|D|未评估';

    $('.smart-select').each(function(i,e){
            if($(e).attr('name') && $(e).attr('sel').length>0){
                cond[$(e).attr('name')]= $(e).attr('sel');
            }
     })


   


    loadSection(cond);
}

init(['sectionmapdiv']);

function loadSection(cond) {
    $.post('/manage/road/gis/section', cond, function(rs) {
        if (rs.status) {
           clearmap(0);
            var roadsections = rs.roadsections;
            var score_level = 'jidcd_pci_level';
            for (var i = 0; i < roadsections.length; i++) {
                drawByLngLat(roadsections[i].location, roadsections[i][score_level], roadsections[i]._id, roadsections[i].roadid, ['A', 'B', 'C', 'D', '未评估'], maps[0], polylinelists[0])
            }
            drawLevelCount(['A', 'B', 'C', 'D', '未评估'], rs.section_level_count, options[0]);
        }
    });
}





