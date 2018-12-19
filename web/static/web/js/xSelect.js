/**
 *  windpower Field Select ui
 *  var fs = new FieldSelect({
 *          expre:'#pop_container',
 *          pre_title :'dc1-dj1',
 *          dc_id:''
 *          djz_id:''
 *  })
 */
 
var defaults = {
    page_size :10,
    max_selected: 4,
    dc_lst:[],
    djz_lst:[],
    modeltree:[],
    send_code:[],
    data_code:[],
    code_index:[],
    path_list:{namePath:[],PathDcId:[]}
}

var FieldSelectS = function(opts) {
    var  self=this; 
           this.opts = $.extend(defaults,opts);
              this.container=this.opts.expre;
      var  path_nav=$(self.container).find('.path_nav');
              self.get_model_tree()
              self.come_next_level();
              self.path_pre();
}

FieldSelectS.prototype.get_model_tree = function(){
        var     self=this;
        var     ul = $(self.container).find('.l_ul') ;
                  ul.find('li').remove();                   
        $.get("/deploy_map",function(rs){
                     self.opts.modeltree=rs.data;
                     rs.data.forEach(function(parts,i){          
                             ul.append($('<li>').html(parts.name).attr('code',parts.code));   
                    })
                    self.set_paging(self.opts.modeltree); 
         })                                                           
}

FieldSelectS.prototype.come_next_level=function(){
             var     self=this;
             var     ul = $(self.container).find('.l_ul') ;
             var     path_nav=$(self.container).find('.path_nav');
             ul.on('click','li',function(){
                var $li=$(this)
                if(path_nav.find('.fj_s_model').length>0){
                   $li.css({"backgroundColor":"#324D75","color":"#fff"}).siblings().css({"backgroundColor":"#fff","color":"#61666D"})
                   $li.addClass('active').siblings().removeClass('active');
                  return
                }
                ul.find('li').remove(); 
                path_nav.append($("<li>").html($li.html()).attr('class','fj_s_model').attr('code',$li.attr('code')))
                 $.get("/deploy_map",function(rs){
                     self.opts.modeltree=rs.data;
                     rs.data.forEach(function(parts,i){ 
                              if(parts.code==$li.attr('code')){
                                parts.children.forEach(function(v,index){
                                  if(v.unit.length>0){
                                    ul.append($('<li>').html(v.name+'('+v.unit+')').attr('code',v.code));  
                                  }else{
                                    ul.append($('<li>').html(v.name).attr('code',v.code));  
                                  }
                                })
                                self.set_paging(parts.children); 
                              } 
                    })
                })   
             })
             self.btn_click(); 
}
FieldSelectS.prototype.path_pre=function(){
            var     self=this;
            var     ul = $(self.container).find('.l_ul') ;
            var     path_nav=$(self.container).find('.path_nav');
             path_nav.on('click','.fj_code',function(){
              ul.find('li').remove(); 
              path_nav.find('.fj_s_model').remove();
              self.opts.modeltree.forEach(function(parts,i){ 
                   ul.append($('<li>').html(parts.name).attr('code',parts.code)); 
              })
                   self.set_paging(self.opts.modeltree);  
           })
}

 FieldSelectS.prototype.btn_click=function(){
             var      self=this;
              self.r_showdata=[];
             self.r_showcode=[];
             self.outputcode=[];
             var      delet_data=[];
             var      path_nav= $(self.container).find('.path_nav') 
             var      rul = $(self.container).find('.r_ul') ;
             var      lul = $(self.container).find('.l_ul') ;

            $(self.container).find('.btn-boxleft').click(function(){
              if(lul.find('.active').length>0){
                   if( rul.find('li').length<self.opts.max_selected){
                          var r_show_str='',r_code='';
                          $.each(path_nav.find('li'),function(i,v){
                               r_show_str+=$(v).html()+'-'
                              r_code+=$(v).attr('code')+'-'
                           })
                          r_show_str+=lul.find('.active').html() ;
                          r_code+=lul.find('.active').attr('code');
                          if( self.r_showdata.indexOf(r_show_str)==-1){
                                self.r_showdata.push(r_show_str) ;
                                 self.r_showcode.push(r_code);
                                 self.outputcode.push(r_code.split('-').splice(3,2))
                                 rul.append($('<li>').html(r_show_str).attr('code',r_code));
                                 self.opts.add_output(r_code.split('-').splice(3,2).join());
                          }else{
                                alert('请不要重复添加!');
                           }
                    }else{
                           alert('不能选择超过' + self.opts.max_selected + '项内容');
                   }    
              }
          })

       $(self.container).find('.btn-boxright').click(function(){
                     var $self = $(this);
                     rul.find('.active_li').each(function(i,e){
                          var code = $(e).attr('code');
                          var html=$(e).html();
                          self.opts.rm_output(code.split('-').splice(3,2).join());
                          self.r_showdata.remove(html);
                          $(e).remove();
                     })
           })
              rul.on('click','li',function(){
                      $(this).toggleClass('active_li');
              })
 }


