// 查询指定路段起点/终点的病害信息
$('body').on('keyup', '#section_start', function(event) {
    $('.btn-search-section').attr('disabled', true);

    var start = $('#section_start').val();
    var end = $('#section_end').attr('daolzdId');
    var roadid = $('#section_start').attr('roadid');
    if (!start) {
        $('.section_start_ul').html('');
        $('.section_start_ul').attr('style', 'display:none');
    }
    console.log(roadid, start, end);
    $.post('/roadsection/search/start', {roadid : roadid, start : start, end : end}, function(rs) {
        if (rs.status) {
            var data = rs.data;
            $('.section_start_ul').html('');
            var ul = '';
            for (var i = 0; i < data.length; i++) {
                ul += "<li><a class='daolqd_select' _id=" + data[i]._id + " val=" + data[i].daolqd + ">" + data[i].daolqd + "</a></li>";
            }
            if (data.length >= 1) {
                $('.section_start_ul').append(ul);
                $('.section_start_ul').attr('style', 'display:block');
            }
        }
    });
});
$('body').on('click', '.daolqd_select', function() {
    var _id = $(this).attr('_id');
    var val = $(this).attr('val');
    $('#section_start').attr('daolqdId', _id);
    $('#section_start').val(val);
    $('.section_start_ul').attr('style', 'display:none');
    if ($('#section_end').attr('daolzdId')) {
        $('.btn-search-section').attr('disabled', false);
    }
});

$('body').on('keyup', '#section_end', function(event) {
    $('.btn-search-section').attr('disabled', true);

    var start = $('#section_start').attr('daolqdId');
    var end = $('#section_end').val();
    var roadid = $('#section_start').attr('roadid');
    if (!end) {
        $('.section_end_ul').html('');
        $('.section_end_ul').attr('style', 'display:none');
    }
    $.post('/roadsection/search/end', {roadid : roadid, start : start, end : end}, function(rs) {
        if (rs.status) {
            var data = rs.data;
            $('.section_end_ul').html('');
            var ul = '';
            for (var i = 0; i < data.length; i++) {
                ul += "<li><a class='daolzd_select' _id=" + data[i]._id + " val=" + data[i].daolzd + ">" + data[i].daolzd + "</a></li>";
            }
            if (data.length >= 1) {
                $('.section_end_ul').append(ul);
                $('.section_end_ul').attr('style', 'display:block');
            }
        }
    });
});
$('body').on('click', '.daolzd_select', function() {
    var _id = $(this).attr('_id');
    var val = $(this).attr('val');
    $('#section_end').attr('daolzdId', _id);
    $('#section_end').val(val);
    $('.section_end_ul').attr('style', 'display:none');
    if ($('#section_start').attr('daolqdId')) {
        $('.btn-search-section').attr('disabled', false);
    }
});

// 获取要显示病害的路段id
$('.btn-search-section').on('click', function() {
    $('.tabtoggle').addClass('text-active').removeClass('text-primary');
    $('.watchroaddis,.watchdis,.watchlocationdis').removeClass('text-active').addClass('text-primary');
    $('#untreateddis').prop('checked',true).addClass('select');
    $('#treateddis').prop('checked',true).addClass('select');
    var daolqdId = $('#section_start').attr('daolqdId');
    var daolzdId = $('#section_end').attr('daolzdId');
    var roadid = $('#section_start').attr('roadid');
    if (daolqdId && daolzdId) {
        $.post("/roadsection/search/startend", {roadid: roadid, daolqdId: daolqdId, daolzdId: daolzdId}, function(rs) {
            if (rs.status) {
                var ids = rs.ids;
                $('.timeline-container, .addon-container,.timeline-items').addClass('hide').removeClass('showitem searchdis');
                for (var i = 0; i < ids.length; i++) {
                    $('.dis_' + ids[i]).removeClass('hide').addClass('showitem searchdis');
                    $('.dis_' + ids[i]).parents('.timeline-container').removeClass('hide').addClass('showitem searchdis');
                    $('.dis_' + ids[i]).parents('.addon-container').removeClass('hide').addClass('showitem searchdis');                
                }
                setdisattr('#untreateddis','#treateddis','timeline-items.searchdis');
            }
        });
    }
});

//清除查询
function clearsearch(){
    $('#section_end,#section_start').val('');
    $('.btn-search-section').attr('disabled',true);
}
