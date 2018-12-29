//输入损坏面积
$('.damagearea').change(function(){
	if ($(this).parents('.smallclassdiv').length) {
		var damagescoreinput = $(this).parents('.smallclassdiv').find('.damagescore');
	}else{
		var damagescoreinput = $(this).parents('.bigclassdiv').find('.damagescore');
	}
	var locationmj = $(this).parents('.modal').find('#add_disease_btn').attr('locationmj');
	if (locationmj) {
		var density = parseFloat($(this).val())/locationmj*100;
		if (density > 100) {
			alert('输入的损坏面积超过路段总面积');
		}else{
			var smallclass = $(this).parents('.smallclassdiv').find('.smallclass').attr('name');
			var bigclass = $(this).parents('.bigclassdiv').find('.bigclass').attr('name');
			var pavementtype = $(this).parents('.big-modal').attr('id');
			if (pavementtype.indexOf('li') >= 0) {
				var score = func_score_liqlm(smallclass,density);
			}else if (pavementtype.indexOf('shui') >= 0) {
				var score = func_score_shuinlm(smallclass,density);
			}else{
				var score = func_score_renxd(bigclass,density);
			}
			$(damagescoreinput).val(score.toFixed(2));
		}
	}else{
		alert('未设置道路总面积');
	}

});

//图片及描述a
$('.remark-btn').on('click',function(){
	var self = $(this);
	var descripttype = $(this).attr('descripttype');
	var sectionid = $(this).attr('sectionid');
	var bigclass = $(this).attr('bigclass');
	if (bigclass) {
		var img_modal_name = sectionid + '_' + $(this).attr('location') + '_' +bigclass + '_' + descripttype;
	}else{
		var img_modal_name = sectionid + '_' + descripttype;
	}
	var img_modal_id = img_modal_name + '_pic';
	$('#' + img_modal_id).modal('show');
	$('#' + img_modal_id).find('textarea').val('');
	$('.add_remark').attr('descripttype',descripttype);
	$('.add_remark').attr('img_modal_id',img_modal_id);
     try{
     		$('#' + img_modal_id).find(".dropzone").dropzone({
        paramName: 'hhfile', // The name that will be used to transfer the file
        params:{ size: JSON.stringify([300, 300])},
        maxFilesize: 5, // MB
        acceptedFiles:'.png,.jpeg,.jpg,.bmp,.PNG,.JPEG,.JPG,.BMP',
        success: function(hhfile, response) {
            if (response.status) {
            	if (self.attr('fid')) {
            		var oldfid = self.attr('fid');
            		self.attr('fid',oldfid + ',' + response.fid);
            	}else{
            		self.attr('fid',response.fid);
            	}
            	if (self.attr('resize_fid')) {
            		var oldresize_fid = self.attr('resize_fid');
            		self.attr('resize_fid',oldresize_fid + ',' + response.resize_fid);
            	}else{
            		self.attr('resize_fid',response.resize_fid);
            	}
            }
        },
        init:function(){
        	 this.on("removedfile", function (file){
        	 	var  redata=JSON.parse(file.xhr.response);
        	 	if(redata.status){     
        	 		if(self.attr('fid')){
        	 			var  fid=self.attr('fid');
        	 			var arrfid=fid.split(",");
        	 			      arrfid.forEach(function(v,i){
                                              if(v== redata.fid){
                                              	 console.log(arrfid);   
                                              	 arrfid.splice(i,1);   
                                              	 fid=arrfid.join(",");
                                              };                                                
                                                   self.attr('fid',fid);
        	 			  })
        	 		};
        	 		if(self.attr('resize_fid')){
        	 			var rsfid=self.attr('resize_fid')
        	 			var arrsfid=rsfid.split(",");
        	 			      arrsfid.forEach(function(v,i){
                                             if(v==redata.resize_fid){
                                                   arrsfid.splice(i,1);
                                                   rsfid=arrsfid.join(",");
                                             }
                                                   self.attr('resize_fid',rsfid);
        	 			  })
        	 		}
        	 		
        	 	}
        	 
        	 });
        },
        addRemoveLinks: true,
        dictDefaultMessage: '<span class="bigger-150 bolder"><i class="icon-caret-right red"></i> 点击</span> 上传图片 \
<span class="smaller-80 grey">(或拖拽)</span> <br /> \
<span class="smaller-60 grey">照片要小于5M</span> <br /> \
<i class="upload-icon icon-cloud-upload blue icon-3x"></i><br>',
        dictResponseError: '传输文件时出错!',
        previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
    });
     	}catch(err){

     	}
});
//描述确定
$('.add_remark').on('click',function(){
	var descripttype = $(this).attr('descripttype');
	var img_modal_id = $(this).attr('img_modal_id');
	var info = $('#' + img_modal_id).find('.add-descrption').val();
	$('a[descripttype='+descripttype+']').attr('info',info);
});
//全选
$('.selectall').on('click',function(){
	if ($(this).prop('checked')) {
		$(this).parents('.big-modal').find('.checkbox').prop('checked',true).addClass('selectinput').removeClass('unselectinput');
	}else{
		$(this).parents('.big-modal').find('.checkbox').prop('checked',false).removeClass('selectinput').addClass('unselectinput');;
	}
});

