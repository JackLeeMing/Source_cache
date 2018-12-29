$(function(){
    var weixiuModal = $(document.getElementById('modal-weixiu')
                      || window.parent.document.getElementById('modal-weixiu')
                      || window.parent.parent.document.getElementById('modal-weixiu'));
	$('body').on('click', '.weixiu', function(){
		var src = [];
		var bridgeid    = $(this).attr('bridgeid'),
			diseaseid   = $(this).attr('diseaseid'),
        	content     = $(this).attr('content'),
            diseasetype   = $(this).attr('diseasetype');

    	if (bridgeid) {
    		src.push('bridgeid=' + bridgeid);
    	}
    	if (diseaseid) {
    		src.push('diseaseid=' + diseaseid);
    	}
    	if (content) {
    		src.push('content=' + content);

    	}
        if (diseasetype) {
            src.push('diseasetype=' + diseasetype);
        }
        src = '/repair/record?' + src.join('&');

        weixiuModal.find('iframe').attr('src', src);
        weixiuModal.modal('show');
	});

	// 巡检信息道路维修
	$('body').on('click', '.road-xunj-weixiu', function() {
		var src = [];
		var roadid = $(this).attr('roadid'),
			diseaseid = $(this).attr('diseaseid');

		if (roadid) src.push('roadid=' + roadid);
		if (diseaseid) src.push('diseaseid=' + diseaseid);

		src = '/road/xunj/repair/record?' + src.join('&');

		weixiuModal.find('iframe').attr('src', src);
		weixiuModal.modal('show');
	});

	// 定检信息道路维修
    $('body').on('click', '.road-weixiu', function(){
        var src = [];
        var roadid    = $(this).attr('roadid'),
            diseaseid   = $(this).attr('diseaseid'),
            content     = $(this).attr('content'),
            diseasetype   = $(this).attr('diseasetype');

        if (roadid) {
            src.push('roadid=' + roadid);
        }
        if (diseaseid) {
            src.push('diseaseid=' + diseaseid);
        }
        if (content) {
            src.push('content=' + content);

        }
        if (diseasetype) {
            src.push('diseasetype=' + diseasetype);
        }
        src = '/road/dingj/repair/record?' + src.join('&');

        weixiuModal.find('iframe').attr('src', src);
        weixiuModal.modal('show');
    });

	// 养护评估道路维修
	$('body').on('click', '.road-yangh-weixiu', function() {
		var src = [];
		var roadid = $(this).attr('roadid'),
			diseaseid = $(this).attr('diseaseid');

		if (roadid) src.push('roadid=' + roadid);
		if (diseaseid) src.push('diseaseid=' + diseaseid);

		src = '/road/yangh/repair/record?' + src.join('&');

		weixiuModal.find('iframe').attr('src', src);
		weixiuModal.modal('show');
	});

    weixiuModal.find('.close').click(function(){
        weixiuModal.modal('hide');
        location.reload();
    });

});
