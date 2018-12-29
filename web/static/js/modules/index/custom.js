require.config({
    paths: {
        "smarturl": "/static/data/smarturl2",
        "utils": "/static/js/helper/utils" 
    }
});

define(['smarturl', 'utils'], function(URL, _){

    var init = function() {

        var addedModule = {};
        var have_add;
        var temp_have_add;

        $('.ibx-manage').click(function() {
            $('.ibx-card-manage').addClass('current');

            $('.ibx-cm-main-added .ibx-cmm-add-list').empty();
            $('.ibx-cm-main-add .ibx-cmm-add-list').empty();

            $.get('/manage/system/console', function(data) {

                var all_module = data.all_module,
                    can_add = data.can_add;

                have_add = data.have_add;
                temp_have_add = data.have_add.concat();

                $.each(can_add, function(i, val) {
                    var name = all_module[val];
                    var $liToAdd = $('<li class="ibx-cmm-add-item">').attr('id', val).attr('title',name).append('<div class="img">').append($('<p>').text(name));
                    $('.ibx-cm-main-add .ibx-cmm-add-list').append($liToAdd);
                });

                $.each(have_add, function(i, val) {
                    var name = all_module[val];
                    var $liAdded = $('<li class="ibx-cmm-add-item">').attr('id', val).attr('title',name).append('<div class="img">').append($('<p>').text(name));
                    $('.ibx-cm-main-added .ibx-cmm-add-list').append($liAdded);
                });

            });

            var top = $('body').scrollTop() + 180;

            $('.ibx-cm-main').css({
                top: top,
                right: '-1000px'
            }).animate({
                right: '0'
            });
        });

        $('body').on('click', '.ibx-cm-main-added .ibx-cmm-add-item', function() {
            var $li = $(this);
            var liID= $li.attr('id');
            have_add = _.without(have_add, liID);

            $.post('/manage/system/console', {
                value : have_add.join('|')
            }, function(data) {
                $('.ibx-cm-main-add .ibx-cmm-add-list').append($li);
            });
        });

        $('body').on('click', '.ibx-cm-main-add .ibx-cmm-add-item', function() {
            var $li = $(this);
            var liID= $li.attr('id');
            have_add.push(liID);
            $.post('/manage/system/console', {
                value : have_add.join('|')
            }, function(data) {
                $('.ibx-cm-main-added .ibx-cmm-add-list').append($li);
            });
        });

        $('.ibx-cm-main-close').click(function() {
            if(temp_have_add.sort().toString() === have_add.sort().toString()) {
                $('.ibx-card-manage').removeClass('current');
            } else {
                location.reload();                
            }
        });
    }

    return {
        init: init
    }

});