$('.checkbox').on('click',function(){
	if ($(this).prop('checked')) {
		$(this).addClass('selectinput').removeClass('unselectinput');
	}else{
		$(this).removeClass('selectinput').addClass('unselectinput');
	}
	var checkboxlength = $(this).parents('.big-modal').find('.checkbox').length;
	var selectlength = $(this).parents('.big-modal').find('.selectinput').length;
	if (checkboxlength == selectlength) {
		$(this).parents('.big-modal').find('.selectall').prop('checked',true);
	}else{
		$(this).parents('.big-modal').find('.selectall').prop('checked',false);
	}
});



$('.add_disease_btn').on('click', function() {
      var  flag=0;
	var pavementtype = $(this).parents('.big-modal').attr('id');
	var checkbox = $('#' + pavementtype).find('.checkbox');
	var _location = $(this).attr('location');
	var roadid = $(this).attr('roadid');
	var sectionid = $(this).attr('sectionid');
	var lumjg = $(this).attr('lumjg');
	var locationmj = $(this).attr('locationmj');
	var daollb = $(this).attr('daollb');
	$(checkbox).each(function(i,item){
		var bigclass = $(item).parents('.bigclassdiv').find('.bigclass').attr('name');
		var smallclass = $(item).parents('.smallclassdiv').find('.smallclass').attr('name');
		var remark_btn = $(item).parents('.objectdiv').find('.remark-btn');
		var damagearea = $(item).parents('.objectdiv').find('.damagearea').val();
		if ($(item).prop('checked') && damagearea) {
			var info = remark_btn.attr('info');
			var fid = remark_btn.attr('fid');
			var resize_fid = remark_btn.attr('resize_fid');
			console.log(resize_fid)
			var density = damagearea/locationmj*100;
			if (pavementtype.indexOf('li') >= 0) {
				var score = func_score_liqlm(smallclass,density);
			}else if (pavementtype.indexOf('shui') >= 0) {
				var score = func_score_shuinlm(smallclass,density);
			}else{
				var score = func_score_renxd(bigclass,density);
			}
			
			$.post('/manage/road/disease/add',{
				'roadid':roadid,
				'sectionid':sectionid,
				'lumjg':lumjg,
				'location':_location,
				'score':score,
				'info':info,
				'damagearea':damagearea,
				'smallclass':smallclass,
				'bigclass':bigclass,
				'fid':fid,
				'resize_fid':resize_fid
			},function(rs){
				flag++;
				if (rs.status) {
					$('#' + pavementtype).find('input').val('');
					$('#' + pavementtype).find("input[type='checkbox']").prop('checked',false);
					$(".dropzone ").removeClass('dz-started');
					$('.dz-image-preview').remove();
					if(flag==1){
						alert('修改成功');
					}	
				};
			});
		}
	});

});
if(location.href.indexOf('&sub_tag')!=-1){
	$('.widget-toolbar .nav  a.tabtoggle').each(function(v,i){
		 $(i).removeClass('text-active').addClass('text-primary').parents('li').removeClass('active');
		 var active_tabhref=location.href.split("&")[1].split("=")[1]
		 if($(i).attr("location")==active_tabhref){			
			$(i).addClass('text-active').removeClass('text-primary').parents('li').addClass('active');
		}		
	})
}
$(".close-disease").click(function(){
	var activeTab=$(this).parents('.big-modal').find('#add_disease_btn').attr('location');
	var tabhref=location.href
	if(location.href.indexOf('&sub_tag')!=-1 ){
		 tabhref=location.href.split("&")[0];
	}
	location.href = tabhref+'&sub_tag='+activeTab;
	//location.href = location.href.substring(0,80)+'#tag-'+activeTab;
})
 
