$('.remark-btn').on('click',function(){
	var self = $(this);
	var descripttype = $(this).attr('descripttype');
	var sectionid = $(this).attr('sectionid');
	var location = $(this).attr('location');
	var lumjg = $(this).attr('lumjg');
	var bigclass = $(this).parents('.bigclassdiv').find('.bigclass').attr('name');
	var smallclass = $(this).parents('.objectdiv').find('.smallclass').attr('name');
	if (smallclass) {
		var img_modal_id = sectionid + '_' + bigclass + '_' + smallclass + '_pic';
	}else {
		var img_modal_id = sectionid + '_' + bigclass + '_pic';
	}

	$('#' + img_modal_id).modal('show');
	$('#' + img_modal_id).find('textarea').val('');
	$('.add_remark').attr('descripttype',descripttype);
	$('.add_remark').attr('img_modal_id',img_modal_id);

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
        addRemoveLinks: true,
        dictDefaultMessage: '<span class="bigger-150 bolder"><i class="icon-caret-right red"></i> 点击</span> 上传图片 \
<span class="smaller-80 grey">(或拖拽)</span> <br /> \
<span class="smaller-60 grey">照片要小于5M</span> <br /> \
<i class="upload-icon icon-cloud-upload blue icon-3x"></i><br>',
        dictResponseError: '传输文件时出错!',
        previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
    });
});

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

$('.add_disease').on('click',function(){
	var sectionid = $(this).attr('sectionid');
	var roadid = $(this).attr('roadid');
	var _location = $(this).attr('location');
	var lumjg = $(this).attr('lumjg');
	if (_location == 'chexd') {
		var disease_type_modal = _location + '_' + lumjg + '_disease_modal';		
	}else{
		var disease_type_modal = _location + '_disease_modal';
	}	
	$('#' + disease_type_modal).modal('show');
	$('#' + disease_type_modal).find('input').val('');
	$('#' + disease_type_modal).find("input[type='checkbox']").prop('checked',false);
	var add_disease_btn = $('#' + disease_type_modal).find('#add_disease_btn');
	add_disease_btn.attr({'roadid':roadid,'location':_location,'sectionid':sectionid,'lumjg':lumjg});

	var remark_btn = $('#' + disease_type_modal).find('.remark-btn');
	remark_btn.attr({'location':_location,'sectionid':sectionid,'lumjg':lumjg});

	var count = 0;	
	$('#' + disease_type_modal).find('#add_disease_btn').unbind('click');
	$('#' + disease_type_modal).find('#add_disease_btn').on('click',function(){
		var disease_type_modal = $(this).parents('.big-modal').attr('id');
		var checkbox = $('#' + disease_type_modal).find('.checkbox');	
		var _location = $(this).attr('location');
		var roadid = $(this).attr('roadid');
		var sectionid = $(this).attr('sectionid');
		var lumjg = $(this).attr('lumjg');

		$(checkbox).each(function(i,item){
			var bigclass = $(item).parents('.bigclassdiv').find('.bigclass').attr('name');
			var smallclass = $(item).parents('.objectdiv').find('.smallclass').attr('name');
			var remark_btn = $(item).parents('.objectdiv').find('.remark-btn');	
			var damageinput = $(item).parents('.objectdiv').find('.damageinput').val();
			
			if ($(item).prop('checked') && damageinput) {
				var info = remark_btn.attr('info');
				var fid = remark_btn.attr('fid');
				var resize_fid = remark_btn.attr('resize_fid');	
				if (_location == 'chexd' || _location == 'renxd') {
					var damagearea = damageinput;
					$.post('/manage/roadyangh/disease/add',{
						'roadid':roadid,
						'sectionid':sectionid,
						'lumjg':lumjg,
						'location':_location,
						'info':info,
						'damagearea':damagearea,
						'smallclass':smallclass,
						'bigclass':bigclass,
						'fid':fid,
						'resize_fid':resize_fid
					},function(rs){
						if (rs.status) {							
							count++;
							$('.big-modal').modal('hide');
							if (count == $('.selectinput').length) {
								location.reload();
								$('.selectinput').removeClass('selectinput');
								alert('修改成功');								
							};
						};
					});
				}else{
					var damagenum = damageinput;
					$.post('/manage/roadyangh/disease/add',{
						'roadid':roadid,
						'sectionid':sectionid,
						'lumjg':lumjg,
						'location':_location,
						'info':info,
						'damagenum':damagenum,
						'smallclass':smallclass,
						'bigclass':bigclass,
						'fid':fid,
						'resize_fid':resize_fid
					},function(rs){
						if (rs.status) {
							count++;
							$('.big-modal').modal('hide');
							if (count == $('.selectinput').length) {
								location.reload();
								$('.selectinput').removeClass('selectinput');
								alert('修改成功');
							};
						};
					});
				}
			};
		});
	});
});

$('#watchalldis').on('click',function(){
	$('.timeline-container,.addon-container,.timeline-items').removeClass('hide').addClass('showitem');
	$('#no-disease').addClass('hide');
	clearsearch();
	$('#watchalldis,.watchdis').removeClass('text-active').addClass('text-primary');	
	$(this).removeClass('text-primary').addClass('text-active');
	$('.searchdis').removeClass('searchdis');
	setdisattr('#untreateddis','#treateddis','timeline-items');
});

