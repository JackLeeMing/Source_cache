MyRoadApp = {
    hasInitTree : false,
    search:function(opts,callback){
        $.get('/manage/road/tree', opts, function(data){

            if (data.status) {
                MyRoadApp.hasInitTree = true;
                var treeData = data.data;
                MyRoadApp.initTree(treeData);

                var roadid = util.getCookie('roadid');

                if (roadid === '') {
                    roadid = $('span.road:eq(0)').attr('roadid');
                }

                MyRoadApp.focusRoad(roadid);
                if(callback){
                    callback()
                }
            }
        });


    },

    init: function() {
        if (!this.hasInitTree) {
            MyRoadApp.search({'type':0})
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
    },

    initTree: function(treeData) {
        $('.tree ul').empty();

        $.each(treeData, function(index, val) {
            var roadCount = val.road.length;
            if(roadCount == 0 ) return true;

            $li = $('<li>').append('<span>').append('<ul>');
            $li.find('ul').hide();
            $li.children('span').html($('<b class="be-inline">').text(val.name));
            $li.children('span').addClass('Expand this branch').prepend('<label class="label road-count">' + roadCount + '</label>').prepend('<i class="icon-plus-sign"></i>');

            $.each(val.road, function(index, val) {
              $li_2 = $('<li>').append('<a class="road-a" href="/manage/road/guany?roadid=' + val._id + '">');
              $li_2.children('a').append('<span>');
              $li_2.find('span').attr('title', val.name).text(val.name).attr('roadid', val._id).addClass('road').attr('id', 'li-' + val._id);;
              // $li_2.hide();
              $li.children('ul').append($li_2);
            });
            $('.tree > ul').append($li);
        });

        MyRoadApp.initTreeUI();
    },

    giveHrefLoadid: function(roadid) {
        $('.need-roadid').each(function(i, el){
            var url = $(el).attr('url');
            $(el).attr('href', url + '?roadid=' + bridgeid);
        });
    },

    focusRoad: function(roadid) {
        var $span = $('.parent_li span[roadid="' + roadid + '"]'),
            txt = $span.text();

        $('.parent_li .road').removeClass('tree-selected');

        $span.addClass('tree-selected').closest('ul').css('display', 'block').siblings('ul');
        $('.road-name').text(txt);

        // 当前桥所在li元素之前的所有li元素的个数
        var prevLiCount = $span.closest('li').prevAll('li').length;

        // 30 每一个桥所占li元素的高度
        $('.parent_li .tree').scrollTop(30 * prevLiCount);

        MyRoadApp.giveHrefLoadid(roadid);
    }

}

if (util.getCookie('roadid') === '') {
    MyRoadApp.init();
}

$('#bridgeview').click(MyRoadApp.init);

$('#bridge-container .items').on('change', 'select', function(){
   var items = MyRoadApp.getTreeItems();
   MyRoadApp.search(items);
   return false;
})

$('#bridge-container').on('click', '.road', function(e){
    var roadid = $(this).attr("roadid");
    util.setCookie('roadid', roadid);
});

var flag;
$('#tree-search').on('keydown',function(event) {
    var that = this;
    flag = $(that).val();

    setTimeout(function(){
      if($(that).val().length == 1) return false;

      var items = MyRoadApp.getTreeItems();
      items.term = $(that).val();
      MyRoadApp.search(items,function(){
            $('.tree li.parent_li:eq(0) > span').parent('li.parent_li').children('span').click();
      });

    }, 500);
});
