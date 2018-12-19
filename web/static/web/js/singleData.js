/**
 *  数据源模块
 *  author comger@gmail.com
 *  1. 支持多种数据查询条件组合查询
 *  2. 以多种显示交互方式（面板）渲染; 每个面板可以有共同或独立的交互功能
 *  3. 每种传感类型可以有不同的交互支持
 *  4. 允许后期添加扩展传感类型交互支持
 *  5. 允许后期添加扩展面板交互功能
 *  source_data = {
 *    node_output : { count:n, x: [], y :[], mean : 0.0, max:0.0 , min : 0.0},
 *    2_strain : { count:1000, x: [], y :[], mean : 0.0, max:0.0 , min : 0.0},
 *    2_temp : { count:1000, x: [], y :[], mean : 0.0, max:0.0 , min : 0.0}
 *  }
 */
function is_empty_object(obj){
    for(var k in obj){
        return false;
    }
    return true;
}

var DataSource = {
    views:[],
    output_arr:[],
    xput_arr:[],
    xput_str:[],
    cur_time_area :[],
    source_data : {},  // 当前查询条件下的所有原始数据
    source_table : {},  
    cut_data:{},
    auto_build : false, // 是否自动重新加载数据渲染
    on_ajax_flag:0,
    all_down_data:{},
    show_down_data:false
};

DataSource.reset = function(code_name, fj_num){
    this.code_name = code_name;
    this.fj_num = fj_num;
    //this.output_arr = [];
    this.source_data = {};
    this.api = '/wt/analyse/xy?code_name={0}&fj_num={1}'.format(code_name,fj_num);
    this.__callback();
    return this
}

DataSource.on_noselect = function(){
    $.each(this.views, function(i,v){
        if(v.on_noselect){ v.on_noselect(); }
    });
}

DataSource.on_nodata = function(){
  alert('没有返回数据!')
}
DataSource.on_requesting = function(){
  loading("正在加载中...", 'show')
}
DataSource.on_error = function(msg,e){
   console.log(msg,e);
   alert(msg);
}

DataSource.__fetch = function(output,x_put){
    var self = this;
    output = output|| 'val';
    self.on_requesting();
   // var url = self.api +'&out1='+output +'&start='+this.cur_time_area[0]+'&end='+this.cur_time_area[1];
   if(x_put.length==0){
        x_put=['ts'];
   }
      var url = self.api +'&y='+output +'&start='+this.cur_time_area[0]+'&end='+this.cur_time_area[1]+'&x='+x_put[0];
      self.on_ajax_flag = 1;

    $.ajax({
        type: "get",
        async:true,
        contentType: "application/json",
        url: url,
        dataType: "json",
        success: function(rs) {
             if(rs.data){
                  $(rs.data).each(function(i, v){
                        if(self.xput_arr.length>0&&x_put[0]=='ts'){
                              self.source_table['ts']=v
                        }else{
                              var key = "{0}_{1}_{2}".format(self.code_name, self.fj_num, v.key);
                              self.source_data[key] = v;
                              loading("正在加载中...", 'hide')
                        }
                  })
             }

              /**
                  如果连续多个请求同时发出; 会出现绘图闪屏, 需要优化
                  延迟 1000 毫秒, 执行绘图程序, 下一个请求过来, 可以取消定时绘图
              **/
          if(self.on_ajax_flag>0){
              clearTimeout(self.on_ajax_flag);
              self.on_ajax_flag = undefined;
          }


          self.on_ajax_flag = setTimeout(function(){
                self.__callback();
            },500);
        },
        error: function(rs) {
          self.on_error('服务请求异常!', rs);
        }
    });


}

