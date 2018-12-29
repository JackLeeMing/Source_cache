var CompanyList = {

    // 启动
    init: function () {
        this.initList();
    },

    // 初始化公司列表
    initList: function() {
        $.get('/company/bridge/companymanage', function(data) {
            var len = data.data.length;
            
            if (len === 0) {
                $('.manage-company').addClass('hide');
            }
            
            $('#units-num').text(len);

            $.each(data.data, function(index, val) {
                var _id = val._id;
                var name = val.name;
                $tmp = $('#tmp').clone();
                $tmp.attr('id', _id).removeClass('hide').find('.name').text(name).attr('title', name);
                $tmp.find('a').attr('href', '/company/company?companyid=' + _id);
                $('#units').append($tmp);
            });

            try {
                if (companyid) {
                    $('#' + companyid).addClass('active').parents('li').addClass('active').addClass('nav-active').addClass('open');
                }
            } catch (e) {
            }
        });
    }
};

// 自动加载公司列表
CompanyList.init();