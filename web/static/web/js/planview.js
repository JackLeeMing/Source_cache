/**
 *  windpower planeview management
 *  多视图管理
 *  requre comger_util.js
 *  var pvm = new PlaneViewManagement('#planeviews','#viewtemplate','1_1');
 *  planeviews 容器内至少有一个 class 为row 的div容器
 *  class 为 view_fix 的视图为固定视图, 不能被移动和删除, 但可以改变其大小;
 * 
 */

var Plotconfig = { modeBarButtonsToRemove:['sendDataToCloud','autoScale2d','select2d','lasso2d','hoverCompareCartesian'],
                        displaylogo: false, displayModeBar: false, showLink:false};

var PlaneViewManagement = function(ds, container_exp, mode_selector_exp) {
    var self = this;
    this.ds = ds;
    this.container = $(container_exp);
    this.container.css('height', $(window).height() - 110);
    this.mode_selector = $(mode_selector_exp);
    this.mode_selector.find('.btn').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        self.set_mode($(this).attr('mode'), $(this).attr('count'));
    })

    var v = self.container.find('.view').eq(1);
    self.container.append(v.clone().attr('id', 'view3'));
    self.container.append(v.clone().attr('id', 'view4'));
    this.container.find('.view').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    })
    
    var views = $.makeArray(this.container.find('.view')).slice(0, 4);
    self.views = $.map(views, function(v, i){
        return new View($(v), self);
    })

    self.ds.views = self.views;
    this.mode = 'twoview';
    this.set_mode(this.mode, 2);
    $(window).resize(function() {
        self.resize();
    })
}

PlaneViewManagement.prototype.set_mode = function(mode, count) {
    this.mode = mode;
    this.container.attr('class', mode);
    count = parseInt(count || 0);
    this.container.find('.view:lt(' + count + ')').show();
    this.container.find('.view:gt(' + (count - 1) + ')').hide();
    this.resize();
}

PlaneViewManagement.prototype.resize = function() {
    var self = this;
    this.container.css('height', $(window).height() - 110);
    $.each(this.views, function(i, v) {
        v.resize();
    })

    if (self.on_resize) {
        self.on_resize();
    }
}

PlaneViewManagement.prototype.on_resize = undefined;

var View = function(container, pvm) {
    this.container = container;
    this.pvm = pvm;
    // this.set_mode('line');
    this.set_mode('marker');
    var self = this;
    this.container.find('.btn_mode').click(function() {
        self.select();
        self.container.find('.btn_mode').removeClass('btn-pink').addClass('btn-white');
        $(this).remove('btn-white').addClass('btn-pink');
        var _auto_build = $(this).attr('auto_build');
        if (_auto_build) {
            self.pvm.ds.auto_build = parseBool(_auto_build);
        } else {
            self.pvm.ds.auto_build = true;
        }

        self.set_mode($(this).attr('mode'));

    })
    this.container.find('.original-mode').click(function() {
         self.pvm.ds.cut_data={};
         self.pvm.all_down_data={};
         self.pvm.show_down_data=false;
        var _auto_build = $(this).attr('auto_build');
        if (_auto_build) {
            self.pvm.ds.auto_build = parseBool(_auto_build);
        } else {
            self.pvm.ds.auto_build = true;
        }

        self.set_mode($(this).attr('mode'));
    })

    this.container.find('.show_mark').click(function() {
        self.draw_line(self.pvm.ds);
    })
    this.container.find('.del_mean').click(function() {
        self.draw_line(self.pvm.ds);
    })
    this.container.find('.btn_download').click(function() {
        var is_del_mean = $(this).parent().parent().find('.del_mean input').prop('checked');
        var _data = $.extend(true, {}, self.pvm.ds);
        self.download(_data);
    })
    this.container.find('.btnzoomin').click(function() {
        var value = $(this).attr("value");
        var windowHeight = $(window).height();
        if ( value == "min"){
          $('#viewmodeselector').hide();
          $(this).attr("value", "max");
          $(this).find('i').text("缩小");
          $(this).find('span').removeClass("fa-search-plus").addClass("fa-search-minus");
           $(this).parents('.view').addClass("zoo").siblings().addClass("zoo-in");
           self.resize();
        }else if( value == "max"){
          $('#viewmodeselector').show();
          $(this).parents('.view').removeClass("zoo").siblings().removeClass("zoo-in");
          $(this).find('span').removeClass("fa-search-minus").addClass("fa-search-plus");
          $(this).attr("value", "min");
          $(this).find('i').text("放大");
          self.resize();
        }
    })
}

