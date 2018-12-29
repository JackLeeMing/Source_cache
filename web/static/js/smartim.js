var imHash = {};
imHash.count = 0;
imHash.map = {}; //{uid,$('IM'+UID)}

//消息通知定时器
var effectMap = {};
effectMap.count = 0;

var App = {
    init: function() {
        this.initUserGroup();
        this.getMsgCount();
        this.initRecentContactsList();
    },

    initUserGroup: function() {
        $.get('/manage/user/group', function(data){
          App.initUserList(data.data);
        });
    },

    getMsgCount: function() {
      $.get('/manage/message/count', function(data){
          var data = data.data;

          if(!$.isEmptyObject(data)) {
             createNewMsgEffect('#chatview .glyphicon', true);
          }

          $.each(data, function(index, val) {

              var groupObj = $('.U' + index).parents('.panel').find('.group-name');
              createNewMsgEffect(groupObj, true);
              $('.U' + index).find('.message-count').text(val);
          });
      });
    },

    initUserList: function(data) {
        var ID = 1;

        $.each(data, function(index, val) {
            var group = index;
            var groupID = group + (ID++);

            var $tempGroup = $('#tmp-group').clone(true).removeAttr('id').removeClass('hide');
            $tempGroup.find('.group-name').text(group);
            $tempGroup.find('.panel-title').attr('href','#' + groupID);
            $tempGroup.find('.panel-collapse').attr('id', groupID);

            if(ID != 2) {
              $tempGroup.find('.panel-collapse').removeClass('in').addClass('panel-collapse');
            }

            $.each(val, function(index, val) {
                $tempGroup.find('.chatuserlist').append(App.initUserOne(val));
            });

            $("#accordion").append($tempGroup);
        });
    },

    initUserOne: function(data) {
        var $tempUser = $('#tmp-user').clone(true).removeClass('hide')
            uid       = data._id,
            username  = data.username,
            citycode  = data.citycode,
            email     = data.email
            firstname = new String(username).charAt(0);

        $tempUser.find('.text-photo').text(firstname);
        $tempUser.find('.chat-name').text(username);
        $tempUser.find('.user-addon').text(email);
        $tempUser.attr('uid', uid);
        $tempUser.addClass('U'+uid);

        return $tempUser;
    },
    
    //最近联系人
    initRecentContactsList: function() {
        $.get(urlMap.messageContact,function(data){
            var data = data.data;
            $.each(data, function(index, val){
                $('.lastContact').append(App.initUserOne(val));
            })
        })
    },

    generalIM: function(tempID) {
        return $(tempID).clone(true,true).addClass('im');
    },

    sendMsg: function(obj, content) {
        $(obj).find('textarea').val('');

        if(content!=0) {
          var uid = $(obj).attr('uid');
          var IM_ID = obj;
          var time = new Date();

          $.get('/manage/message/send', {uto:uid, body:content},function(data) {
                newMsg(IM_ID, content, undefined, 'send');
                scrollToBottom(IM_ID);
                $('.im-footer textarea').focus();
          });
        }
    }
};

// 启动插件
setTimeout('App.init()', 4000);

var newMsg = function(imObj, msg, time, type, noScroll, history) {
  var _time = time;

  if(time == 'undefined') {
    _time = new Date();
  }

  var $temp;

  switch (type){
    case 'send' :
        var $temp = $("<div class='chat-block self'><p class='chat-content'></p></div>");
        break;
    case 'receive' :
        var $temp = $("<div class='chat-block'><p class='chat-content'></p></div>");
        break;
  }

  $temp.find('.chat-content').text(msg);
  $temp.find('.chat-content').attr('title', time);

  if(history) {
      $(imObj).find('.im-message').prepend($temp);
  } else {
      $(imObj).find('.im-message').append($temp)
  }
}

var scrollToBottom = function(imObj) {
	$(imObj).find('.im-body').animate({scrollTop: 65535});
}

var showIM = function(objId) {
	$(objId).css('display', 'block').removeClass('hide');
}

var showSingleIM = function(objId) {
	$('.im').addClass('hide');
	$(objId).css('display', 'block').removeClass('hide');
}

var clearMsgCount = function(uid, isClearServer) {

	$('.U' + uid).find('.message-count').text('').css('display', 'none');

	if(isClearServer) {
		$.get('/manage/message/count/clear', {ufrom:uid});
	}
}

var showNewMsgEffect = function(obj, isInterval) {

	if(isInterval) {
		$(obj).effect("pulsate",2000);
		var timer =  setInterval(function(){
			$(obj).effect("pulsate",2000);
		},4000);
		return timer;
	} else {
		$(obj).effect("pulsate",2000);
	}
}

var showNewMsgMarquee = function() {
  $('.new-msg').removeClass('hide');
}

var hideNewMsgMarquee = function() {
  $('.new-msg').addClass('hide');
}

