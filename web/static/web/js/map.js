/**
 * china map for windpower 
 * author comger@gmail.com
 * var wpm = new WindPowerMap({
 *     expre :'#div',
 *     expre_back:'#btn_back'
 * });
 */

 var defaults = {
    colors :[d3.rgb(136, 136, 136), d3.rgb(255, 0, 0)]
}

var WindPowerMap = function(opts){
    this.opts = $.extend(defaults,opts);

    var self = this;
    this.container = d3.select(self.opts.expre);
    this.btn_back = $(self.opts.expre_back);
    var parentContainer = $(self.opts.expre).parent();
    this.w = self.opts.w || parentContainer.width();
    this.h = self.opts.h || parentContainer.height() ;

    this.container.attr("transform", "translate(0,0)")
    .attr("width", this.w)
    .attr("height", this.h);

    this._pmax = null;
    this.powermap = {};

    this.btn_back.click(function(){
        self.load();
    })
    
    $.ajax({
        url: '/console/map/statistics?view=json',
        async: false,
        success: function (rs) {
            for(var key in rs.datas){
                self.powermap[key] = {
                    'total_power': d3.sum(rs.datas[key], function(dc){  return dc.power; }),
                    'count': (rs.datas[key] || []).length,
                }

                self._pmax = d3.max([self._pmax || self.powermap[key].total_power, self.powermap[key].total_power]);
            }
            self.color = d3.scale.linear()
            .domain([0, self._pmax])
            .range(self.opts.colors);
            if(Object.keys(rs.datas).length>1){
                self.load(rs.datas);
            }else if(Object.keys(rs.datas).length == 1){
                self.load_sub(rs.datas, Object.keys(rs.datas)[0]);
            }
        }
    })
}

//加载 全国地图
WindPowerMap.prototype.load = function(data){
   var tr_h=20;
   tr_h=this.w<=1024?10:140;
   var self = this;
   this.data = data || this.data;
   if(!this.data){ return; }
   self.btn_back.hide();
   self.container.html('');
   d3.json("/static/libs/json/china.json", function (error, root) {
    var projection = d3.geo.mercator()
    .center([107, 31])
    .scale(self.w/1.7)
     // .translate([self.w/2, self.h/2 +80]);
     .translate([self.w/2, self.h/2+tr_h]);

    var path = d3.geo.path().projection(projection);

    self.container.selectAll("path")
    .data(root.features)
    .enter()
    .append("path")
    .attr({'stroke':'#fff','stroke-width':1,'d':path})
    .style("fill", function (d, i) { return self.linearColor(self.powermap[d.properties.id]);})
    .on("mouseover", function (d, i) {
        var status = self.powermap[d.properties.id];
        if(status){
            var tip_html = "<div>" + d.properties.name
            + "</div><div class='tiptext'>总风场数: "
            + status.count
            + " 个</div><div class='tiptext'>实时功率: "
            + status.total_power + " kW"+ "</div>"
            
            self.show_tip(this, tip_html);
        }

    })
    .on("mouseout", function (d, i) {
        d3.select(this).style("fill",self.linearColor(self.powermap[d.properties.id]));
        self.hide_tip();

    })
    .on("click", function (d, i) {      
       if(self.powermap[d.properties.id]){
        self.load_sub(self.data, d.properties.id, true);
    }
})
    self.linearRect(self.container,self.opts.colors);

})
}


