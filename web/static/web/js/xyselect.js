var ds=DataSource.reset()
ds.downData=[]
var treedata = [];
$.ajaxSetup({
    async: false
});

$.get("/deploy_map",function(rs){
   treedata=rs.data;
})

$(function() {
    var $tree = $('#treey');
    $tree.tree({
        data: treedata,
        autoOpen:false,
    });
    $tree.on(
        'tree.click',
        function(e) {
            e.preventDefault();
            var selected_node = e.node;
            if (selected_node.children.length== 0) {
               if ($tree.tree('isNodeSelected', selected_node)&&ds.downData.indexOf(selected_node.code)>-1){
                  $tree.tree('removeFromSelection', selected_node);
                  ds.rm_output(selected_node.code);
                  ds.downData.remove(selected_node.code)
                   $('#pop_container_y .r_ul').find('li[code='+selected_node.code+']').remove();
                } else {
                    if($('#pop_container_y .r_ul li').length<4){
                       if(ds.downData.indexOf(selected_node.code)==-1){
                         $tree.tree('addToSelection', selected_node);
                         ds.add_output(selected_node.code);
                         ds.downData.push(selected_node.code)
                         $('#pop_container_y .r_ul').append($('<li>').html(selected_node.name).attr('code',selected_node.code));
                       }
                    }else{
                      alert('最多选取四个字段!')
                    }
                }
            }
        }
    );
    $('#pop_container_y .r_ul').on('click','li',function(){
      var _id=$(this).attr('code');
      var node =$tree.tree('getNodeById', _id);
      $tree.tree('removeFromSelection',node);
      ds.rm_output(_id);
      ds.downData.remove(_id)
      $(this).remove();
    })
});

$(function() {
    var $treex = $('#treex');
    $treex.tree({
        data: treedata,
        autoOpen:false
    });
    $treex.on('tree.click',function(e){
      resetDatasource();
      var selected_node = e.node;
      if (selected_node.children.length== 0){
         ds.rm_xput(true);
         ds.downData.remove($('#pop_container_x .r_ul').find('li').attr('code'))
         $('#pop_container_x .r_ul').find('li').remove();
         ds.downData.push(selected_node.code)
         ds.add_xput(selected_node.code,selected_node.name+"("+selected_node.unit+")");
         $('#pop_container_x .r_ul').append($('<li>').html(selected_node.name).attr('code',selected_node.code));
      }else{
        e.preventDefault();
      }
    })
});

$(function() {
    var $treexy = $('#treexy');
    $treexy.tree({
        data: treedata,
        autoOpen:false
    });
    $treexy.on(
        'tree.click',
        function(e) {
            e.preventDefault();
            var selected_node = e.node;
            if (selected_node.children.length== 0) {
               if ($treexy.tree('isNodeSelected', selected_node)) {
                  $treexy.tree('removeFromSelection', selected_node);
                  ds.downData.remove(selected_node.code)
                   $('#pop_container_xy .r_ul').find('li[code='+selected_node.code+']').remove();
                } else {
                    if($('#pop_container_xy .r_ul li').length<10){
                      if(ds.downData.indexOf(selected_node.code)==-1){
                       $treexy.tree('addToSelection', selected_node);
                       ds.downData.push(selected_node.code)
                       $('#pop_container_xy .r_ul').append($('<li>').html(selected_node.name).attr('code',selected_node.code));
                     }else{
                      alert('字段已选择!')
                     }
                    }else{
                      alert('最多选取十个字段!')
                    }
                }
            }
        }
    );
    $('#pop_container_xy .r_ul').on('click','li',function(){
        var _id=$(this).attr('code');
        var node =$treexy.tree('getNodeById', _id);
        $treexy.tree('removeFromSelection',node);
        ds.downData.remove(_id)
        $(this).remove();
      });
    $('.panel_view').on('click','.btn_alldown',function(){
           ds.downData=[];
           $('#pop_container_xy .r_ul li').each(function(i,v){
              var tree_id=$(v).attr('code');
              var node =$treexy.tree('getNodeById', tree_id);
              $treexy.tree('removeFromSelection', node);
          })
          $('#pop_container_xy .r_ul').html($('#pop_container_x .r_ul').html());
          $('#pop_container_xy .r_ul').append($('#pop_container_y .r_ul').html())
          $('#pop_container_x .r_ul li').each(function(i,v){
              var tree_id=$(v).attr('code');
              ds.downData.push(tree_id)
              var node =$treexy.tree('getNodeById', tree_id);
              $treexy.tree('addToSelection', node);
         })
          $('#pop_container_y .r_ul li').each(function(i,v){
              var tree_id=$(v).attr('code');
              ds.downData.push(tree_id)
              var node =$treexy.tree('getNodeById', tree_id);
              $treexy.tree('addToSelection', node);
          })

      })
});
