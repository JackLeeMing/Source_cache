function searchfunc(api,start,end,alarm_code,model,code_name){
     var args={};
     args['start'] = start;
     args['end'] = end;
     args['alarm_code'] =alarm_code;
     args['model'] = model;
     args['code_name'] = code_name;
    var url = api+'?'+$.param(args);
    location.href = url;
}
//运维筛选
function searchOpfunc(api,start,end,keyword,model,code_name,event_type){
     var args={};
     args['start'] = start;
     args['end'] = end;
     args['keyword'] = keyword;
     args['model'] = model;
     args['event_type'] = event_type;
     args['code_name'] = code_name;
    var url = api+'?'+$.param(args);
    location.href = url;
}
//导出
function downOpfunc(api,start,end,keyword,model,code_name,event_type){
     var args={};
     args['start'] = start;
     args['end'] = end;
     args['keyword'] = keyword;
     args['model'] = model;
     args['event_type'] = event_type;
     var url = api+'/'+code_name+'?'+$.param(args);
     window.open(url, '_blank');
}
function downfunc(api,start,end,alarm_code,model,code_name){
     var args={};
     args['start'] = start;
     args['end'] = end;
     args['alarm_code'] =alarm_code;
     args['model'] = model;
     var url = api+'/'+code_name+'?'+$.param(args);
     window.open(url, '_blank');
}
// 报警统计筛选
function searchStatis(api,start,end,code_name){
     var args={};
     args['start'] = start;
     args['end'] = end;
     args['code_name'] = code_name;
     var url = api+'?'+$.param(args);
     location.href = url;
}

// 故障预警筛选
function alarmSearch(api,code_name,model){
     var args={};
     args['model'] = model;
     args['code_name'] = code_name;
     var url = api+'?'+$.param(args);
     location.href = url;
}
