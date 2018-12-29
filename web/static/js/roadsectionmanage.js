//编辑轨迹
var map = null;
// 存储所有的折线
var polylinelist = [];
// 存储所有的点
var markerlist = [];

// 清空界面
function clearmap(){
    for (var i = 0; i < polylinelist.length; i++) {
        map.removeOverlay(polylinelist[i]);
    }
    for (var i = 0; i < markerlist.length; i++) {
        map.removeOverlay(markerlist[i]);
    }
    polylinelist = [];
    markerlist = [];
}

// 根据传递进来的路段的经纬度,进行绘制
function drawByLngLat(data, level,iscenter,cityname) {
    if (!Array.isArray(data)) {
        return;
    }
    var pointarr = [];
    for (var i = 0; i < data.length; i++) {
        var lng = data[i][0],
            lat = data[i][1];
        if ("number" == typeof lng && "number" == typeof lat) {
            // 备注: 数据库中存储数据格式有误,存储为:纬度,经度,而非经度,纬度
            pointarr.push(new BMap.Point(lng, lat));
            if (!iscenter) {
                map.centerAndZoom(new BMap.Point(lat,lng),15); 
                iscenter = true;
            };
        }
    }

    if (!pointarr.length) {
        map.centerAndZoom(cityname,15); 
    };
    
    var polyline;
    // 根据不同的等级,具有不同的颜色: A(blue), B(yellow), C(green), D(red)
    if ('A' === level) {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "blue", strokeWeight : 5, strokeOpacity : 0.5});
    } else if ('B' == level) {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "yellow", strokeWeight : 5, strokeOpacity : 0.5});
    } else if ('C' == level) {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "green", strokeWeight : 5, strokeOpacity : 0.5});
    } else if ('D' == level) {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "red", strokeWeight : 5, strokeOpacity : 0.5});
    } else {
        polyline = new BMap.Polyline(pointarr, {strokeColor : "gray", strokeWeight : 5, strokeOpacity : 0.5});
    }
    map.addOverlay(polyline);
    polylinelist.push(polyline);
}

// 增加起点和终点
function drawByPoint(section) {
    var data = section.location;
    var daolqd = section.daolqd;
    var daolzd = section.daolzd;
    if (!Array.isArray(data)) {
        return;
    }
    for (var i = 0; i < data.length; i++) {
        var lng = data[i][0],
            lat = data[i][1];
        if ("number" == typeof lng && "number" == typeof lat) {
            var myIcon = new BMap.Icon("../static/images/circle3.png", new BMap.Size(18,18));
            var marker = new BMap.Marker(new BMap.Point(lat, lng), {icon : myIcon});
            var label = '';
            if (0 == i) {
                label = new BMap.Label(daolqd, {offset : new BMap.Size(20,-20)});
            } else if (data.length - 1 == i) {
                label = new BMap.Label(daolzd, {offset : new BMap.Size(20,20)});
            }
            marker.setLabel(label);
            map.addOverlay(marker);
            markerlist.push(marker);
        }
    }
}

// 点击道路GIS,获取所有路段的信息
var roadid = '';
$('.roadgis').on('click',function(){
    roadid = $(this).attr('roadid');
    var roadname = $(this).attr('roadname');
    $('#mapcontainer').show();
    $('#mapcontainer h5').text(roadname + '道路GIS显示');
    map = new BMap.Map('mapdiv');
    var cityname = $(this).attr('cityname');
    
    $.post('/manage/roadsection/gis', {roadid : roadid}, function(rs){
        if (rs.status) {
            var iscenter = false;
            var roadsections = rs.roadsections;
            for (var i = 0; i < roadsections.length; i++) {
                drawByLngLat(roadsections[i].location, roadsections[i].jidcd_pqi_level,iscenter,cityname);
                drawByPoint(roadsections[i]);
            }
            console.log(rs);
        };
        map.addControl(new BMap.NavigationControl());
        var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}); 
        map.addControl(new BMap.ScaleControl(top_left_control));    
       /* map.addControl(new BMap.MapTypeControl());*/
        map.enableScrollWheelZoom(true);
        map.addControl(new BMap.OverviewMapControl());  
        var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});   //设置版权控件位置
        map.addControl(cr); //添加版权控件

        var bs = map.getBounds();   //返回地图可视区域
        cr.addCopyright({id: 1, content: "<a href='#' style='color:#fff; background:#817fd1; font:normal 12px 微软雅黑; border-radius:2px; padding:5px 10px; text-decoration: none; line-height:26px;'>源清慧虹科技有限公司</a>", bounds: bs});

    });
    $('#mapcontainer #close').on('click',function(){
        $('#mapcontainer').hide();
    });
});

function load() {
    var guanldw = $('.sel-guanldw').val();
    var yanghdw = $('.sel-yanghdw').val();
    var cond = {};
    cond['roadid'] = roadid;
    if (guanldw) cond['guanldw'] = guanldw;
    if (yanghdw) cond['yanghdw'] = yanghdw;

    $.post('/manage/roadsection/gis', cond, function(rs){
        if (rs.status) {
            clearmap();

            var roadsections = rs.roadsections;
            for (var i = 0; i < roadsections.length; i++) {
                drawByLngLat(roadsections[i].location, roadsections[i].jidcd_pqi_level);
                drawByPoint(roadsections[i]);
            }
        };
    });
}
// 管理单位/养护单位的改变
$('.sel-guanldw, .sel-yanghdw').on('change', function() {
    load();
});
