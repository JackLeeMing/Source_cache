/**
 *  author  gu
 *  tips Select ui
 */
var tipsdata={
    t_a:'风机发电量',
    t_b:'风机温度',
    t_c:'风速',
    t_d:'目标产能比',
    t_e:'容量因数'
};
 var smTip=function(classname){
    this.classname=classname;
    this.setTitle(classname);
 };
 smTip.prototype.setTitle=function(classname){
    var self=this;
    $('.'+self.classname).attr('title',tipsdata[classname]);
    $('.'+self.classname).attr('data-toggle','tooltip');
 };
var addtip=function(){
    $('[data-toggle="tooltip"]').tooltip();
        for (var i = 0; i < arguments.length; i++) {
        var smtips=new smTip(arguments[i]);
    }
}