$('.watchdis').on('click',function(){
	var watchdisinfo = $(this).attr('watchdisinfo');
	judgedisstatus(watchdisinfo);
	clearsearch();
	$('#watchalldis,.watchdis').removeClass('text-active').addClass('text-primary');	
	$(this).removeClass('text-primary').addClass('text-active');
	$('.searchdis').removeClass('searchdis');
});


//已处理未处理都查看
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

//隐藏某一路段或某一位置的病害
function hidedis(hidelocation){
	if (hidelocation.length > 0) {
		hidelocation.addClass('hide').removeClass('showitem');
		hidelocation.parents('.timeline-container').addClass('hide').removeClass('showitem');
		hidelocation.parents('.addon-container').addClass('hide').removeClass('showitem');
	};
	$('#no-disease').addClass('hide');
}

//给已处理未处理设置路段或位置
function setdisattr(untreateddis,treateddis,sectioninfo){
	$(untreateddis).attr('sectioninfo',sectioninfo);
	$(treateddis).attr('sectioninfo',sectioninfo);
}

//查看某一路段或某一位置的已处理未处理病害
function showistreated(sectioninfo,face){
	if (sectioninfo) {
		var istreateddis = sectioninfo.find(face).parents('.timeline-items');			
	}else{
		var istreateddis = $(face).parents('.timeline-items');
	}
	watchdis(istreateddis);
}

function judgedisstatus(sectioninfo){
	setdisattr('#untreateddis','#treateddis',sectioninfo);
	if (sectioninfo.indexOf('_') >= 0) {
		sectioninfo = $('.' + sectioninfo);
	}else{
		sectioninfo = $('.dis_' + sectioninfo);
	}
	var face =[];
	$('.selectone').each(function(i,item){
		if ($(item).hasClass('select')) {
			face.push($(item).attr('face'));
		};		
	});	
	if (face.length == 2) {
		$('#no-disease').find('.icon-leaf').text('无病害');		
		watchdis(sectioninfo);	
	}else if (face.length == 0) {
		hidedis(sectioninfo);
	}else {
		if (face[0] == '.fa-bug') {
			$('#no-disease').find('.icon-leaf').text('无未处理病害');					
		}else{
			$('#no-disease').find('.icon-leaf').text('无已处理病害');		
		}
		showistreated(sectioninfo,face[0]);
	}
	
}

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

	if (sectioninfo) {
		if (sectioninfo.indexOf('_') >= 0) {
			sectioninfo = $('.' + sectioninfo)
		}else{
			sectioninfo = $('.dis_' + sectioninfo)
		}
	}	
	
	if (thischeck.hasClass('select')) {
		if ($(siblingcheck).prop('checked')) {
			$('#no-disease').find('.icon-leaf').text('无病害');
			if (!sectioninfo) {
				$('.timeline-container,.addon-container,.timeline-items').removeClass('hide').addClass('showitem');
				$('#no-disease').addClass('hide');
			}else{
				watchdis(sectioninfo);
			}			
		}else{
			$('#no-disease').find('.icon-leaf').text('无未处理病害');
			showistreated(sectioninfo,'.fa-bug');
		}
	}else{
		if ($(siblingcheck).prop('checked')) {
			$('#no-disease').find('.icon-leaf').text('无已处理病害');
			showistreated(sectioninfo,'.fa-smile-o');
		}else{
			if (!sectioninfo) {
				$('.timeline-container,.addon-container,.timeline-items').addClass('hide').removeClass('showitem');
			}else{
				hidedis(sectioninfo);
			}			
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

	if (sectioninfo) {
		if (sectioninfo.indexOf('_') >= 0) {
			sectioninfo = $('.' + sectioninfo)
		}else{
			sectioninfo = $('.dis_' + sectioninfo)
		}
	}	

	if (thischeck.hasClass('select')) {
		if ($(siblingcheck).prop('checked')) {
			$('#no-disease').find('.icon-leaf').text('无病害');
			if (!sectioninfo) {
				$('.timeline-container,.addon-container,.timeline-items').removeClass('hide').addClass('showitem');
				$('#no-disease').addClass('hide');
			}else{
				watchdis(sectioninfo);
			}
		}else{
			$('#no-disease').find('.icon-leaf').text('无已处理病害');
			showistreated(sectioninfo,'.fa-smile-o');
		}
	}else{
		if ($(siblingcheck).prop('checked')) {
			$('#no-disease').find('.icon-leaf').text('无未处理病害');
			showistreated(sectioninfo,'.fa-bug');
		}else{
			if (!sectioninfo) {
				$('.timeline-container,.addon-container,.timeline-items').addClass('hide').removeClass('showitem');
			}else{
				hidedis(sectioninfo);
			}
		}
	}
});


//删除病害
$('.delDesease').on('click',function(){
	var self = $(this);
	var parent = $(this).parents('.addon-container');
	var diseaseid = $(this).attr('diseaseid');
	if (confirm('确认是否删除')) {
		$.post(' /manage/roadyangh/disease/del',{'_id':diseaseid},function(rs){
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