View.prototype.resize = function() {
    this.set_mode(this.mode);
    var container = this.container;
}

View.prototype.select = function() {
    this.container.siblings().removeClass('active');
    this.container.addClass('active');
}

View.prototype.active = function() {
    return this.container.attr('class').indexOf('active') >= 0;
}

View.prototype.on_noselect = function() {
    this.container.find('.gdiv').html('<h4 class="select_nodes"><i class="fa fa-send"></i> 请选择绘图字段</h4>');
}

View.prototype.set_mode = function(mode) {
    this.func = 'draw';
    this.mode = mode;
    var func_name = 'draw_' + mode;
    this.container.find('.m_opt').hide();
    this.container.find('.g_' + mode).show();

    if (func_name in this.__proto__) {
        this.draw = this.__proto__[func_name];
        if (this.pvm && this.pvm.ds) {
             this.pvm.ds.__callback();
        }

    } else {
        this.draw = undefined;
    }

    this.sm = undefined;
}

View.prototype.draw_line = function(ds,cut_data) {
    var self = this;
    var c_width = this.container.width() * 0.99,
          c_height = this.container.height() - 60;
    var is_show_mark = this.container.find('.show_mark input').prop('checked');
    var is_del_mean = this.container.find('.del_mean input').prop('checked');
    var btn_download = this.container.find('.btn_download');
     var data_draw=ds.source_data;
     if(!is_empty_object(self.pvm.ds.cut_data)){
          data_draw=self.pvm.ds.cut_data;
    }
    var graphdiv = this.container.find('.gdiv')[0];
    var aw = 70 / c_width;
    var graph_data=self.pvm.ds.parse_plotly_scatter(data_draw,c_width,c_height,aw)
          this.container.find('.gdiv').html('');
    var mean_data=$.extend(true, {}, graph_data);
     $.each(graph_data.data, function(i, trace) {
            trace.mode = is_show_mark ? 'lines+markers' : 'lines';
      })
     if(is_del_mean){
        $.each(graph_data.data,function(k,v){
            var avg=0,sum=0;
            for(var i=0;i<v.y.length;i++){
                sum+=v.y[i]
            }
           avg=sum/v.y.length
           var y_arr=[]
           for(var j=0;j<v.y.length;j++){
                    y_arr.push(v.y[j]-avg)
                }
            v.y=y_arr;
        })
     }
        Plotly.newPlot(graphdiv,graph_data.data, graph_data.layout,Plotconfig);
}
View.prototype.draw_marker = function(ds,cut_data) {
    var self = this;
    var c_width = this.container.width() * 0.99,
          c_height = this.container.height() - 60;
    var is_show_mark = this.container.find('.show_mark input').prop('checked');
    var is_del_mean = this.container.find('.del_mean input').prop('checked');
    var btn_download = this.container.find('.btn_download');
     var data_draw=ds.source_data;
     if(!is_empty_object(self.pvm.ds.cut_data)&&this.container.find('.gdiv').attr('id')
      !='original-data'){
          data_draw=self.pvm.ds.cut_data;
    }
    var graphdiv = this.container.find('.gdiv')[0];
    var aw = 70 / c_width;
    var graph_data=self.pvm.ds.parse_plotly_scatter(data_draw,c_width,c_height,aw)
          this.container.find('.gdiv').html('');
    var mean_data=$.extend(true, {}, graph_data);
     $.each(graph_data.data, function(i, trace) {
            trace.mode = 'markers';
      })
     if(is_del_mean){
        $.each(graph_data.data,function(k,v){
            var avg=0,sum=0;
            for(var i=0;i<v.y.length;i++){
                sum+=v.y[i]
            }
           avg=sum/v.y.length
           var y_arr=[]
           for(var j=0;j<v.y.length;j++){
                    y_arr.push(v.y[j]-avg)
                }
            v.y=y_arr;
        })
     }

        Plotly.newPlot(graphdiv,graph_data.data, graph_data.layout,Plotconfig);
        if(this.container.find('.gdiv').attr('id')=='original-data'){
          document.getElementById('original-data').on('plotly_selected',function(data){
                    if(data){
                         self.pvm.ds.show_down_data=false;
                         self.onselect(data.points);
                    }
          })
        }

}

