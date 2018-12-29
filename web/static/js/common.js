$(function(){
    $('body').on('keydown', '#bridge-search', function(event) {
        var text = $(this).val();
        if(event.keyCode == 13) {
          $.get('/company/bridge/search?type=master&term=' + text, function(ui) {
            // 没有准确定位,则返回错误
            if (1 != eval(ui).length) {
                alert("未能搜索到桥梁.");
              return;
            }

            var bridgeid = eval(ui)[0]._id;
            location.href = '/manage/bridge/guany?bridgeid=' + bridgeid;
            // window.open('/manage/bridge/guany?bridgeid=' + bridgeid,'_top');
          });
        }
    });

    $('body').on('keydown', '#road-search', function(event) {
        var text = $(this).val();
        if(event.keyCode == 13) {
          $.get('/company/road/search?type=master&term=' + text, function(ui) {
            // 没有准确定位,则返回错误
            if (1 != eval(ui).length) {
                alert("未能搜索到道路.");
              return;
            }

            var roadid = eval(ui)[0]._id;
            location.href = '/manage/road/guany?roadid=' + roadid;
            // window.open('/manage/bridge/guany?bridgeid=' + bridgeid,'_top');
          });
        }
    });

    
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function(ul, items) {
            var that = this,
                currentCategory = "";
                $.each(items, function(index, item) {
                    if (item.category != currentCategory && item.category) {
                        ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                        currentCategory = item.category;
                    }
                    that._renderItemData(ul, item);
                });
        }
    });
    

    $('table input[type="checkbox"]').click(
        function() {
            $(this).parents('tr').toggleClass('selected');
        }
    );

    $('table th input:checkbox').on('click', function() {
        var that = this;
        $(this).closest('table').find('tr > td:first-child input:checkbox')
            .each(function() {

                this.checked = that.checked;
                if($(that).parents('tr').hasClass('selected')){
                    $(this).closest('tr').addClass('selected');
                } else {
                    $(this).closest('tr').removeClass('selected');
                }

            });

    });

    $('#undobtn').click(function(event) {
        var uid = $(this).parents('form').find('input[name="_id"]').val();
        console.log(uid);
        $('tbody tr').each(function(index, el) {
            if( $(el).attr('id') == uid) {
                $(el).find('.lockbtn').click();
            }
        });
    });

    $(".postcode").catcomplete({
        delay: 20,
        minLength: 2,
        source: "/area/code"
    });

    $(".postname").catcomplete({
        delay: 20,
        minLength: 1,
        source: "/area/name"
    });

    $("#bridge-search").catcomplete({
        delay: 20,
        minLength: 1,
        source: "/company/bridge/search?type=master",
        select: function( event, ui ) {
            var bridgeid = ui.item._id;
            window.open('/manage/bridge/guany?bridgeid=' + bridgeid,'_top');
        }
    });

    $("#road-search").catcomplete({
        delay: 20,
        minLength: 1,
        source: "/company/road/search?type=master",
        select: function( event, ui ) {
            var roadid = ui.item._id;
            window.open('/manage/road/guany?roadid=' + roadid,'_top');
        }
    });

   $.fn.extend({
       FixedHead: function (options) {
           var op = $.extend({ tableLayout: "auto" }, options);
           return this.each(function () {
               var $this = $(this); //指向当前的table
               var $thisParentDiv = $(this).parent(); //指向当前table的父级DIV，这个DIV要自己手动加上去
               $thisParentDiv.wrap("<div class='fixedtablewrap'></div>").parent().css({ "position": "relative" }); //在当前table的父级DIV上，再加一个DIV
               var x = $thisParentDiv.position();

               var fixedDiv = $("<div class='fixedheadwrap' style='clear:both;overflow:hidden;z-index:2;position:absolute;' ></div>")
           .insertBefore($thisParentDiv)//在当前table的父级DIV的前面加一个DIV，此DIV用来包装tabelr的表头
           .css({ "width": $thisParentDiv[0].clientWidth, "left": x.left, "top": x.top });

               var $thisClone = $this.clone(true);
               $thisClone.find("tbody").remove(); //复制一份table，并将tbody中的内容删除，这样就仅余thead，所以要求表格的表头要放在thead中
               $thisClone.appendTo(fixedDiv); //将表头添加到fixedDiv中

               $this.css({ "marginTop": 0, "table-layout": op.tableLayout });
               //当前TABLE的父级DIV有水平滚动条，并水平滚动时，同时滚动包装thead的DIV
               $thisParentDiv.scroll(function () {
                   fixedDiv[0].scrollLeft = $(this)[0].scrollLeft;
               });

               //因为固定后的表头与原来的表格分离开了，难免会有一些宽度问题
               //下面的代码是将原来表格中每一个TD的宽度赋给新的固定表头
               var $fixHeadTrs = $thisClone.find("thead tr");
               var $orginalHeadTrs = $this.find("thead");
               $fixHeadTrs.each(function (indexTr) {
                   var $curFixTds = $(this).find("td");
                   var $curOrgTr = $orginalHeadTrs.find("tr:eq(" + indexTr + ")");
                   $curFixTds.each(function (indexTd) {
                       $(this).css("width", $curOrgTr.find("td:eq(" + indexTd + ")").width());
                   });
               });
           });
       }
   });
})
 
