/**
 * jquery 病害维修对策选择插件
**/
(function($) {        
    $.fn.repairprice = function(rtype) {      
        
        return this.each(function() {     
            
            $(this).click(function(event) {
                var lumjg = $(this).attr('lumjg');
                var location = $(this).attr('location');
                var bigclass = $(this).attr('bigclass');
                var smallclass = $(this).attr('smallclass');

                $('#dp-model input[name="did"]').val($(this).attr('did'));

                var params = 'lumjg='+lumjg +'&location='+location +'&bigclass='+bigclass + '&smallclass='+smallclass+'&rtype='+rtype;
                $.get('/road/disease/repairprice?'+params, function(rs){
                    var sel = $('#dp-model select');
                   
                    $('#dp-model select option').remove();
                    $(rs.data).each(function(index, el) {
                        var opt = $('<option>').attr('value', el._id).html(el.title+',价格:'+el.price);
                        sel.append(opt);
                    });
                    $('#dp-model').modal('show');

                })


            });
            
        });     
    };      
})(jQuery);     