View.prototype.onselect = function(e){
        var self=this
        var source_data = $.extend(true, {}, this.pvm.ds.source_data);
        var source_copy = $.extend(true, {}, this.pvm.ds.source_data);

        $.each(source_data, function(key, line){
                line.x = [];
                line.y = [];
                line.min = [];
                line.max = [];
        })

        $.each(e, function(index,val){
            $.each(source_data, function(key, line){
                  if(val.curveNumber==line.ykey){
                    if(self.pvm.ds.xput_str.length==0){
                          val.x=val.x/1000
                    }
                        line.x.push(val.x);
                        line.y.push(val.y)
                        line.min.push(source_copy[key].min[val.pointNumber]);
                        line.max.push(source_copy[key].max[val.pointNumber]);
                  }
             })
        })

        self.pvm.ds.cut_data=source_data
        $(self.pvm.views).each(function(i,view){
                if(i>0){
                     //view.draw( self.pvm.ds, source_data);
                     view.draw( self.pvm.ds,self.pvm.ds.cut_data);
                }
        })
}

View.prototype.draw_linefeature = function(ds,cut_data) {
    var self = this;
    var c_width = this.container.width() * 0.99,
          c_height = this.container.height() -55;
    var data_draw=ds.source_data
    // if(cut_data){
    //     data_draw=cut_data;
    // }
     if(!is_empty_object(self.pvm.ds.cut_data)){
          data_draw=self.pvm.ds.cut_data;
    }
    var graphdiv = this.container.find('.gdiv')[0];
    var aw = 70 / c_width;
    var graph_data=self.pvm.ds.parse_plotly_linefeature(data_draw,c_width,c_height,aw)
          this.container.find('.gdiv').html('');

     Plotly.newPlot(graphdiv,graph_data.data, graph_data.layout,Plotconfig);
}


View.prototype.parse_to_table = function(datamap,cut_data,datatime) {
 var self=this;
 if(is_empty_object(self.pvm.ds.cut_data)&&!self.pvm.ds.show_down_data){//绘图数据处理
    var field_titles = ['时间'];
    if(this.pvm.ds.xput_str.length>0){
         field_titles=[this.pvm.ds.xput_str[0]];
    }
     var table_data = [];
     var length=0,x;
     $.each(datamap,function(k,v){
         length=v.x.length;
         x=v.x
         return
     })
     var datamap_extend=$.extend({},datamap);
     if(!is_empty_object(datatime)){//x轴选择非时间时
          datamap_extend=$.extend(datamap_extend,datatime);
          datamap_extend.ts={
              x:x,
              y:datatime.ts.x,
              unit:'-',
              name:'时间',
              time:true
          }
    }
      $.each(datamap_extend,function(k,v){
           if(v.name=="时间"){
                field_titles.unshift(v.name);
           }else{
                field_titles.push(v.name+'('+v.unit+')');
           }
           
     })
     length = length > 1500 ? 1500 : length;
    for(var i = 0; i < length; i++){
            var arr_tr=[];
            var ts
            $.each(datamap_extend,function(k,v){
                ts=new Date(v.x[i] * 1000).format('yyyy-MM-dd hh:mm:ss');
                if(self.pvm.ds.xput_str.length>0){
                   ts=(v.x[i]*1).toFixed(2);
                }
                return
             })
            arr_tr.push(ts)
            $.each(datamap_extend,function(k,v){
                if(v.name=='时间'){
                  arr_tr.unshift(new Date(v.y[i] * 1000).format('yyyy-MM-dd hh:mm:ss'))
                }else{
                  arr_tr.push((v.y[i]*1).toFixed(2));
                }
             })
            table_data.push(arr_tr)
        }
    
     var rs = [];
     rs.push(field_titles);
     rs.push(table_data);
     return rs;
    }else if(self.pvm.ds.show_down_data){//下载数据增加列处理
         var field_titles = ['时间'];
         var table_data = [];
         var length=0,x;
         $.each(datamap,function(k,v){
             length=v.x.length;
             x=v.x
             return
         })
          $.each(self.pvm.ds.all_down_data,function(k,v){
            field_titles.push(v.name+'('+v.unit+')');
          })
         length = length > 1500 ? 1500 : length;
        for(var i = 0; i < length; i++){
                var arr_tr=[];
                var ts
                $.each(self.pvm.ds.all_down_data,function(k,v){
                    ts=new Date(v.x[i] * 1000).format('yyyy-MM-dd hh:mm:ss');
                    return
                 })
                arr_tr.push(ts)
                $.each(self.pvm.ds.all_down_data,function(k,v){
                    arr_tr.push((v.y[i]*1).toFixed(2));
                 })
                table_data.push(arr_tr)
            }
         var rs = [];
         rs.push(field_titles);
         rs.push(table_data);
         return rs;     
    }else{//框选数据处理
        var field_titles = ['时间'];
        var rs=[];
        if(self.pvm.ds.xput_str.length>0){
             field_titles=[this.pvm.ds.xput_str[0]];
        }
        var table_data = [];
        var length=0
         // $.each(cut_data,function(k,v){
            $.each(self.pvm.ds.cut_data,function(k,v){
            var arr_item=[];
            field_titles.push(v.name+'('+v.unit+')');
            arr_item.push(field_titles);
            field_titles=[field_titles[0]];
            for (var i = 0; i < v.x.length; i++) {
                var arr_tr=[];
                if(self.pvm.ds.xput_str.length==0){
                   var ts=new Date(v.x[i] * 1000).format('yyyy-MM-dd hh:mm:ss');
                   arr_tr.push(ts);
                }else{
                    arr_tr.push(v.x[i].toFixed(2));
                }
                arr_tr.push(v.y[i].toFixed(2))
                arr_item.push(arr_tr)
            }
            rs.push(arr_item)
         })
         return rs
    }
}

