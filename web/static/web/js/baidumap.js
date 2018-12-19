if( !window.bMap ) {window.bMap = {};}

bMap.Init = function(mapID,center) {
	mapID = mapID || "mapDiv";
	bMap.map = new BMap.Map(mapID,{enableMapClick:false});
	if(center){
		bMap.map.centerAndZoom(center,12);
	}else{
		bMap.setCenterAndZoom(120.299, 31.568, 12); //设置地图初始中心地理坐标及层级
	}
	
	bMap.Fun.InitDControls(); //初始化默认控件
	bMap.map.enableScrollWheelZoom(true);

	
	return bMap.map;
}

//设置地图初始中心地理坐标及层级
bMap.setCenterAndZoom = function(lng, lat, zoom) {
	bMap.map.centerAndZoom(new BMap.Point(lng, lat), zoom);
}

// 地图相关Controls方法功能函数
bMap.Controls = {
	dControls : {
		NavigationControl: new BMap.NavigationControl(),
	/*	MapTypeControl: new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_LEFT, offset: new BMap.Size(80, 15), mapTypes:[BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]}),*/
		PanoramaControl: new BMap.PanoramaControl({anchor: BMAP_ANCHOR_TOP_LEFT, offset: new BMap.Size(110, 70)}),
		ScaleControl: new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT, offset: new BMap.Size(94, 165)})
	}
}

// 地图相关Function方法函数
bMap.Fun = {
	InitDControls : function() { //初始化默认控件
		this.AddCopyRight();
		if (!$.isEmptyObject(bMap.Controls.dControls)) {	
			for(var item in bMap.Controls.dControls) {
				bMap.map.addControl(bMap.Controls.dControls[item]);
			}
		}
	},
	AddCopyRight: function() {
		var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
		var bs = bMap.map.getBounds();   //返回地图可视区域
		cr.addCopyright({id: 1, content: "<a href='http://www.smartbow.net' style='font-size: 14px;background: rgb(143, 143, 134);padding: 5px;color: #fff;' target='parent'><i>源清慧虹科技有限公司</i></a>", bounds: bs}); 
		bMap.map.addControl(cr);
	}
};

bMap.Pois = {
	markers: [],

	// 根据图标的索引设置文本的偏移
	getLabelOffset: function(iconType){
		var arrLabelOffset = [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:37, y:10}, {x:12, y:3}];
		return arrLabelOffset[iconType];
	},
	/*
     * 0: 普通图标, 1: 绿色小圆点, 2: 红色小圆点, 3: 书钉图标, 4:建议默认正常大小图标
	 */
	CreateIcon: function(iconType) {
		var img,
		    size,
		    icon;
		iconType = iconType || 0;
		switch(iconType) {
			case 0:
			    img  = "/static/web/img/location.gif";
				size = new BMap.Size(30 ,30)
				icon = new BMap.Icon(img, size);
				break;
			case 1:
				img  = "/static/web/img/location_green.png";
				size = new BMap.Size(30 ,30);
				icon = new BMap.Icon(img, size);
			    icon.setImageSize(new BMap.Size(11 ,11)) ;
			    break;
			case 2:
				img  = "/static/web/img/location_red.png";
				size = new BMap.Size(15 ,15);
				icon = new BMap.Icon(img, size);
			    icon.setImageSize(new BMap.Size(11 ,11)) ;
			    break;
			case 3:
				img  = "/static/web/img/location1.png";		
				size = new BMap.Size(40 ,80);
			    icon = new BMap.Icon(img, size);
			    icon.setImageSize(new BMap.Size(40 ,40));
			    break;
			case 4:
				img = "/static/web/img/marker_red_sprite.png";
				size = new BMap.Size(15, 20)
				icon = new BMap.Icon(img, size);
				icon.setImageSize(new BMap.Size(20 ,15)) ;
				break;
		}
		return icon;
	},
	CreatePoint: function(lng, lat) {
		return new BMap.Point(lng, lat);
	},
	CreateMarkerWithoutLabel: function(lng, lat, iconType, title) {
		return new BMap.Marker(bMap.Pois.CreatePoint(lng, lat), {
			icon: bMap.Pois.CreateIcon(iconType),
			title: title
		});
	},
	CreateMarker: function(lng, lat, iconType, label) {
		var point = bMap.Pois.CreatePoint(lng, lat);
		var marker =  new BMap.Marker(point, {icon: bMap.Pois.CreateIcon(iconType)});
		var	labelOffset = bMap.Pois.getLabelOffset(iconType);

		if (label) {
			var label = new BMap.Label(label, {"offset":new BMap.Size(labelOffset.x, labelOffset.y)});
			marker.setLabel(label);
		}

		return marker;
	},
	// markers: [marker0, marker1 ...]
	AddMarkers: function(markers) {
		markers = markers || bMap.Pois.markers;
		
		if($.isArray(markers)) {
			var length = markers.length;
			for(var i in markers) {
				bMap.map.addOverlay(markers[i]);
				if(length === parseInt(i) + 1 + 1) return true;
			}
		} else {
			bMap.map.addOverlay(markers);
			return true;
		}
	},

	removeMarker: function(markers) {
		markers = markers || bMap.Pois.markers;

		if($.isArray(markers)) {
			for(var i in markers) {
				bMap.map.removeOverlay(markers[i]);
			}
		} else {
			bMap.map.removeOverlay(markers);
		}
	},
	isOutOfRange : function (city, point) {
		/*
		 * 拾取坐标系统: http://api.map.baidu.com/lbsapi/getpoint/
		 * maxDistance计算方法: 城市中心点 和 城市较远的坐标点的距离
		 */
		var maxDistance, // '1.4 * 1.4'
			cityCenterPoint;

		switch (city) {
			case '无锡':
				maxDistance = 1.2;
				cityCenterPoint = {lat: 31.7, lng: 120.2}
				break;
			default:
			break;
		}

		var lat2 = Math.pow( (parseFloat(point.lat) - parseFloat(cityCenterPoint.lat)), 2),
			lng2 = Math.pow( (parseFloat(point.lng) - parseFloat(cityCenterPoint.lng)), 2 );

		return lat2 + lng2 > maxDistance;
	},
	showMarkerWhenClick: function(showIcon, callback) {
		var marker;

		function showMarker(e) {
			var lng = e.point.lng,
				lat = e.point.lat;

			if (callback) {
				callback(e.point);
			}
			if (marker) {
				bMap.Pois.removeMarker(marker);
			}
			marker = bMap.Pois.CreateMarker(lng, lat, 3);
			bMap.Pois.AddMarkers(marker);
		}

		bMap.map.addEventListener('click', showMarker);
	}
};

