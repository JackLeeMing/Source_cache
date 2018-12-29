require.config({

    baseUrl : "/static/js",

    paths: {
        "baiduchart" : "modules/baiduchart"
    }

});


define(['baiduchart'], function(baiduchart){

	var initDistrTable = function(type, flag) {
        var data = SmartData.getBridgeAreaCount(type, flag);
        $('#dis-' + type).html(data.data);
    }

    var getTimeType = function() {
        return $('#btns-time .dropdown-toggle').attr('type');
    }

    var getCompanyType = function() {
        return $('#btns-company .dropdown-toggle').attr('type');
    }

    var getContentType = function() {
        return $('#btns-content .selected').attr('type');
    }


    var drawCompanyBtnList = function(placeholder, data) {
        $('#' + placeholder).empty();
        var temp = '<button class="btn btn-sm btn-primary dingj-btn"></button>';
        $.each(data, function(index, val) {
            $btn = $(temp);
            $btn.text(val.name);
            $('#' + placeholder).append($btn);
        });
    }

    var initTimeZone = function() {
        $('#nutrition-chart-text').text('');
       
        $.post(urlMap.manageBridgeStatis, {company_type: getCompanyType(),time_type: getTimeType(),content_type:getContentType() }, function(data){
            var data = data.data;
            var chartData = [];

            $.each(data, function(index, val) {
                var name = val['name'];
                var rate = val[getContentType()]['rate'];
                var id = val['_id'];

                chartData.push({
                    name: name,
                    value: rate,
                    key: id
                });
            });

            baiduchart.drawEChart('nutrition-chart' ,chartData, '', 'showPercent');
            drawCompanyBtnList('dingj-btns' ,chartData);
        });
    }

    var initDetailGph = function(type, flag) {
        var data = SmartData.getBridgeAreaCount(type, flag);
        var pie_data = data.pie_data;
        var graphData = [];

        $.each(pie_data, function(index, val) {
            graphData.push({
                name: val[0].split('|')[0],
                value: val[1],
                key: val[0].split('|')[1]
            });
        });
        baiduchart.drawEChart2('graph-detail', graphData);
    }


    return {
        initDistrTable : initDistrTable,
        getTimeType : getTimeType,
        getCompanyType : getCompanyType,
        getContentType : getContentType,
        drawCompanyBtnList : drawCompanyBtnList,
        initTimeZone : initTimeZone,
        initDetailGph : initDetailGph
    }

});