DataSource.__callback = function(){
  var self = this;
  // console.log(self.source_data,self.on_ajax_flag)
  // 1. 只设置筛选条件, 不进行功能渲染（如: 绘图, 绘制表格）
  if(self.auto_build== undefined || self.auto_build == false){
      return;
  }
  if(self.output_arr.length==0){
      self.on_noselect();
  }else if(is_empty_object(self.source_data) && !self.on_ajax_flag){
      //1. 有节点, 2. 数据为空 3. 还未请求过数据;
        $.each(self.output_arr, function(i, output){
          if(i==0&&self.xput_arr.length>0){
            self.__fetch(output,['ts']);
          }
           self.__fetch(output,self.xput_arr);
        })
  }else if(is_empty_object(self.source_data) && self.on_ajax_flag){
      //1. 有节点, 2. 数据为空 , 3. 已完成数据请求,且返回数据为空
      self.on_ajax_flag = undefined;
      // self.on_nodata();
  }else if(!is_empty_object(self.source_data)){
      //请求后服务器端返回数据
      clearTimeout(self.on_ajax_flag);
      self.on_ajax_flag = undefined;
      try{
          $.each(self.views, function(i,v){
             if( v.draw){ v.draw(self);}
          })
      }catch(e){
          self.on_error('功能渲染异常!', e);
      }
  }

}

DataSource.__rm_data = function(output){
   //删除指定数据
    var key = "{0}_{1}_{2}".format(this.code_name, this.fj_num,output);
    delete this.source_data[key];
}

DataSource.add_output = function(output ){
    var self = this;
    self.output_arr.push(output);

    if (this.auto_build) {
           self.__fetch(output,self.xput_arr);
    };

}

DataSource.rm_output = function(output){
    // 添加 系列; 比如添加显示温度, 频率 等传感输入数据
    this.output_arr.remove(output);
    var self = this;
    self.__rm_data(output);
    this.__callback();
}

DataSource.add_xput = function(xput,str){
    var self = this;
    self.xput_arr.push(xput);
    self.xput_str.push(str);
    this.__callback();
}

DataSource.rm_xput = function(flag,xput,str){
    if(flag){
      this.xput_arr=[];
      this.xput_str=[];
    }else{
      this.xput_arr.remove(xput);
      this.xput_str.remove(this.xput_str[0]);
    }
    this.__callback();
}


DataSource.set_timearea = function(start, end){
    if(start==this.cur_time_area[0] && end == this.cur_time_area[1]){
        return;
    }

    this.cur_time_area = [start, end];
    if(this.auto_build){
        this.source_data = {};
        this.__callback();
    }

}

