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

// 增加起点/终点的圆圈效果
function drawByPoint(section, map, markerlist) {
    var data = section.location;
    if (!Array.isArray(data)) {
        return;
    }
    for (var i = 0; i < data.length; i++) {
        var lng = data[i][1],
            lat = data[i][0];
        if ("number" == typeof lng && "number" == typeof lat) {
            var myIcon = new BMap.Icon("../../static/images/circle3.png", new BMap.Size(18,18));
            var marker = new BMap.Marker(new BMap.Point(lng, lat), {icon : myIcon});
            map.addOverlay(marker);
            markerlist.push(marker);
        }
    }
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
    console.log(nums);
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
       /* maps[i].addControl(new BMap.MapTypeControl);*/

        var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});   //设置版权控件位置
        maps[i].addControl(cr); //添加版权控件

        var bs = maps[i].getBounds();   //返回地图可视区域
        cr.addCopyright({id: 1, content: "<a href='#' style='color:#fff; background:#817fd1; font:normal 12px 微软雅黑; border-radius:2px; padding:5px 10px; text-decoration: none; line-height:26px;'>源清慧虹科技有限公司</a>", bounds: bs});
    }

    // 绘制道路路面技术状况GIS分布图
    var cond = {};
    var pqi_level = '';
    $('.roadselectgrade:checked').each(function(i,item){
        pqi_level = pqi_level + '|' +$(item).attr('value');
    });
    pqi_level = pqi_level.slice(1);
    cond['pqi_level'] = pqi_level;
    loadRoad(cond);
}

init(['roadmapdiv', 'sectionmapdiv', 'yanghmapdiv']);

function loadRoad(cond) {
    $.post('/manage/road/gis', cond, function(rs) {
        if (rs.status) {
            clearmap(0);
            var roadsections = rs.roadsections;
            // 默认为cd_pci_level
            var score_level = $('#sel_road_show_field').val() || 'cd_pci_level';
            for (var i = 0; i < roadsections.length; i++) {
                drawByLngLat(roadsections[i].location, roadsections[i][score_level],roadsections[i]._id,roadsections[i].roadid, ['A', 'B', 'C', 'D', '未评估'], maps[0], polylinelists[0]);
            }
            drawLevelCount(['A', 'B', 'C', 'D', '未评估'], rs.road_level_count, options[0]);
        }
    });
}

function loadSection(cond) {
    $.post('/manage/road/gis/section', cond, function(rs) {
        if (rs.status) {
            clearmap(1);
            var roadsections = rs.roadsections;
            var score_level = $('#sel_show_field').val() || 'jidcd_pci_level';
            for (var i = 0; i < roadsections.length; i++) {
                drawByLngLat(roadsections[i].location, roadsections[i][score_level], roadsections[i]._id, roadsections[i].roadid, ['A', 'B', 'C', 'D', '未评估'], maps[1], polylinelists[1])
            }
            drawLevelCount(['A', 'B', 'C', 'D', '未评估'], rs.section_level_count, options[1]);
        }
    });
}

function loadYangh(cond) {
    $.post('/manage/road/gis/yangh', cond, function(rs) {
        if (rs.status) {
            clearmap(2);
            var roadsections = rs.roadsections;
            for (var i = 0; i < roadsections.length; i++) {
                drawByLngLat(roadsections[i].location, roadsections[i].road_hgl,roadsections[i]._id,roadsections[i].roadid, ['优', '良', '合格', '不合格', '未评估'], maps[2], polylinelists[2]);
            }
            drawLevelCount(['优', '良', '合格', '不合格', '未评估'], rs.yangh_road_level_count, options[2]);
        }
    });
}


