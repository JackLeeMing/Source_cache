/**
 *  author comger@gmail.com
 *  windpower Field Select ui
 *  var fs = new FieldSelect({
 *  		expre:'#pop_container',
 *  		pre_title :'dc1-dj1',
 *  		dc_id:''
 *  		djz_id:''
 *  })
 */
 
var defaults = {
	page_size :10,
	max_selected: 4,
	dc_lst:[],
	djz_lst:[],
	modeltree:[],
	dc_id:0,
	djz_id:0,
       send_code:[],
       data_code:[],
       code_index:[],
	// selected_fields:[],
	path_list:{namePath:[],PathDcId:[]}
}

var FieldSelect = function(opts) {
	var  self=this; 
	       this.opts = $.extend(defaults,opts);
              this.container=this.opts.expre;
      var  path_nav=$(self.container).find('.path_nav');
              if(this.opts.dc_id==0){
              	this.get_dclst();
              }else if(this.opts.djz_id==0){
                alert('jinlai')
                    path_nav.append($("<li>").html(this.opts.pre_title));
                    this.opts.path_list.namePath.push(  this.opts.pre_title )
               	this.get_djzlst(this.opts.dc_id);
             }else{
                    var  title=this.opts.pre_title.split("-");
                           for (var i = 0; i < title.length; i++) {
                                        path_nav.append($("<li>").html(title[i]));
                                        this.opts.path_list.namePath.push( title[i]);
                           }
                    this.get_model_tree() ;

             }
              self.come_next_level();
              self.path_back_level();
}

FieldSelect.prototype.get_dclst = function(){
      var   self=this;        
      var   ul = $(self.container).find('.l_ul') ;
               ul.find('li').remove(); 
       $.get('/dc/data',function(rs){
                    self.opts.dc_lst = rs.data;                                 
        	       rs.data.forEach(function(dc,i){

                           ul.append($('<li>').html(dc.name));
                     })                                                            
        	       self.set_paging(self.opts.dc_lst);   
        	           
       })                   
}

FieldSelect.prototype.get_djzlst = function(dcId){
       var     self=this;
       var     ul = $(self.container).find('.l_ul') ;
                  ul.find('li').remove(); 
      $.get('/dc/dynamo_data',function(rs){   
                     self.opts.djz_lst =[];            
        	       rs.data.forEach(function(djz,i){
                            if(djz.dc_id==dcId){
                                   self.opts.djz_lst.push(djz);                                               
                                   ul.append($('<li>').html(djz.wt_name));
                            }
                    })
        	       self.set_paging(self.opts.djz_lst);      	    
       })            
}

FieldSelect.prototype.get_model_tree = function(){
        var     self=this;
        var     ul = $(self.container).find('.l_ul') ;
                   ul.find('li').remove();                   
        $.get("/deploy_map",function(rs){
                     self.opts.modeltree=rs.data;
                     rs.data.forEach(function(parts,i){          
                             ul.append($('<li>').html(parts.name));   

                    })
                     self.set_paging(self.opts.modeltree); 
                  
         })                                                           
}