//加载 省份地图
//sub_id : 省份id, needback : 是否支持返回全国地图
WindPowerMap.prototype.load_sub = function(data, sub_id, needback){

    var pdata = data[sub_id]; 
    var self = this;
    self.container.html('');
    self.hide_tip();

    if(needback){
        self.btn_back.show();
    }
    
    var api = "/static/libs/json/geometryProvince/" + sub_id + ".json"
    d3.json(api, function (error, root) {

        var citypowermap = {};
        pdata.forEach(function(dc, i){
            citypowermap[dc.city.slice(0,4)] = citypowermap[dc.city.slice(0,4)] || { total_power:0, count:0};
            citypowermap[dc.city.slice(0,4)].total_power +=dc.power;
            citypowermap[dc.city.slice(0,4)].count +=1; 
        })
        var projection = d3.geo.mercator()
        .center(root.cp)
        .scale(root.size*3)
        .translate([self.w / 2, self.h / 2 + 10]);

        var path = d3.geo.path().projection(projection);
        self.container.selectAll("path")
        .data(root.features)
        .enter()
        .append("path")
        .attr({'stroke':'#fff','stroke-width':1,'d':path})
        .style("fill", function (d, i) {
          console.log(citypowermap[d.properties.id.slice(0,4)])
           return self.linearColor( citypowermap[d.properties.id.slice(0,4)]);
        })
        .on("mouseout", function (d, i) {
            self.hide_tip();
            d3.select(this).style("fill", self.linearColor(citypowermap[d.properties.id.slice(0,4)]));
        })
         //fj -image
         self.container.append('g')
         .selectAll('image')
         .data(pdata)
         .enter()
         .append("image")
         .attr({'width':22, 'height':22})
         .attr('transform', function(d){
            var coor = projection( [d.lng,d.lat]);
            return "translate("+ coor[0] + "," + coor[1] +")";
         })
         .attr('xlink:href','/static/web/img/windmill_icon.png') 
         .on('mouseover', function(d){
            var tip_html = "<div class='tiptext'>"+d.name 
            +"<br>风场实时风速: "+d.speed+ " m/s" 
            + "</div><div class='tiptext'>风机台数: "
            + d.count + " 台"
            + "</div><div class='tiptext'>实时功率: "
            + d.power + " kW"+ "</div>";
            self.show_tip(this, tip_html);

        })
         .on('mouseout', function(d){
            self.hide_tip();
        })
         .on("click", function (d, i) {      
              location.href = '/wf/dataview/'+d.code_name; 
        })
         
         self.linearRect(self.container,self.opts.colors);
             
         })
}


WindPowerMap.prototype.show_tip = function(e,msghtml){
    d3.select("#tooltip").transition().duration(200).style("opacity", .85);

    d3.select("#tooltip")
    .html(msghtml)
    .style({'left':(d3.event.pageX+10) + "px",'top':(d3.event.pageY -88) + "px"});
}

WindPowerMap.prototype.hide_tip = function(){
    d3.select("#tooltip").transition().duration(100).style("opacity", 0);
}

WindPowerMap.prototype.linearColor = function(status){
    status = status || { total_power:0, count:0 };
    //return this.color(status.total_power).toString();
     var  colors=['#888888','#FFDEAD','#ffff00','#cccc00','#ff8c00','#ff0000']
     var  colorsize=this._pmax/5;
     var  i=Math.floor(status.total_power/colorsize);
     if(status.total_power==0){
        return colors[0];
     }else if(status.total_power==this._pmax) {
            return  colors[i];   
     }else{
           return  colors[i+1];  
     }  
}
WindPowerMap.prototype.linearRect=function(svg,color){
  var self=this;
  var linearGradient = svg.append("defs").append("linearGradient")  
  .attr({'id':'linearColor',
        'x1':'0%',
        'y1':'0%',
        'x2':'0%',
        'y2':'100%'});  
  
  var stop1 = linearGradient.append("stop")
  .attr({
    "offset":"0%",
    "stop-color":color[0].toString()
  });  
  
  var stop2 = linearGradient.append("stop")  
  .attr({
    "offset":"100%",
    "stop-color":color[1].toString()
  });   
  
  var colorRect =  svg.selectAll("rect")
        .data(d3.range(6))
        .enter()
        .append("rect")
        .attr("x",function(d,i){
          return 16;
        })
        .attr("y",function(d,i){
          return  40 *i+16;
        })
        .attr("width",25)
        .attr("height",40)
        .style("fill",function(d){
          return  self.linearColor({total_power:self._pmax/6*d})
        })
        .on("mouseover", function (d, i) {
          var start,end;
           start=Math.floor(self._pmax/5*(i-1));
           end=Math.floor(self._pmax/5*i);
          if(i==0){
              start=0;end=0
          };
           var tip_html = "<div class='tiptext'>"
                                +"功率范围："+ start+"kW~"+end
                                + "kW</div> "
           
             self.show_tip(this, tip_html);
        })
        .on("mouseout",function(d,i){
              self.hide_tip();
        })
  
  var startText = svg.append("text")  
  .attr("x",15)  
  .attr("y",10)  
  .text('0kW')
  .attr('fill','#fff');   
 // for (var i = 0; i < 5; i++) {
 //                      svg.append("text")  
 //                             .attr("x",78)  
 //                             .attr("y",50+(i+1)*40)  
 //                             .text(Math.floor(this._pmax/5*i)+'kw');   
 //  } 
  
  var endText =svg.append("text")  
  .attr("x",15)  
  .attr("y",275) 
  .text(this._pmax+'kW')
  .attr("fill", "#fff"); 
  
}