function queryroad(){
    var cond = {};
    var guanldw = $('#sel-road-guanldw').val();
    var yanghdw = $('#sel-road-yanghdw').val();
    var name = $('#tx_road_name').val();
    var show_field = $('#sel_road_show_field').val();

    var level = '';
    $('.roadselectgrade:checked').each(function(i,item){
        level += '|' +$(item).attr('value');
    });
    if (guanldw) cond['guanldw'] = guanldw;
    if (yanghdw) cond['yanghdw'] = yanghdw;

    cond['name'] = name;
    cond['show_field'] = show_field;

    if (level.length) {
        level = level.slice(1);
        cond['level'] = level;
        loadRoad(cond);
    } else{
        clearmap(0);
    }
}

$('#sel-road-guanldw, #sel-road-yanghdw, .roadselectgrade, #sel_road_show_field').on('change', function() {
    queryroad();
});

$('#btn_query').click(function(event) {
   queryroad();
});

function query_section() {
    var cond = {};
    var guanldw = $('#sel-guanldw').val();
    var yanghdw = $('#sel-yanghdw').val();
    var name = $('#tx_name').val();
    var show_field = $('#sel_show_field').val();

    var level = '';
    $('.selectgrade:checked').each(function(i,item){
        level += '|' +$(item).attr('value');
    });
    if (guanldw) cond['guanldw'] = guanldw;
    if (yanghdw) cond['yanghdw'] = yanghdw;
    cond['name'] = name;
    cond['show_field'] = show_field;

    if (level.length) {
        level = level.slice(1);
        cond['level'] = level;
        loadSection(cond);
    } else{
        clearmap(1);
    }

}
$('#sel-guanldw, #sel-yanghdw, .selectgrade,#sel_show_field').on('change', function() {
    query_section();
});
$('#btn-section-search').on('click', function() {
    query_section();
});

function query_yangh_road() {
    var cond = {};
    var guanldw = $('#sel-yangh-guanldw').val();
    var yanghdw = $('#sel-yangh-yanghdw').val();
    var name = $('#road_yangh_name').val();
    var road_hgl = '';
    $('.yanghselectgrade:checked').each(function(i,item){
        road_hgl = road_hgl + '|' +$(item).attr('value');
    });
    if (guanldw) cond['guanldw'] = guanldw;
    if (yanghdw) cond['yanghdw'] = yanghdw;
    cond['name'] = name;
    if (road_hgl.length){
        road_hgl = road_hgl.slice(1);
        cond['road_hgl'] = road_hgl;
        loadYangh(cond);
    } else{
        clearmap(2);
    }
}
$('#sel-yangh-guanldw, #sel-yangh-yanghdw, .yanghselectgrade').on('change', function() {
    query_yangh_road();
});
$('#btn-yangh-search').on('click', function() {
    query_yangh_road();
});

$('.sel-road-tab').on('click', function() {
    // 如果之前已经读取过数据,则直接显示即可
    if (3 === maps.length && 3 === polylinelists.length && 0 !== polylinelists[0].length) {
        return;
    }
    var cond = {};
    var level = '';
    $('.roadselectgrade:checked').each(function(i,item){
        level += '|' +$(item).attr('value');
    });
    if (level.length){
        level = level.slice(1);
        cond['level'] = level;
        loadRoad(cond);
    } else{
        clearmap(0);
    }
});
$('.sel-section-tab').on('click', function() {
    if (3 === maps.length && 3 === polylinelists.length && 0 !== polylinelists[1].length) {
        return;
    }
    var cond = {};
    var level = '';
    $('.selectgrade:checked').each(function(i,item){
        level += '|' +$(item).attr('value');
    });
    if (level.length){
        level = level.slice(1);
        cond['level'] = level;
        loadSection(cond);
    } else{
        clearmap(1);
    }
});
$('.sel-yangh-tab').on('click', function() {
    if (3 === maps.length && 3 === polylinelists.length && 0 !== polylinelists[2].length) {
        return;
    }
    var cond = {};
    var road_hgl = '';
    $('.yanghselectgrade:checked').each(function(i,item){
        road_hgl = road_hgl + '|' +$(item).attr('value');
    });
    if (road_hgl.length){
        road_hgl = road_hgl.slice(1);
        cond['road_hgl'] = road_hgl;
        loadYangh(cond);
    } else{
        clearmap(2);
    }
});
