$(function(){
   $('.pleft').on('click', '.nav-parent > a',function() {

      var parent = $(this).parent();
      var sub = parent.find('> ul');

      // Dropdown works only when leftpanel is not collapsed
      if(!$('body').hasClass('pleft-collapsed')) {
         if(sub.is(':visible')) {
            sub.slideUp(200, function(){
               parent.removeClass('nav-active');
               $('.pcontent').css({height: ''});
               adjustmainpanelheight();
            });
         } else {
            closeVisibleSubMenu();
            parent.addClass('nav-active');
            sub.slideDown(200, function(){
               adjustmainpanelheight();
            });
         }
      }
      return false;
   });
   
   function closeVisibleSubMenu() {
      $('.pleft .nav-parent').each(function() {
         var t = $(this);
         if(t.hasClass('nav-active')) {
            t.find('> ul').slideUp(200, function(){
               t.removeClass('nav-active');
            });
         }
      });
   }
   
   function adjustmainpanelheight() {
      // Adjust mainpanel height
      var docHeight = $(document).height();
      if(docHeight > $('.pcontent').height())
         $('.pcontent').height(docHeight);
   }
   adjustmainpanelheight();

   $('.nav-kpages').on('mouseenter', 'li', function(event) {
       jQuery(this).addClass('nav-hover');
   });

   $('.nav-kpages').on('mouseleave', 'li', function(event) {
       jQuery(this).removeClass('nav-hover');
   });

   $('.menutoggle').click(function(event) {
       $('body').toggleClass('pleft-collapsed');
       if(!$('body').hasClass('pleft-collapsed')){
           $('.headerbar').css('left', '220px');
           $('body').removeClass('chat-view');
           //$('.nav-active ul').css('display', 'block');
       } else {
           $('.headerbar').css('left', '50px');
           
       }
       //$('.open ul').css('display', 'none');
       $('.nav-active ul').removeAttr('style');
       adjustmainpanelheight();
   });

   $('#bridgeview').click(function(event) {
      $('body').removeClass('chat-view');
      $('body').toggleClass('bridge-view');
      if($('body').hasClass('bridge-view')){
        $('body').addClass('pleft-collapsed');
      }else{
        $('body').removeClass('pleft-collapsed');
      }
       adjustmainpanelheight();
   });

   $('#chatview').click(function(event) {
       $('body').removeClass('bridge-view');
       $('body').toggleClass('chat-view');
       if($('body').hasClass('chat-view')){
         $('body').addClass('pleft-collapsed');
       }else{
         $('body').removeClass('pleft-collapsed');
       }
        adjustmainpanelheight();
   });

   $('.headerbar').on('input', 'input[name="keyword"]', function(){
      if($(this).val() == '') {
        $(this).css('background', '#FFF url(/static/kpages/images/icon-search.png) no-repeat 95% center');
      } else {
        $(this).css('background', '#fff');
      }
   })

})