//增加病害
$('.add-disease').on('click',function(){
	var pavementtype = $(this).attr('type');
	$('#' + pavementtype).modal('show');
	$('#' + pavementtype).find('input').val('');
	$('#' + pavementtype).find("input[type='checkbox']").prop('checked',false);
	var add_disease_btn = $('#' + pavementtype).find('#add_disease_btn');
	add_disease_btn.attr('roadid',$(this).attr('roadid'));
	add_disease_btn.attr('sectionid',$(this).attr('sectionid'));
	add_disease_btn.attr('lumjg',$(this).attr('lumjg'));
	add_disease_btn.attr('locationmj',$(this).attr('locationmj'));
	add_disease_btn.attr('daollb',$(this).attr('daollb'));
	add_disease_btn.attr('location',$(this).attr('location'));
	var remark_btn = $('#' + pavementtype).find('.remark-btn');
	remark_btn.attr('sectionid',$(this).attr('sectionid'));
	remark_btn.attr('location',$(this).attr('location'));
	//存储各病害的信息
	var count = 0;
	//$('#'+ pavementtype).find('#add_disease_btn').unbind('click');
	// $('#'+ pavementtype).find('#add_disease_btn').click(function(){
	// 	var pavementtype = $(this).parents('.big-modal').attr('id');
	// 	var checkbox = $('#' + pavementtype).find('.checkbox');
	// 	var _location = $(this).attr('location');
	// 	var roadid = $(this).attr('roadid');
	// 	var sectionid = $(this).attr('sectionid');
	// 	var lumjg = $(this).attr('lumjg');
	// 	var locationmj = $(this).attr('locationmj');
	// 	var daollb = $(this).attr('daollb');
	// 	$(checkbox).each(function(i,item){
	// 		var bigclass = $(item).parents('.bigclassdiv').find('.bigclass').attr('name');
	// 		var smallclass = $(item).parents('.smallclassdiv').find('.smallclass').attr('name');
	// 		var remark_btn = $(item).parents('.objectdiv').find('.remark-btn');
	// 		var damagearea = $(item).parents('.objectdiv').find('.damagearea').val();
	// 		if ($(item).prop('checked') && damagearea) {
	// 			var info = remark_btn.attr('info');
	// 			var fid = remark_btn.attr('fid');
	// 			var resize_fid = remark_btn.attr('resize_fid');
	// 			var density = damagearea/locationmj*100;
	// 			if (pavementtype.indexOf('li') >= 0) {
	// 				var score = func_score_liqlm(smallclass,density);
	// 			}else if (pavementtype.indexOf('shui') >= 0) {
	// 				var score = func_score_shuinlm(smallclass,density);
	// 			}else{
	// 				var score = func_score_renxd(bigclass,density);
	// 			}
				
	// 			$.post('/manage/road/disease/add',{
	// 				'roadid':roadid,
	// 				'sectionid':sectionid,
	// 				'lumjg':lumjg,
	// 				'location':_location,
	// 				'score':score,
	// 				'info':info,
	// 				'damagearea':damagearea,
	// 				'smallclass':smallclass,
	// 				'bigclass':bigclass,
	// 				'fid':fid,
	// 				'resize_fid':resize_fid
	// 			},function(rs){
	// 				if (rs.status) {
	// 					count++;
	// 					if (count == $('.selectinput').length) {
	// 						// location.reload();
	// 						$('#' + pavementtype).find('input').val('');
	// 						$('#' + pavementtype).find("input[type='checkbox']").prop('checked',false);
	// 						$('#add_disease_btn').bind('click');

	// 						alert('修改成功');
	// 					};
	// 				};
	// 			});
	// 		}
	// 	});
	// });//添加病害
});