bMap.Search = {
	setOnSearchComplete: function(results) {
		var count = results.getNumPois();
		
		for(var i=0; i < count; i++) {
			var pois   = results.getPoi(i),
				lng    = pois.point.lng,
				lat    = pois.point.lat,
				title  = pois.title,
				marker = bMap.Pois.CreateMarker(lng, lat, 3, title);

			bMap.Pois.AddMarkers(marker);
		}
	},

	localSearch: function(name) {

		option = {
			onSearchComplete: bMap.Search.setOnSearchComplete
		}

		var search = new BMap.LocalSearch(bMap.map, option);
		search.search(name);
		var result = search.getResults();
	}
};

// 地图驾车路线相关操作
bMap.Route = {
	transit: null,
	//路径默认option
	defaultRouteOpton : {
		policy: BMAP_TRANSIT_POLICY_LEAST_WALKING,	//最少步行,
        renderOptions: {
			enableDragging: true //起终点可进行拖拽
		}
	},
	// callback(results)
	setOnSearchComplete : function(callback) {
		bMap.Route.defaultRouteOpton.onSearchComplete = callback;
	},
	// callback(pois)
	setOnMarkersSet: function(callback){
		bMap.Route.defaultRouteOpton.onMarkersSet = callback;
	},
	/*
		startEnd
		type: json
		{
			start:  ,  //起点(桥名或者坐标值)
			end:  ,	   //终点(桥名或者坐标值)
			isName     //isName 默认为true，说明传的参数时地名，false: 坐标值
		}
	*/
	DrawStartToEndRoute : function(startEnd, routeOption) {

		var start  = startEnd.start,
			end    = startEnd.end,
			isName = startEnd.isName || true;

		var rOption = $.extend(true, bMap.Route.defaultRouteOpton, routeOption);
		rOption.renderOptions.map = bMap.map;

		bMap.Route.transit = new BMap.DrivingRoute(bMap.map, rOption);  

	    if(isName) {
		    bMap.Route.transit.search(start ,end);
	    } else {
	    	//todo: search point
	    }
	    return bMap.Route.transit;
	},

	//startPoint: {lng:, lat:}, endPoint: {lng: , lat:}
	GetBridgesOfRoute : function(startPoint, endPoint, callback) {

		var startLng  = startPoint.lng,
			startLat  = startPoint.lat,
			endLng    = endPoint.lng,
			endLat    = endPoint.lat;

		bMap.Pois.removeMarker();
		// bMap.Pois.AddMarkers();
	}
}