FieldSelectS.prototype.set_paging=function(list){  
              var        self=this;                          
                            self.opts.show_lst_all=list;
              var         ul = $(self.container).find('.l_ul') ;
              var         btn_page= $(self.container).find('.count_page') ;
                            btn_page.find('a').remove(); 
             if(list.length>this.opts.page_size){
                     var count_pag=Math.ceil(list.length/this.opts.page_size); 
                            for(var i=0;i<count_pag;i++){                     
                                    btn_page.append($('<a>'))
                           }                                  
                                            
             }
                             ul.find('li').css("display","none");
             for(var i=0;i<self.opts.page_size;i++){
                           $(ul.find('li')[i]).css("display","block");
             }
          
              btn_page.on('click','a',function(){
                            ul.find('li').css("display","none");
                            $(this).css({"backgroundColor":"#2E426C","color":"#fff"}).siblings().css({"backgroundColor":"#fff","color":"#2E426C"});
                            var start_index=$(this).index()*self.opts.page_size;
                            for(var i=start_index;i<start_index+self.opts.page_size;i++){
                                       $(ul.find('li')[i]).css("display","block");
                                       
                            }                   
              })
}

var _defaults = {
    page_size :10,
    max_selected: 1,
}
var FieldSelect = function(opts) {
    var  self=this; 
           this.opts = $.extend(_defaults,opts);
           this.container=this.opts.expre;
    var  path_nav=$(self.container).find('.path_nav1');
           self.get_tree()
           self.come_next();
           self.get_pre();
}
FieldSelect.prototype.come_next=function(){
             var     self=this;
             var     ul = $(self.container).find('.l_ul') ;
             var     path_nav=$(self.container).find('.path_nav1');
             ul.on('click','li',function(){
                var $li=$(this)
                if(path_nav.find('.fj_s_model').length>0){
                   $li.css({"backgroundColor":"#324D75","color":"#fff"}).siblings().css({"backgroundColor":"#fff","color":"#61666D"})
                   $li.addClass('active').siblings().removeClass('active');
                  return
                }
                ul.find('li').remove(); 
                path_nav.append($("<li>").html($li.html()).attr('class','fj_s_model').attr('code',$li.attr('code')))
                self.opts.tree_data.forEach(function(parts,i){ 
                              if(parts.code==$li.attr('code')){
                                parts.children.forEach(function(v,index){
                                if(v.unit.length>0){
                                    ul.append($('<li>').html(v.name+'('+v.unit+')').attr('code',v.code));  
                                  }else{
                                    ul.append($('<li>').html(v.name).attr('code',v.code));  
                                  }
                                })
                                self.set_paging(parts.children); 
                              } 
                   })
             })
             self.btn_click(); 
}
FieldSelect.prototype.get_tree = function(){
        var     self=this;
        var     ul = $(self.container).find('.l_ul') ;
                  ul.find('li').remove();                   
        $.get("/deploy_map",function(rs){
                     self.opts.tree_data=rs.data;
                     rs.data.forEach(function(parts,i){          
                             ul.append($('<li>').html(parts.name).attr('code',parts.code));   
                    })
                    self.set_paging(self.opts.tree_data); 
         })                                                           
}
FieldSelect.prototype.get_pre=function(){
            var     self=this;
            var     ul = $(self.container).find('.l_ul') ;
            var     path_nav=$(self.container).find('.path_nav1');
             path_nav.on('click','.fj_code',function(){
              ul.find('li').remove(); 
              path_nav.find('.fj_s_model').remove();
              self.opts.tree_data.forEach(function(parts,i){ 
                   ul.append($('<li>').html(parts.name).attr('code',parts.code)); 
              })
                   self.set_paging(self.opts.tree_data);  
           })
}
FieldSelect.prototype.btn_click=function(){
             var      self=this;
             self.r_showdata=[];
             self.r_showcode=[];
             self.outputcode=[];
             var      delet_data=[];
             var      path_nav= $(self.container).find('.path_nav1') 
             var      rul = $(self.container).find('.r_ul') ;
             var      lul = $(self.container).find('.l_ul') ;
            $(self.container).find('.btn-boxleft').click(function(){
                if(lul.find('.active').length>0){
                  if( rul.find('li').length<self.opts.max_selected){
                         var r_show_str='',r_code='';
                         $.each(path_nav.find('li'),function(i,v){
                                 r_show_str+=$(v).html()+'-'
                                 r_code+=$(v).attr('code')+'-'
                           })
                          r_show_str+=lul.find('.active').html() ;
                          r_code+=lul.find('.active').attr('code');
                          if( self.r_showdata.indexOf(r_show_str)==-1){
                                     self.r_showdata.push(r_show_str) ;
                                     self.r_showcode.push(r_code);
                                      self.outputcode.push(r_code.split('-').splice(3,2))
                                     rul.append($('<li>').html(r_show_str).attr('code',r_code));
                                     self.opts.add_out(r_code.split('-').splice(3,2).join(),r_show_str.split('-').splice(3,2));
                           }else{
                                 alert('请不要重复添加!');
                          }
                    }else{
                         alert('不能选择超过' + self.opts.max_selected + '项内容');
                    }     
                }
             })

       $(self.container).find('.btn-boxright').click(function(){
                     var $self = $(this);
                     rul.find('.active_li').each(function(i,e){
                          var code = $(e).attr('code');
                          var html=$(e).html();
                          self.opts.rm_out(code.split('-').splice(3,2).join(),html.split('-').splice(3,2));
                          self.r_showdata.pop(html);
                          $(e).remove();
                     })
           })
              rul.on('click','li',function(){
                      $(this).toggleClass('active_li');
              })
 }
FieldSelect.prototype.set_paging=function(list){  
              var        self=this;                          
                          self.opts.show_lst_all=list;
              var         ul = $(self.container).find('.l_ul') ;
              var         btn_page= $(self.container).find('.count_page') ;
                            btn_page.find('a').remove(); 
             if(list.length>this.opts.page_size){
                     var count_pag=Math.ceil(list.length/this.opts.page_size); 
                            for(var i=0;i<count_pag;i++){                     
                                    btn_page.append($('<a>'))
                           }                                  
                                            
             }
                             ul.find('li').css("display","none");
             for(var i=0;i<self.opts.page_size;i++){
                           $(ul.find('li')[i]).css("display","block");
             }
          
              btn_page.on('click','a',function(){
                            ul.find('li').css("display","none");
                            $(this).css({"backgroundColor":"#2E426C","color":"#fff"}).siblings().css({"backgroundColor":"#fff","color":"#2E426C"});
                            var start_index=$(this).index()*self.opts.page_size;
                            for(var i=start_index;i<start_index+self.opts.page_size;i++){
                                       $(ul.find('li')[i]).css("display","block");
                                       
                            }                   
              })
}