setdisattr('#untreateddis','#treateddis','dis_jidcd');

//查看病害
$('.tabtoggle').click(function(){
	$('.tabtoggle,.watchroaddis,.watchdis,.watchlocationdis').removeClass('text-active').addClass('text-primary');
	$(this).removeClass('text-primary').addClass('text-active');
	var tabid = $(this).attr('href');
	var sectionid = $(tabid).find('.road_parent_li').attr('id');
	var location = $(this).attr('location');
	$('#untreateddis').prop('checked',true).addClass('select');
	$('#treateddis').prop('checked',true).addClass('select');
	$('#no-disease').find('.icon-leaf').text('无病害');
	watchdis($('.dis_' + location));
	setdisattr('#untreateddis','#treateddis','dis_' + location);
	clearsearch();
});
function watchdis(showdis){
	$('.timeline-container,.addon-container,.timeline-items').addClass('hide').removeClass('showitem');
	if (showdis.length > 0) {
		showdis.removeClass('hide').addClass('showitem');
		showdis.parents('.timeline-container').removeClass('hide').addClass('showitem');
		showdis.parents('.addon-container').removeClass('hide').addClass('showitem');
	}else{
		$('#no-disease').removeClass('hide');
	}
}
//隐藏人行道,非机动车道,机动车道下的病害
function hidedis(hidelocation){
	if (hidelocation.length > 0) {
		hidelocation.addClass('hide').removeClass('showitem');
		hidelocation.parents('.timeline-container').addClass('hide').removeClass('showitem');
		hidelocation.parents('.addon-container').addClass('hide').removeClass('showitem');
	};
	$('#no-disease').addClass('hide');
}

function setdisattr(untreateddis,treateddis,sectioninfo){
	$(untreateddis).attr('sectioninfo',sectioninfo);
	$(treateddis).attr('sectioninfo',sectioninfo);
}

function showistreated(sectioninfo,face){
	if (sectioninfo) {
		var istreateddis = $('.' + sectioninfo).find(face).parents('.timeline-items');
	}else{
		var istreateddis = $(face).parents('.timeline-items');
	}
	watchdis(istreateddis);
}
function judgedisstatus(sectioninfo){
	var face =[];
	$('.selectone').each(function(i,item){
		if ($(item).hasClass('select')) {
			face.push($(item).attr('face'));
		};
	});
	if (face.length == 2) {
		$('#no-disease').find('.icon-leaf').text('无病害');
		watchdis($('.'+sectioninfo));
	}else if (face.length == 0) {
		hidedis($('.'+sectioninfo));
	}else {
		if (face[0] == '.fa-bug') {
			$('#no-disease').find('.icon-leaf').text('无未处理病害');
		}else{
			$('#no-disease').find('.icon-leaf').text('无已处理病害');
		}
		showistreated(sectioninfo,face[0]);
	}
	setdisattr('#untreateddis','#treateddis',sectioninfo);
}
//整条道路查看病害
$('.watchroaddis').click(function(){
	$('.watchlocationdis,.tabtoggle').removeClass('text-active').addClass('pointer');
	$('.watchdis').removeClass('text-active').addClass('text-primary');
	$('.searchdis').removeClass('searchdis');
	$(this).removeClass('text-primary').addClass('text-active');
	var location = $(this).attr('location');
	$('.tabtoggle_' + location).removeClass('text-primary').addClass('text-active');
	judgedisstatus('dis_' + location);
	clearsearch();
});
//各路段及其下的人行道，非机动车道,机动车道查看病害
$('.watchlocationdis,.watchdis').on('click',function(){
	$('.watchroaddis,.watchdis,.watchlocationdis,.tabtoggle').removeClass('text-active').addClass('text-primary');
	$(this).removeClass('text-primary,pointer').addClass('text-active');
	$('.searchdis').removeClass('searchdis');
	var location = $(this).attr('location');
	$('.tabtoggle_' + location).removeClass('text-primary').addClass('text-active');
	var sectionlocation = $(this).attr('sectionlocation');
	judgedisstatus(sectionlocation);
	clearsearch();
});

