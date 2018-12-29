require.config({

	baseUrl : "/static/js",

	paths: {
        //首页用到的自定义模块
        "daolfb" : "modules/roadindex/daolfb",
        "lwtj" : "modules/roadindex/lwtj",
		"xunjgz_section" : "modules/roadindex/xunjgz_section",
        "dingjgz" : "modules/roadindex/dingjgz",
		"xunjdisease" : "modules/roadindex/xunjdisease",
		"dingjdisease" : "modules/roadindex/dingjdisease",
		"yanghdisease" : "modules/roadindex/yanghdisease"
	}

});

//自定义模块加载
require(['daolfb', 'lwtj','xunjgz_section', 'dingjgz', 'xunjdisease', 'dingjdisease', 'yanghdisease'], function(daolfb,lwtj, xunjgz_section, dingjgz, xunjdisease, dingjdisease, yanghdisease){

    if($('#module-daolfb').length) {
        try {
            daolfb.init();
        } catch (e) {
            console.log(e);
        }
    }

    if($('#module-lwtj').length) {
        try {
            lwtj.init();
        } catch (e) {
            console.log(e);
        }
    }


    if($('#module-dingjgz').length) {
        try {
            dingjgz.init();
        } catch (e) {
            console.log(e);
        }
    }

		if($('#module-xunjgz-section').length) {
        try {
            xunjgz_section.init();
        } catch (e) {
            console.log(e);
        }
    }

	if($('#module-xunjdisease').length) {
		try {
			xunjdisease.init();
		} catch (e) {
		 	console.log(e);
		}
	}

	if ($('#module-dingjdisease').length) {
		try {
			dingjdisease.init();
		} catch (e) {
			console.log(e);
		}
	}

	if ($('#module-yanghdisease').length) {
		try {
			yanghdisease.init();
		} catch (e) {
			console.log(e);
		}
	}

});
