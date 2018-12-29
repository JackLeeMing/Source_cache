MyBridgeApp = {
    hasInitTree : false,

    init: function() {
        if (!this.hasInitTree) {
            $.get('/manage/bridge/tree', {type:0}, function(data){
                if (data.status) {
                    MyBridgeApp.hasInitTree = true;
                    var treeData = data.data;
                    MyBridgeApp.initTree(treeData);

                    var bridgeid = util.getCookie('bridgeid');

                    if (bridgeid === '') {
                        bridgeid = $('span.bridge:eq(0)').attr('bridgeid');
                    }

                    MyBridgeApp.focusBridge(bridgeid);
                }
            });
        }
    },

    getTreeItems: function() {
        var result = {};
        $('.items select').each(function(index, el) {
            var $opt = $(el).find('option:selected');
            var key = $(el).attr('key');
            var val = $opt.val();

            if(val != '') {
                result[key] = val;
            }
        });
        return result;
    },

    initTreeUI: function() {
        $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
        $('.tree li.parent_li > span').on('click', function(e) {
            var children = $(this).parent('li.parent_li').find(' > ul');
            if (children.is(":visible")) {
                children.hide('fast');
                $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
            } else {
                children.show('fast');
                $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
            }
            e.stopPropagation();
        });

        // if(bridgeid == '') {
        //     $('.tree li.parent_li:eq(0) > span').parent('li.parent_li').find('span').click();
        //     $('.tree li.parent_li:eq(0) > span').parent('li.parent_li').find(' > ul > li > a > span').get(0).click();
        // } else {
        //     $('#li-' + bridgeid).click();
        //     $('#li-' + bridgeid).parents('.parent_li').children('span').click();
        // }
    },

    initTree: function(treeData) {
        $('.tree ul').empty();

        $.each(treeData, function(index, val) {
            var bridgeCount = val.bridge.length;
            if(bridgeCount == 0 ) return true;

            $li = $('<li>').append('<span>').append('<ul>');
            $li.find('ul').hide();
            $li.children('span').html($('<b class="be-inline">').text(val.name));
            $li.children('span').addClass('Expand this branch').prepend('<label class="label bridge-count">' + bridgeCount + '</label>').prepend('<i class="icon-plus-sign"></i>');

            $.each(val.bridge, function(index, val) {
              $li_2 = $('<li>').append('<a class="bridge-a" href="/manage/bridge/guany?bridgeid=' + val._id + '">');
              $li_2.children('a').append('<span>');
              $li_2.find('span').attr('title', val.name).text(val.name + "(" + (val.no || '') + ")").attr('bridgeid', val._id).addClass('bridge').attr('id', 'li-' + val._id);;
              // $li_2.hide();
              $li.children('ul').append($li_2);
            });
            $('.tree > ul').append($li);
        });

        MyBridgeApp.initTreeUI();
    },

    giveHrefBridgeid: function(bridgeid) {
        $('.need-bridgeid').each(function(i, el){
            var url = $(el).attr('url');
            $(el).attr('href', url + '?bridgeid=' + bridgeid);
        });
    },

    focusBridge: function(bridgeid) {
        var $span = $('#bridge-container span[bridgeid="' + bridgeid + '"]'),
            txt = $span.text();

        $('#bridge-container .bridge').removeClass('tree-selected');

        $span.addClass('tree-selected').closest('ul').css('display', 'block').siblings('ul');
        $('.bridge-name').text(txt);

        // 当前桥所在li元素之前的所有li元素的个数
        var prevLiCount = $span.closest('li').prevAll('li').length;

        // 30 每一个桥所占li元素的高度
        $('#bridge-container .tree').scrollTop(30 * prevLiCount);

        MyBridgeApp.giveHrefBridgeid(bridgeid);
    }

}

if (util.getCookie('bridgeid') === '') {
    MyBridgeApp.init();
}

$('#bridgeview').click(MyBridgeApp.init);

$('#bridge-container .items').on('change', 'select', function(){
   var items = MyBridgeApp.getTreeItems();
   var treeData = SmartData.getTree(items);
   MyBridgeApp.initTree(treeData);
   return false;
})

$('#bridge-container').on('click', '.bridge', function(e){
    var bridgeid = $(this).attr("bridgeid");
    util.setCookie('bridgeid', bridgeid);
});

var flag;
$('#tree-search').on('keydown',function(event) {
    var that = this;
    flag = $(that).val();

    setTimeout(function(){
      if($(that).val().length == 1) return false;
      var treedata = SmartData.getTree({term: $(that).val()});
      MyBridgeApp.initTree(treedata);

      $('.tree li.parent_li:eq(0) > span').parent('li.parent_li').children('span').click();
    }, 500);
});