//已处理，未处理
$('#untreateddis').on('change',function(){
	var sectioninfo = $(this).attr('sectioninfo');
	var thischeck = $(this).parents('.disstatus').find("input[type='checkbox']");
	if (thischeck.hasClass('select')) {
		thischeck.removeClass('select').addClass('unselect');
	}else{
		thischeck.removeClass('unselect').addClass('select');
	}
	var siblingcheck = $(this).parents('.disstatus').siblings().find("input[type='checkbox']");
	if (thischeck.hasClass('select')) {
		if ($(siblingcheck).prop('checked')) {
			$('#no-disease').find('.icon-leaf').text('无病害');
			watchdis($('.' + sectioninfo));
		}else{
			$('#no-disease').find('.icon-leaf').text('无未处理病害');
			showistreated(sectioninfo,'.fa-bug');
		}
	}else{
		if ($(siblingcheck).prop('checked')) {
			$('#no-disease').find('.icon-leaf').text('无已处理病害');
			showistreated(sectioninfo,'.fa-smile-o');
		}else{
			hidedis($('.' + sectioninfo));
		}
	}
});
$('#treateddis').on('change',function(){
	var sectioninfo = $(this).attr('sectioninfo');
	var thischeck = $(this).parents('.disstatus').find("input[type='checkbox']");
	var siblingcheck = $(this).parents('.disstatus').siblings().find("input[type='checkbox']");
	if (thischeck.hasClass('select')) {
		thischeck.removeClass('select').addClass('unselect');
	}else{
		thischeck.removeClass('unselect').addClass('select');
	}
	if (thischeck.hasClass('select')) {
		if ($(siblingcheck).prop('checked')) {
			$('#no-disease').find('.icon-leaf').text('无病害');
			watchdis($('.' + sectioninfo));
		}else{
			$('#no-disease').find('.icon-leaf').text('无已处理病害');
			showistreated(sectioninfo,'.fa-smile-o');
		}
	}else{
		if ($(siblingcheck).prop('checked')) {
			$('#no-disease').find('.icon-leaf').text('无未处理病害');
			showistreated(sectioninfo,'.fa-bug');
		}else{
			hidedis($('.' + sectioninfo));
		}
	}
});
//删除病害
$('.delDesease').on('click',function(){
	var self = $(this);
	var parent = $(this).parents('.addon-container');
	var diseaseid = $(this).attr('diseaseid');
	if (confirm('确认是否删除')) {
		$.post('/manage/road/disease/delete',{'_id':diseaseid},function(rs){
			if (rs.status) {
				if ($(self).parents('.addon-container').find('.showitem').length == 1) {
					$(self).parents('.timeline-container').remove();
				} else {
					$(self).parents('.timeline-items').remove();
				}
			};
		});
	};
});

// 重新评估
$('#road_report').on('click', function() {
	$(this).attr('disabled', true);
	
	var roadid = $(this).attr('roadid');
	$.post("/manage/road/report", {'roadid' : roadid}, function(rs) {
		if (rs.status) {
			location.reload();
		} else {
			alert(rs.dataMsg);
			location.reload();
		}
	});
	
});

