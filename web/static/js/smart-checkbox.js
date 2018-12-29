$('body').on('click', '.checkbox-label', function(){
	$(this).toggleClass('selected');
});

var getSelectedLabel = function() {
	var arr = [];

	$('.checkbox-label').each(function(i, el){
		if($(el).is(':visible')) {
			if($(el).hasClass('selected')) {
				var val = $(el).attr('value');
				
				if(val == '' || val == undefined) {
					val = $(el).text(); 
				}
				arr.push(val);
			}
		}
	});

	return arr;
}

/*select labels*/
/*key|key|key*/
var getSeleted = function(placeholder){

    var access = '';

    $(placeholder).find('.selected').each(function(index, el) {

        if(index) {
            access = access + '|' + $(el).attr('key');
        } else {
            access = access + $(el).attr('key');
        }
    });

    return access;
}

$('body').on('click', '.can-selected', function(event) {
    $(this).toggleClass('selected');
});

$('.selectall').click(function(event) {
    $(this).parents('legend').siblings('.can-selected').addClass('selected');
});

$('.removeall').click(function(event) {
    $(this).parents('legend').siblings('.can-selected').removeClass('selected');
});