View.prototype.download = function(ds,cut_data) {
     var self = this;
    if(is_empty_object(self.pvm.ds.cut_data)||self.pvm.ds.show_down_data){
        this.datamap = ds.source_data;
        var rs = self.parse_to_table(this.datamap);
        var buffer = '\ufeff';
        buffer = buffer + rs[0].join(',') + '\r\n';
        $.each(rs[1], function(i, arr) {
            buffer = buffer + arr.join(',') + '\r\n';
        })
        comger_util.download(buffer);
    }else{
        this.datamap = self.pvm.ds.cut_data;
        var rs = self.parse_to_table(this.datamap);
        var buffer = '\ufeff';
         $.each(rs, function(i, arr_tr) {
            $.each(arr_tr,function(k,arr){
                buffer = buffer + arr.join(',') + '\r\n';
            })
        })
        comger_util.download(buffer);
    }
}


View.prototype.draw_table = function(ds,cut_data) {
    var self = this;
    var c_height = this.container.height() - 55;

    this.container.find('.gdiv').html(' ');
    var table = $('<table>').addClass('table table-bordered table-hover');

    this.container.find('.gdiv').css('height', c_height);

    var rs = self.parse_to_table(ds.source_data,cut_data,ds.source_table);
    // if(cut_data){
    if(!is_empty_object(self.pvm.ds.cut_data)&&!self.pvm.ds.show_down_data){
        $.each(rs,function(i,e){
            $.each(e,function(k,v){
                if(k==0){
                     var thead = $('<thead>').append('<tr>');
                     $.each(v, function(m, t) {
                        thead.find('tr').append($('<th>').text(t));
                    })
                    table.append(thead);
                }else{
                        var tbody = $('<tbody>').append('<tr>');
                        $.each(v, function(m, t) {
                            tbody .find('tr').append($('<td>').text(t));
                        })
                        table.append( tbody);
                 }
            })
        })
    }else{
        var field_titles = rs[0]
        var thead = $('<thead>').append('<tr>');
        $.each(field_titles, function(i, output) {
            thead.find('tr').append($('<th>').text(output));
        })
        table.append(thead);
        var tbody = $('<tbody>');
        $.each(rs[1], function(i, arr) {
            var tr = $('<tr>');
            $.each(arr, function(c, val) {
                tr.append($('<td>').text(val));
            })
            tbody.append(tr);
        })

        table.append(tbody);
    }
    this.container.find('.gdiv').append(table);
}

View.prototype.draw_nodebook = function(ds) {

}

