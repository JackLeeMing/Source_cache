window.urlMap = {};

/********************method : get************************/

urlMap.bridgeCard = '/manage/bridge/template/bridgecard';
//{label=...}
urlMap.option = '/manage/bridge/option';
urlMap.wuxiPostcode = '/manage/area/citycode';
urlMap.tree = '/manage/bridge/tree';

//{type=0} gover, {type=1} company
urlMap.company = '/manage/company/list';
urlMap.partList = '/manage/bridgepart/list';
urlMap.bciIds = '/manage/bridge/ids';

//arg =  {bridgeid: bridgeid, start: start.getTime()/1000, end: end.getTime()/1000}
urlMap.xunjianTask = '/calendar/xunjian/task';
urlMap.bridgeXunjianCollect = '/company/bridge/xunjian/collect';
urlMap.userGroup = '/manage/user/group';
urlMap.messageCount = '/manage/message/count';

//arg : {type:...}
urlMap.bridgeAreaCount = '/manage/bridge/area/count';
urlMap.manageBridgeBciStatis = '/manage/bridge/bci/statis';
urlMap.bridgeXunjianStatis = '/manage/bridge/xunjian/statis';
urlMap.bridgeXunjianMonth = '/manage/bridge/xunjian/month';
//{ufrom:...}
// page": {
//         "end": 1,
//         "page_num": 1,
//         "allcount": 3,
//         "start": 1,
//         "page_index": 1,
//         "page_size": 10
//     },				
// if   page_num == page_index   代表没有更多的消息记录了
urlMap.messageHistory = '/manage/message/history';
urlMap.messageContact = '/manage/message/contact';
//"""数据备份"""
// args:
//    type: bridgeinfo
//            bridgexunjian
//            bridgetask
urlMap.systemDataExport = '/manage/system/data/export';
//数据备份删除
//arg : backupid
urlMap.systemDataDel = '/manage/system/data/del';
//数据还原
//arg : backupid
urlMap.systemDataImport = '/manage/system/data/import';
// """数据备份列表"""
// type: bridgeinfo
//         bridgexunjian
//         bridgetask
urlMap.systemDataList = '/manage/system/data/list';
urlMap.userUrl = '/manage/user/urls';
//arg {citycode:...}
urlMap.areaStatis = '/manage/area/statis';

/********************method : post************************/

//arg : {bridgeid: bridgeid}
urlMap.bridgeOne = '/company/bridge/one';

//{postcode:100000,...}
urlMap.map = '/manage/bridge/map';

//arg : companyid
//{ _id:'...', username:'...'}
urlMap.companyUserList = '/company/user/list';

//{company_type:,time_type: ,content_type: }
urlMap.manageBridgeStatis = '/manage/bridge/statis';

urlMap.bridgeCount = '/manage/bridge/count';

urlMap.userCount = '/manage/user/count';

urlMap.diseaseCount = '/manage/disease/count';
