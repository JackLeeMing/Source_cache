/*
 * set which one item should show in sidebar
 */
define(function (){

	var setNav = function(selector) {
		$('.nav-kpages').find(selector).addClass('active').parents('li').addClass('active').addClass('nav-active').addClass('open');
	};

	return {
		setNav : setNav
	};

});