var createNewMsgEffect = function(obj, isInterval) {
	$(obj).attr('tid', effectMap.count++);
	effectMap[$(obj).attr('tid')] = showNewMsgMarquee();
}

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/manage/message";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
          var data = $.parseJSON(event.data);
          var count = data.count;
          var time = data.addon;

          var IM_ID = '#IM' + data.ufrom;
          var U_ID = '.U' + data.ufrom;

          $(U_ID).find('.message-count').text(count).fadeOut().fadeIn();

          if($(IM_ID).is(':visible')) {
              newMsg(IM_ID, data.body, time, 'receive');
          }

          var groupObj = $(U_ID).parents('.panel').find('.group-name');
          createNewMsgEffect(groupObj);
          createNewMsgEffect('#chatview .glyphicon');
        }

        updater.socket.onclose = function(event){
          //5秒后重连接
          window.setTimeout(updater.start, 5000);-
          console.log('close:',event);
        }

        updater.socket.onerror = function(event){
          console.log('error:',event);
        }

        updater.socket.onopen = function(event){
        }
    },

};

updater.start();


$('.pright').on('click', '.chatuserlist li, .lastContact li', function(event) {

    var name = $(this).find('.chat-name').text();
    var uid = $(this).attr('uid');
    var $IM;

    clearMsgCount(uid);

    if(imHash.map[uid]) {
        $IM = imHash.map[uid];
    } else {
        $IM = new App.generalIM('#tmp-IM');
    }

    $IM.attr('id', 'IM' + uid);
    $IM.attr('uid',uid);
    $IM.find('.name').text(name);
    $('body').append($IM);

    imHash.map[uid] = $IM;
    imHash.count++;

    $.get('/manage/message/offline', {ufrom:uid},function(data) {
        var IM_ID = '#IM' + uid;
        $.each(data.data, function(index, val) {
            var text = val.body;
            var time = val.addon;

            if(!$IM.is(':visible')) {
                newMsg(IM_ID, text, time, 'receive');
            }

        });

        showSingleIM($IM);

    });

    $.get(urlMap.messageHistory, {ufrom:uid}, function(data){
        var pageNum = data.page.page_num;
        var data = data.data;

        if(data.length == 0) {
          $('#IM' + uid).find('.im-history').remove();
        }
    });
        

});



$('body').on('click', '.im .sendmsg', function(){
    var text = $.trim($(this).siblings('textarea').val());
    var objID = $(this).parents('.im').attr('id');
    App.sendMsg('#' + objID, text);
});

$('body').on('keydown', '.im .chat-textarea', function(event){
    if(event.keyCode == 13) {
        var text = $.trim($(this).val());
        var objID = $(this).parents('.im').attr('id');
        App.sendMsg('#' + objID, text);
    }
});

$('body').on('click', '#chatview', function() {
    var tid = $(this).find('i').attr('tid');;
    hideNewMsgMarquee();
});

$('body').on('click', '.group-name', function() {
    var tid = $(this).attr('tid');;
    hideNewMsgMarquee();
});

var loadHistory = function(IM_ID) {
    var uid = $(IM_ID).attr('uid');
    var IM_ID = IM_ID;
    var pageIndex = $(IM_ID).find('.im-history').attr('page-index');

    $.get(urlMap.messageHistory, {ufrom:uid, page_index:pageIndex}, function(data){
        var pageNum = data.page.page_num;
        var data = data.data;

        if(pageNum < pageIndex) {
            $(IM_ID).find('.im-history').text('无更多记录');
        } else {
            $(IM_ID).find('.im-history').attr('page-index', ++pageIndex);

            var count = 0;
            $.each(data, function(index, val){
              var msg = val.body;
              var time = val.addon;
              var ufrom = val.ufrom;
              var type = (uid == ufrom) ? 'receive' : 'send';
              newMsg(IM_ID, msg, time, type, true, true);

              if(count++ == data.length-1) {
                $(IM_ID).find('.im-message').prepend($('<div class="history-time">').text(time));
              }
            });
        }
    })
}

$('body').on('click', '.im-history', function(){
    var IM_ID = '#' + $(this).parents('.im').attr('id');
    loadHistory(IM_ID);
});


$('body').on('click', '.im .im-close', function(){
    $(this).parents('.im').fadeOut();
})

$('body').on('click', '.im .im-minimize', function(){

    var $im = $(this).parents('.im');

    $im.find('.im-message').css('display','none');
    $im.find('.im-footer').css('display','none');

    // $im.css({"left":"auto", "top":"auto"});
    // $im.animate({bottom:"0px", right:"0px"});
})

$('body').on('click', '.im .im-maximization', function(){

    var $im = $(this).parents('.im');

    $im.find('.im-message').css('display','block');
    $im.find('.im-footer').css('display','block');
    
    // $im.css({"left":"auto", "top":"auto"});
    // $im.animate({bottom:"0px", right:"0px"});
})

$('body').on('click', '.im', function(event) {
    var uid = $(this).attr('uid');
    clearMsgCount(uid, true);
});

$('body').on('input', '.chat-textarea', function(event) {
    var uid = $(this).parents('.im').attr('uid');
    clearMsgCount(uid, true);
});

$('.im').draggable();