//设置参数
$('.set_argument').on('click',function(){
	var setargtype = $(this).attr('setargtype');//标识位置和参数种类 eg:renxdpzd,feijdcdpzd
	var modaltype = $(this).attr('data-type');//与setargtype对应,打开相应form
	var daollb = $(this).attr('daollb');//道路类别,计算分值时传入使用,分沥青和水泥
	var sectionid = $(this).attr('sectionid');
	var location = $(this).attr('location');
	$('#' +modaltype).modal('show');
	$('#' + modaltype).find("input").val('');
	var computevalue = $(this).parents('.project-num').find('.modifyvalue').text();//页面中读出的值,用于写入form中
	var computegrade = $(this).parents('.project-num').find('.modifygrade').text();//页面中读出的等级,用于写入form中

	if (setargtype.indexOf('pzd') >= 0) {
		var input_value = $(this).attr('input-value');
		$('#' +modaltype).find('.testvalue').val(input_value);
		$('#' +modaltype).find('.computevalue').val(computevalue);
	}else if (setargtype == 'feijdcdkh' || setargtype == 'jidcdkh' || setargtype == 'renxdkh') {
		if ($(this).siblings('b').find('.bpn').length > 0) {
			var computevalue = $(this).siblings('b').find('.bpn').text();
			$('#' +modaltype).find('.testvalue').eq(0).val(computevalue);
		}
		if($(this).siblings('b').find('.sfc').length > 0){
			var computevalue = $(this).siblings('b').find('.sfc').text();
			$('#' +modaltype).find('.testvalue').eq(1).val(computevalue);
		}
	}else if (setargtype == 'feijdcdjiegqd' || setargtype == 'jidcdjiegqd' || setargtype == 'renxdjiegqd') {
		$('#' +modaltype).find('.testvalue').val(computevalue);
	};

	$('#' +modaltype).find('.computegrade').val(computegrade);
	$('#' +modaltype).find('.set_arg_btn').attr('daollb',daollb);
	$('#' +modaltype).find('.set_arg_btn').attr('sectionid',sectionid);
	$('#' +modaltype).find('.set_arg_btn').attr('setargtype',setargtype);
	$('#' +modaltype).find('.set_arg_btn').attr('location',location);
	var jiaotldj = $(this).attr('jiaotldj');
	var jiclx = $(this).attr('jiclx');
	if (jiaotldj) {
		$('#' +modaltype).find('.set_arg_btn').attr('jiaotldj',jiaotldj);
		$('#' +modaltype).find('.set_arg_btn').attr('jiclx',jiclx);
	};
});

//设置参数change事件
$('.testvalue').on('change',function(){
	var setargtype = $(this).parents('.modal').find('.set_arg_btn').attr('setargtype');
	var daollb = $(this).parents('.modal').find('.set_arg_btn').attr('daollb');
	var inputvalue = parseFloat($(this).val());
	if (daollb) {

		if (setargtype == 'renxdpzd') {
			
			var computevalue = 4.98 - 0.34 * inputvalue;
			var grade = func_score_renxdpzd(computevalue);
		}else if (setargtype == 'feijdcdpzd' || setargtype == 'jidcdpzd') {
			var computevalue = 4.98 - 0.34 * inputvalue;
			var grade = func_score_lumpzd(daollb,computevalue);
		}else if (setargtype == 'feijdcdkh' || setargtype == 'jidcdkh' || setargtype == 'renxdkh') {
			var checkedradio = $(':radio:checked');
			$(checkedradio).parents('.radio_group').siblings().find('.testvalue,.computegrade').val('');
			var computevalue = parseFloat($(checkedradio).parents('.radio_group').find('.testvalue').val());
			var key = $(checkedradio).attr("class");
			var grade = func_score_lumkh(key,daollb,computevalue);
		}else if (setargtype == 'feijdcdjiegqd' || setargtype == 'jidcdjiegqd' || setargtype == 'renxdjiegqd') {
			var computevalue = parseFloat($(this).val());
			var trafficgrade = $(this).parents('.modal').find('.set_arg_btn').attr('jiaotldj');
			var basictype = $(this).parents('.modal').find('.set_arg_btn').attr('jiclx');
			if (trafficgrade) {
				if (basictype) {
					var grade = func_score_pssi(basictype,trafficgrade,computevalue);
				}else{
					alert('未设置基层类型');
					return;
				}
			}else{
				alert('未设置交通量等级');
				return;
			}
		};	
		var ctf = computevalue.toFixed(2);
		if(!ctf ||ctf=="NaN"){
			ctf = ' '
		}
		$(this).parents('.modal-body').find('.computegrade').val(grade);
		$(this).parents('.modal-body').find('.computevalue').val(ctf);
	}else{
		alert('未设置道路类别');
	}
});

