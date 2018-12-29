/**
 *  jquery 表格编辑能用插件, 用于简单文字输入内容的编辑
 *  author comger@gmail.com
 *
**/

(function($){

    /**
     *  Usage :

        $('#table').tableEditor({
            onsave:function(tfoot, data){
                
            }
        })
    **/

    $.fn.tableEditor = function(options){
        $('.editorform').hide();
       
        var temp_tr = $('#tr-template').text(),
            buttonClass = options.buttonClass;

        function _onsave(tr,data){
            console.log('onsave',tr,data);
        }

        function _ondel(tr,i){
            console.log('ondel',tr,i);
        }


        return this.each(function(){

            var defaultOpt = {
                onsave:_onsave,
                ondel:_ondel
            };

            var edit_tr_index = -1;


            options= $.extend(defaultOpt,options);

            //当前元素
            var eml = $(this);
            eml.append(temp_tr);
            var editorform = eml.find('.editorform');

            var editor_tds = editorform.find('td');

            function oneditbtn_click(i,etr){
                if(edit_tr_index>-1){
                    eml.children('tbody').children('tr').eq(edit_tr_index).show();
                }

                // 编辑操作 将内容复制到input
                edit_tr_index = i;
                $(etr).find('td').each(function(m,etd){
                    var editor_input = $(editor_tds[m]).find('input');
                    if(editor_input.length >0){
                        editor_input.val($.trim($(etd).text()));
                        editor_input.attr('index',m);
                    }
                    
                })

                $(etr).parents('table').find('tr').removeAttr('editing');
                $(etr).attr('editing', true);
                $(etr).hide();
                editorform.insertAfter($(etr));
                editorform.show();
            }


            editorform.find('.savebtn').click(function(e){
                var data = {};

                if(edit_tr_index==-1){
                    // 新加数据
                    var _tr = editorform.clone();
                    _tr.find('td').each(function(i,etd){
                        var _input = $(etd).children('input');
                        if(_input.length>0){
                            $(etd).html($(_input).val());
                        }
                    })

                    _tr.find('button').html('编辑').click(function(event) {
                        oneditbtn_click(eml.children('thead').children('tr').size(),_tr.children('tr'));
                    });


                    var _tds = _tr.find('td');

                    editorform.find('input').each(function(i,el){
                        data[$(this).attr('name')] = $(this).val();
                        _tds.eq(parseInt($(this).attr('index'))).html($(this).val());

                    });
                    console.log(_tr);
                    eml.children('tbody').prepend(_tr);


                }else{
                    // 修改数据
                    var _tr = eml.children('tbody').children('tr').eq(edit_tr_index);
                    _tr.show();
                    var _tds = _tr.find('td');

                    editorform.find('input').each(function(i,el){
                        data[$(this).attr('name')] = $(this).val();
                        _tds.eq(parseInt($(this).attr('index'))).html($(this).val());

                    })
                }
                
                options.onsave(editorform, data)
                editorform.hide();
                
            });
            
            // 在表头添加操作列
            var newbtn = $('<button>').attr('type','button').html('添加').addClass(buttonClass.join(' '));;
            var add_td = $('<td>').append(newbtn);
            
            newbtn.click(function(event) {
                eml.find('tr').show();
                editorform.find('input').val('');
                eml.find('thead').append(editorform);
                editorform.addClass('newtr').show();
            });
            eml.find('thead tr').append(add_td);

            //在每行后面添加 编辑按钮
            eml.children('tbody').children('tr').each(function(i,etr){
                var btn = $('<button>').attr('type', 'button').html("编辑").addClass(buttonClass.join(' '));
                var del_btn = $('<button>').attr('type', 'button').html("删除").addClass('btn btn-sm btn-danger');
                var edit_td = $('<td>').append(btn);
                edit_td.append(del_btn);

                btn.click(function(e){
                    oneditbtn_click(i,etr);
                    $(etr).addClass('edittr');
                });

                del_btn.click(function(event) {
                    options.ondel(etr,i);
                });

                $(this).append(edit_td); 


            })


        })
    }



})(jQuery); 