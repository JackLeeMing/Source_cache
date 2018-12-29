require.config({
    paths : {
        "smarturl" : "/static/data/smarturl2"
    }
});

define(['smarturl'], function(URL){

    var init = function() {
        $(".sort-content").sortable({
            handle : '.sort-drag',
            revert : true,
            scroll : true,
            update : function(event, ui) {
                resetIndex();
                var sortData = getIndex();

                $.post(URL.systemConsole, {value: sortData.join('|')}, function(data){
                    console.log(data);
                });

            }
        });
    }

    var resetIndex = function() {
        $('.sort-content > div').each(function(i, el) {
            $(el).attr('module-index', i);
        })
    }

    var getIndex = function() {
        var sortData = [];

        $('.sort-content > div').each(function(i, el) {
            sortData.push($(el).attr('id'));
        })

        return sortData;
    }

    return {
        init : init
    }
});