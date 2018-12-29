define(function(){

    var initCard = function(url) {
        $.get(url, function(data) {
            $.each(data.data, function(index, val) {

                val = '' ? '0' : val;
                $('.' + index).text(val);
            });
        });
    }

    var init = function() {
	    initCard('/manage/bridge/count');
        initCard('/manage/user/count');
        initCard('/manage/disease/count');
    }

    return {
    	initCard : initCard,
    	init : init
    }
});