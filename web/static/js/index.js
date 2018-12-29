require.config({

	baseUrl : "/static/js",

	paths: {
        //首页用到的自定义模块
        "card" : "modules/index/card",
        "qiaolfb" : "modules/index/qiaolfb",
        "dingjgz" : "modules/index/dingjgz",
        "xunjgz" : "modules/index/xunjgz",
        "disease" : "modules/index/disease"
	}

});

//自定义模块加载
require(['qiaolfb', 'xunjgz', 'disease'], 
        function(qiaolfb, xunjgz, disease){

    if($('#module-qiaolfb').length) {
        try {
            qiaolfb.init();
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

    if($('#module-xunjgz').length) {
        try {
            xunjgz.init();
        } catch (e) {
            console.log(e);
        }
    }

     if($('#module-disease').length) {
         try {
            disease.init();
        } catch (e) {
             console.log(e);
         }
     }
});

