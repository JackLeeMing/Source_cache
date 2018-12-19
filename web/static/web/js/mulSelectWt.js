/**
 *  windpower wt Select ui
 *    var wts=new MulSelectWt({
        wf_box:'#wf-select',
        fj_box:'#fj-select',
        input_box:'#input_box',
        close_btn:'.addwindSelect',
        addFun:addSelectItem
      });
 */
 
var defaults = {
    max_count_wt:5,
    fj_num_arr:[],
    fj_name_arr:[]
}

var MulSelectWt = function(opts) {
    var  self=this;
    this.opts = $.extend(defaults,opts);
    this.get_wt() ;
    this.get_mul_wt();
    this.remove_wt();
    this.hide_wtul();
}

MulSelectWt.prototype.get_wt = function(){
    var  self=this;
    $(self.opts.wf_box).change(function(event){
      self.opts.wf=$(this).val();
      self.opts.wf_name = $(this).find("option[value="+$(this).val()+"]").text();
      self.opts.fj_num_arr=[];
      self.opts.fj_name_arr=[];
      $(self.opts.fj_box).find('li').remove();
      $(self.opts.input_box).find('li').remove();
      var code_name = $(this).val();
      if(code_name){
        var html1=' <label><input type="checkbox" class="ace_all" ><span class="lbl"></span></label>'+
              '<span>全选</span><span class="tip_text"></span>';
        $(self.opts.fj_box).append($('<li>').html(html1).addClass('fj_box_wtname'))
        $.get('/single/group/fjnum?code_name={0}'.format(code_name),function(rs){
          if (rs && rs.data && rs.data.length >0) {
            rs.data.forEach(function(element, index) {
              var html=' <label><input type="checkbox" class="ace" value='+element['num']+'><span class="lbl"></span></label>'+
                            '<span class="fj_name">'+element["name"]+'</span>';
              // $(self.opts.fj_box).append($('<li>').attr('val',element['num']).html(html))
              $(self.opts.fj_box).append($('<li>').attr({'val':element['num']}).html(html))
            })
          }
        })
      }
      $(self.opts.fj_box).show();
    })
}

MulSelectWt.prototype.get_mul_wt = function(){
    var  self=this;
    $(self.opts.fj_box).on('click','.ace_all',function(){
      var text='(已选择该风场下的所有风机'+$(self.opts.fj_box).find('.ace').length+'台)'
      if($(this).prop('checked')){
        $(self.opts.fj_box).find('.tip_text').text(text);
        $(self.opts.fj_box).find('.ace').each(function(i,v){
          if(!$(v).prop('checked')){
            $(v).click()
          }
        })
        $(self.opts.fj_box).find('.ace').prop({checked: true })
      }else{
          $(self.opts.fj_box).find('.tip_text').text('')
        $(self.opts.fj_box).find('.ace').each(function(i,v){
          if($(v).prop('checked')){
            $(v).click()
          }
        })
        $(self.opts.fj_box).find('.ace').prop({ checked: false })
      }
    })
    $(self.opts.fj_box).on('click','.ace',function(){
        var flag = true;
        $(self.opts.fj_box).find('.ace').each(function(i, v) {
            if (!$(v).prop('checked')) {
                flag = false;
                return false;
            }
        })
        $(self.opts.fj_box).find('.ace_all').prop({
            checked: flag
        })
         var text='(已选择该风场下的所有风机'+$(self.opts.fj_box).find('.ace').length+'台)'
        if(flag){
          $(self.opts.fj_box).find('.tip_text').text(text);
        }else{
          $(self.opts.fj_box).find('.tip_text').text('');
        }
      var fj_val=$(this).val();
      if($(this).prop('checked')){
        var fj_name=$(this).parents('li').find('.fj_name').text();
        var li='<li class="" style="float: left; width:auto;">'+
                 '<span>'+fj_name+'</span>'+
                '<span class="fj_close" _id='+fj_val+' _name='+fj_name+'>×</span></li>'
        $(self.opts.input_box).append(li)
      }else{
        $(self.opts.input_box).find('.fj_close[_id='+fj_val+']').click();
      }
    })
}

MulSelectWt.prototype.remove_wt = function(){
    var  self=this;
    $(self.opts.input_box).on('click','.fj_close',function(){
      var fj_val=$(this).attr('_id')
      $(self.opts.fj_box).find('.ace[value='+fj_val+']').prop('checked',false);
      $(this).parents('li').remove();
    })
};

MulSelectWt.prototype.hide_wtul = function(){
    var  self=this;
    $(self.opts.close_btn).click(function(){
      var that=this
      $(self.opts.fj_box).hide();
      $(self.opts.wf_box).val('')
      $(self.opts.input_box).find('.fj_close').each(function(i,v){
        self.opts.fj_num_arr.push($(v).attr('_id'));
        self.opts.fj_name_arr.push($(v).attr('_name'));
      });
      $(self.opts.input_box).find('.fj_close').click();
      if(self.opts.wf&&self.opts.fj_num_arr.length>0){
        self.opts.fj_num_arr.forEach(function(v,i){
          $(that).parents('.modal-body').append(self.opts.addFun(self.opts.wf,self.opts.wf_name,v,self.opts.fj_name_arr[i]));
        })
      }
      $('.delwindSelect').click(function(){
        $(this).parents('.form-group').remove();
      })
    })
}