//转换成Plotly.js 可用的数据和配置
// aw 为一个轴所占绘图区域的比例 
DataSource.parse_plotly_scatter = function(datamap,w,h,aw){
    var self = this;
    var linedata = [];
    var layout = {
        margin: { l: 0, t: 10, r: 10, b: 20 },
        hovermode: 'closest',
         dragmode: 'select',
        gridcolor:'#e41515', 
        width: w,
        height: h,
        xaxis:{
          showline: false,
          tickmode: 'auto',
          zeroline: false,
          gridcolor:'#adadad'
        },
        showlegend: true,
        legend: {
          orientation: 'h'
        }, 
   };
   if(self.xput_arr.length==0){
      layout.xaxis.title='时间'
      layout.xaxis.type='date';
      layout.xaxis.tickformat='%m-%d %H:%M';
   }else{
      layout.xaxis.title=self.xput_str[0];
      // console.log('self.xput_str',self.xput_str)
   }
    var yaxis = {};
    var index= 1;
    $.each(datamap, function(key,line){
      var x =line.x,label=[];
      if(self.xput_arr.length==0){
        x  = $.map(line.x, function(t){
            return t*1000;
        });
      }

      // label = $.map(line.x, function(t,index){
      //       return t+','+line.y[index].toFixed(4)+' ('+line.unit+')';
      // })
        yaxis[line.key] = {
                title:line.unit.length>0?line.name+' ('+line.unit+')':line.name,
                autorange:'false',
                yindex: index,
            };
        linedata.push({
            x: x,
            y: line.y,
            name : line.name,
             // text:label,
             // hoverinfo:'text',
            yaxis : 'y'+yaxis[line.key].yindex,
      })

        if(yaxis[line.key].yindex>1){
             line.ykey = yaxis[line.key].yindex-1;
        }else{
             line.ykey = 0;
        }
       
       index ++
   })

   // console.log(datamap);
    var pmin = 0,pmax = 1;
    $.each(yaxis, function(output, obj){
        var key = 'yaxis'+obj.yindex;
        var p = 0;
        var side = 'left'
        if(obj.yindex%2==0){
            side = 'right';
            p = 1- aw*((obj.yindex-1)/2 +0.5);
            pmax = Math.min(pmax, p);
        }else{
            p = aw*(1+obj.yindex/2 -0.5);
            pmin = Math.max(pmin, p);
        }
        layout[key] = obj;
        layout[key]['side'] = side;
        layout[key]['position'] = p;
        layout[key]['zeroline'] = false;
        if(obj.yindex>1){
            layout[key]['overlaying'] = 'y';
        }
         if(obj.yindex==1){
            layout[key]['gridcolor'] = '#adadad';
        }
    })
    layout.xaxis.domain = [pmin, pmax];
    return {data :linedata, layout:layout};
}
DataSource.parse_plotly_linefeature = function(datamap,w,h,aw){
    var self = this;
    var linedata = [];
    var layout = {
        margin: { l: 0, t: 10, r: 10, b: 20 },
        hovermode: 'closest',
        width: w,
        height: h,
        xaxis:{
          title:self.xput_str[0],
          showline:false,
          tickmode: 'auto',
          zeroline: false,
          gridcolor:'#adadad'
        },
       showlegend: true,
        legend: {
          orientation: 'h',
          // y:0.5
        },
   };
   if(self.xput_arr.length==0){
      layout.xaxis.title='时间'
      layout.xaxis.type='date';
      layout.xaxis.tickformat='%m-%d %H:%M';
   }else{
      layout.xaxis.title=self.xput_str[0][0];
   }
    var yaxis = {};
    var index= 1;
    $.each(datamap, function(key,line){
         var x =line.x;
      if(self.xput_arr.length==0){
        x  = $.map(line.x, function(t){
            return t*1000;
        });
      };
        var line_min=[];
        var line_max=[];
        for(var i=0;i<line.x.length;i++){
          line_min.push(line.y[i]-line.min[i]);
          line_max.push(line.max[i]-line.y[i]);
        }
        yaxis[line.key] = {
                title:line.name+line.unit,
                autorange:'false',
                yindex: index,
               // tickformat: '.{0}f'.format(1),
            };
        linedata.push({
            x: x,
            y: line.y,
            name : line.name,
            error_y: {
                type: 'data',
                symmetric: false,
                array: line_max,
                arrayminus: line_min
              },
              type: 'scatter',
            yaxis : 'y'+yaxis[line.key].yindex
      })
       index ++
   })
    var pmin = 0,pmax = 1;
    $.each(yaxis, function(output, obj){
        var key = 'yaxis'+obj.yindex;
        var p = 0;
        var side = 'left'
        if(obj.yindex%2==0){
            side = 'right';
            p = 1- aw*((obj.yindex-1)/2 +0.5);
            pmax = Math.min(pmax, p);
        }else{
            p = aw*(1+obj.yindex/2 -0.5);
            pmin = Math.max(pmin, p);
        }
        layout[key] = obj;
        layout[key]['side'] = side;
        layout[key]['position'] = p;
        layout[key]['zeroline'] = false;
        if(obj.yindex>1){
            layout[key]['overlaying'] = 'y';
        }
        if(obj.yindex==1){
            layout[key]['gridcolor'] = '#adadad';
        }
    })
    layout.xaxis.domain = [pmin, pmax];
    return {data :linedata, layout:layout};
}
DataSource.upsorting=function(a,b){ 
               return a-b;    
  };
DataSource.downsorting=function(a,b){ 
               return b-a;    
  };
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
        if (index > -1) {
        this.splice(index, 1);
    }
};