FieldSelect.prototype.come_next_level=function(){
             var     self=this;
             var     ul = $(self.container).find('.l_ul') ;
             var     path_nav=$(self.container).find('.path_nav');                       
              ul.on('click','li',function(){
                        	   
                           	if(self.opts.path_list.namePath.length==0){
                        	               var       dc_name=self.opts.dc_lst[$(this).index()].name    
                        		         var       dc_id= self.opts.dc_lst[$(this).index()].dc_id                             		                      	                                                    	                                   	    
                        	                            self.opts.path_list.namePath.push(  dc_name );
                        	                            self.opts.path_list.PathDcId.push( dc_id )
                        	                            self.get_djzlst ( dc_id) ;      
                        	                            path_nav.append($("<li>").html(dc_name)); 
                                                       
                                                                                                           	                        
                            } else if(self.opts.path_list.namePath.length==1) {                                             
                                          var       dj_name=self.opts.djz_lst[$(this).index()].wt_name;   
                        		         var       dj_id= self.opts.djz_lst[$(this).index()].wt_code;                                		                      	                                                    	                                   	    
                        	                            self.opts.path_list.namePath.push(  dj_name );
                        	                            self.opts.path_list.PathDcId.push( dj_id )
                        	                            self.get_model_tree( ) ;      
                        	                            path_nav.append($("<li>").html(dj_name)); 
                                                  
                            }  else if (self.opts.path_list.namePath.length==2){
                                           var       btn_page= $(self.container).find('.count_page') ;
                                                        btn_page.find('a').remove(); 
                                           var       part_name=$(this).html();
                                                        self.opts.path_list.namePath.push(  part_name );
                                                        self.opts.send_code=[];
                                                        self.opts.send_code.push(self.opts.modeltree[$(this).index()].code) ;                                                                                                  
                                           var       part_mode= self.opts.modeltree[$(this).index()];
                                                        self.opts.parts= part_mode;
                                                        ul.find('li').remove();  
                                                                                                                                         
                                                        part_mode.children.forEach(function(item,i){
                                                                      ul.append($('<li>').html(item.name));  
                                                        })                                   
                                                       path_nav.append($("<li>").html( part_name));  
                                                        self.set_paging(part_mode.children);
                                                   
                             }else{
                                           $(this).css({"backgroundColor":"#324D75","color":"#fff"}).siblings('li').css({"backgroundColor":"#fff","color":"#61666D"});
                                           if( self.opts.path_list.namePath.length==4){
                                                           self.opts.path_list.namePath.pop();
                                                           self.opts.send_code.pop();
                                           }
                                           var       argument_name=$(this).html();
                                                        self.opts.path_list.namePath.push(argument_name);
                                                        self.opts.send_code.push( self.opts.parts.children[$(this).index()].code);

                            }        
               })
                       
                      self.btn_click();     
}

  
FieldSelect.prototype.path_back_level=function(){
             var     self=this;
             var     ul = $(self.container).find('.path_nav') ;
   
                           ul.on('click','li',function(){
                            
                                    if($(this).index()==0&&self.opts.pre_title.length==0){                                                          
                                                 for(var i=1;i<ul.find('li').length+2;i++){
                                                           if( ul.find('li')[1]){
                                                                       ul.find('li')[1].remove();
                                                           }                                                                                                                
                                                 }
                                                  self.opts.path_list.namePath=[];
                                                  self.opts.path_list.PathDcId=[];
                                                  self.get_dclst();

                                     }else if($(this).index()==1&&self.opts.djz_id==0){
                                        for(var i=2;i<ul.find('li').length+1;i++){
                                                      if( ul.find('li')[2]){
                                                                       ul.find('li')[2].remove();
                                                           }     
                                                 }
                                                 
                                                 self.opts.path_list.namePath= self.opts.path_list.namePath.slice(0,1);
                                                 self.opts.path_list.PathDcId=self.opts.path_list.PathDcId.slice(0,1);
                                                 if(self.opts.djz_id!=0){
                                                      
                                                      self.get_djzlst( self.opts.dc_id);
                                                 }else{

                                                      self.get_djzlst(self.opts.path_list.PathDcId[0]);     
                                                 }
                                                 
                                                
                                    }else if($(this).index()==2){
                                                for(var i=3;i<ul.find('li').length+1;i++){
                                                       if( ul.find('li')[3]){
                                                                       ul.find('li')[3].remove();
                                                           }     
                                                 }
                                                   self.opts.path_list.namePath= self.opts.path_list.namePath.slice(0,2);
                                                   self.opts.path_list.PathDcId=self.opts.path_list.PathDcId.slice(0,2);
                                                   self.get_model_tree( ) ;      
                                    }
                       })                     
}

 FieldSelect.prototype.btn_click=function(){
             var      self=this;
             var      r_showdata=[];
             var      delet_data=[];
             var      ul = $(self.container).find('.r_ul') ;
             $('.btn-boxleft').click(function(){
                               if(  ul.find('li').length<self.opts.max_selected){
                                          if(self.opts.path_list.namePath.length==4){
                                                        if( r_showdata.indexOf(self.opts.path_list.namePath.join("-"))==-1){
                                                                       r_showdata.push(self.opts.path_list.namePath.join("-"));
                                                                       self.opts.data_code.push(self.opts.send_code);
                                                                        console.log(self.opts.data_code)  
                                                                       ul.append($('<li>').html(  self.opts.path_list.namePath.join("-")));
                                                         }else{                                    
                                                                        alert('不能重复添加');
                                                         }
                                           }else{
                                                         alert('所选内容不完善');
                                           }                                      
                                }else{
                                         alert('不能选择超过' + self.opts.max_selected + '项内容');
                                }     
                                                                                      
                                  
               })
              ul.on('click','li',function(){
                                     var $self=$(this);                                 
                                     if($(this).css("backgroundColor")=="rgb(50, 77, 117)"){
                                                $(this).css({"backgroundColor":"#fff","color":"rgb(97, 102, 109)"})                                                                                                                                                                        
                                                self.opts.code_index.splice( self.opts.code_index.indexOf($(this).index()) ,1)                                        
                                     }else{
                                                $(this).css({"backgroundColor":"#324D75","color":"#fff"});
                                                self.opts.code_index.push($(this).index());
                                     }
                                    $('.btn-boxright').click(function(){
                                           if($self.css("backgroundColor")=="rgb(50, 77, 117)"){                                                   
                                                      for(var i=0;i<r_showdata.length;i++){
                                                               if(r_showdata[i]==$self.html()){
                                                                         r_showdata[i]=null;
                                                               }
                                                      }
                                            self.opts.code_index.forEach(function(v,i){
                                                   self.opts.data_code.splice(v,1);
                                            })  
                                                      self.opts.code_index=[];
                                                      $self.remove(); 
                                                       console.log(self.opts.data_code)       
                                           }
                                 })

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