//设置参数
$('.set_arg_btn').on('click',function(){
	var sectionid = $(this).attr('sectionid');
	var setargtype = $(this).attr('setargtype');
	var location = $(this).attr('location');
	var grade = $(this).parents('.modal').find('.computegrade').val();
	if(!grade){
		grade = ''
	}
	var args = {};
	args['sectionid'] = sectionid;
	args[setargtype] = grade;

	if (setargtype == 'renxdpzd') {
		var inputvalue = parseFloat($('#rexdpzd-modal .testvalue').val());
		var testname = 'iri';
		var modifyvalue = $('#rexdpzd-modal .computevalue').val();
		args[setargtype + '_iri'] = inputvalue || '';
		console.log(typeof modifyvalue);
		args[setargtype + '_fqi'] = modifyvalue || '';

	}else if (setargtype == 'feijdcdpzd' || setargtype == 'jidcdpzd') {
		var inputvalue = parseFloat($('#number-modal .testvalue').val());
		var testname = 'iri';
		var modifyvalue = $('#number-modal .computevalue').val();
		args[setargtype + '_iri'] = inputvalue || '';
		args[setargtype + '_rqi'] = modifyvalue || '';

	}else if (setargtype == 'feijdcdkh' || setargtype == 'jidcdkh' || setargtype == 'renxdkh') {
		var checkedradio = $('#bpn-modal :radio:checked');
		var inputvalue = parseFloat($(checkedradio).parents('.radio_group').find('.testvalue').val());
		var modifyvalue = inputvalue;
		var key = $(checkedradio).attr("class");
		var testname = key.toLowerCase();
		args[setargtype + "_" + testname] = inputvalue || '';

	}else if (setargtype == 'feijdcdjiegqd' || setargtype == 'jidcdjiegqd' || setargtype == 'renxdjiegqd') {
		var inputvalue = parseFloat($(this).parents('.modal').find('.testvalue').val());
		var modifyvalue = inputvalue || '';
		var testname = 'lbhtwcz';	//路表回弹弯沉值
		args[setargtype + "_" + testname] = inputvalue || '';
	};

		var mtf =  parseFloat(modifyvalue).toFixed(2);
		if(!mtf ||mtf=="NaN"){
			mtf = ' '
		}
		$.post('/manage/road/update', args, function(rs){
			if (rs.status) {
				$('.set_arg_btn').parents('.big-modal').modal('hide');
				alert('设置成功');
				if (setargtype == 'renxdpzd') {
					$('.' + sectionid + '_' + location).find('.renxdpzd').text(mtf);
					$('.' + sectionid + '_' + location).find('.renxdpzdgrade').text(grade||'');
					$('.' + sectionid + '_' + location).find('.renxdpzd').parents('b').siblings('.set_argument').attr('input-value',inputvalue||'');
				}else{
					$('.' + sectionid + '_' + location).find('.' + testname).text(mtf);
					$('.' + sectionid + '_' + location).find('.' + testname).parents('b').find('b').text(grade||'');
					$('.' + sectionid + '_' + location).find('.' + testname).parents('b').siblings('.set_argument').attr('input-value',inputvalue||'');
				}
			};
		});
});