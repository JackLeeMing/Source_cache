//编辑轨迹
var map = null;
var pointarr = [];
var polyline = new BMap.Polyline(pointarr, {
    strokeColor: "blue",
    strokeWeight: 5,
    strokeOpacity: 0.5
});

function initMap(data, sectionid) {
    if ($.cookie(sectionid + '_drawmethod') == 'manualdraw') {
        $('#' + sectionid + '_mapcontainer').find('#manualdraw').prop('checked', true);
    } else {
        $('#' + sectionid + '_mapcontainer').find('#autodraw').prop('checked', true);
    }
    if (data.length >= 2) {
        for (var i = 0; i < data.length; i++) {
            pointarr.push(new BMap.Point(data[i][1], data[i][0]));
        };

        polyline.setPath(pointarr);
        map.addOverlay(polyline);
    } else {
        addmenu(sectionid);
    }
}

function addmenu(sectionid) {
    var menu = new BMap.ContextMenu();
    menu.addItem(new BMap.MenuItem('创建端点', function(e) {
        pointarr.push(e);
        if (pointarr.length == 1) {
            creatpoint(e);
        } else {
            if ($('#' + sectionid + '_mapcontainer').find('#autodraw').prop('checked')) {
                var training = new BMap.WalkingRoute(map);
                training.setSearchCompleteCallback(function(results) {
                    var firstPlan = results.getPlan(0);
                    var temp_path = [];
                    for (var i = 0; i < firstPlan.getNumRoutes(); i++) {
                        var walk = firstPlan.getRoute(i);

                        if (walk.getDistance(false) > 0) {
                            temp_path = temp_path.concat(walk.getPath());
                        }
                    }
                    polyline.setPath(temp_path);
                });

                training.search(pointarr[0], pointarr[1]);
                polyline.disableEditing();
                $.cookie(sectionid + '_drawmethod', 'autodraw');
            } else {
                polyline.setPath(pointarr);
                polyline.enableEditing();
                $.cookie(sectionid + '_drawmethod', 'manualdraw');
            }
            map.addOverlay(polyline);
            map.removeOverlay(marker);
            map.removeContextMenu(menu);
        }
    }, 100));

    map.addContextMenu(menu);
}

var marker = null;

function creatpoint(e) {
    var point = new BMap.Point(e.lng, e.lat);
    marker = new BMap.Marker(point);
    map.addOverlay(marker);
}

function clearmap() {
    map.removeOverlay(marker);
    map.removeOverlay(polyline);
    pointarr = [];
    polyline.setPath(pointarr);
}


$('.setpath').on('click', function() {
    var cityname = $(this).attr('cityname');
    var is_add_zoom = false;
    var _id = $(this).parents('tr').attr('_id');
    var roadid = $(this).parents('table').attr('roadid');
    var sectionname = $(this).parents('td').siblings('.name').text();
    $('#' + _id + '_mapcontainer').show();
    $('#' + _id + '_mapcontainer').find('#savepoint,#clearpoint,#close,.drawmethod').attr({
        '_id': _id,
        'roadid': roadid
    });
    $('#' + _id + '_mapcontainer').find('h5').text(sectionname + 'GIS设置');

    map = new BMap.Map(_id + '_mapdiv');
    map.addControl(new BMap.NavigationControl());
    var top_left_control = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_TOP_LEFT
    });
    map.addControl(new BMap.ScaleControl(top_left_control));
    /*map.addControl(new BMap.MapTypeControl());*/
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.OverviewMapControl());
    map.addOverlay(polyline);
    var cr = new BMap.CopyrightControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT
    }); //设置版权控件位置
    map.addControl(cr); //添加版权控件

    var bs = map.getBounds(); //返回地图可视区域
    cr.addCopyright({
        id: 1,
        content: "<a href='#' style='color:#fff; background:#817fd1; font:normal 12px 微软雅黑; border-radius:2px; padding:5px 10px; text-decoration: none; line-height:26px;'>源清慧虹科技有限公司</a>",
        bounds: bs
    });

    //初始化
    $.post('/manage/roadsection/location', {
        _id: _id
    }, function(rs) {
        if (rs.status) {
            initMap(rs.data, _id);
        }
        if (pointarr.length > 0) {
            map.centerAndZoom(pointarr[0], 15);
            is_add_zoom = true;
        }
        if (!is_add_zoom) {
            map.centerAndZoom(cityname, 15);
        }
    });

    //清除信息
    $('#' + _id + '_mapcontainer').find('#clearpoint,.drawmethod').on('click', function() {
        var _id = $(this).attr('_id');
        if (polyline) {
            clearmap();
        };
        addmenu(_id);
    });

    //搜索位置
    $('#' + _id + '_mapcontainer').find('.searchroad').on('click', function() {
        map.removeOverlay(marker);
        var cityname = $('#' + _id + '_mapcontainer').find('#weblocation').val();
        var localSearch = new BMap.LocalSearch(map);
        localSearch.enableAutoViewport();
        localSearch.setSearchCompleteCallback(function(data) {
            var data = data.getPoi(0);
            point2 = new BMap.Point(data.point.lng, data.point.lat);
            map.centerAndZoom(point2, 18);
            // marker = new BMap.Marker(point2);
            // map.addOverlay(marker);
            // marker.enableDragging();
        })
        localSearch.search(cityname);
    });

    //关闭
    $('#' + _id + '_mapcontainer').find('#close').on('click', function() {
        var _id = $(this).attr('_id');
        if (polyline) {
            clearmap();
        };
        addmenu(_id);
        $('#' + _id + '_mapcontainer').hide();
    });

    //保存信息
    $('#' + _id + '_mapcontainer').find('#savepoint').click(function() {
        var pointinfo = polyline.getPath();
        var data = [];
        for (var i = 0; i < pointinfo.length; i++) {
            data.push(pointinfo[i].lat);
            data.push(pointinfo[i].lng);
        };
        data = data.join();

        var _id = $(this).attr('_id');
        var roadid = $(this).attr('roadid');
        $.post('/manage/road/add', {
            location: data,
            _id: _id,
            roadid: roadid,
            modpath: 1,
        }, function(rs) {
            if (rs.status) {
                alert('保存成功');
                $('#' + _id + '_mapcontainer').hide();
                clearmap();
                $('#' + _id + '_mapcontainer').find('#savepoint').unbind('click');
            };
        });
    });
});