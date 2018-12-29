var SCORE_MAP = {};
// 评分函数部分
$.ajax({
    url : '/manage/road/yanghscore',
    data : {},
    cache : false,
    async : false,
    type : 'POST',
    success : function(rs) {
        SCORE_MAP = rs;
    }
});

// 车行道养护状况: data(破损面积/类别):[(12, lief), (23, suil)], lumjg(路面结构): liqlm, yearlimit(路龄): 9, area(车行道面积): 1000
function chexd_disease(data, lumjg, yearlimit, area) {
    if (!Array.isArray(data)) {
        return '所传递的数据有误!';
    }
    if (['liqlm', 'shuinlm'].indexOf(lumjg) == -1) {
        return '路面结构必须为沥青/水泥';
    }
    if (typeof yearlimit !== 'number' || (yearlimit < 1 || yearlimit > 15)) {
        return '道路年龄必须为1~15年之间';
    }
    if (typeof area !== 'number') {
        return '所传递的车行道面积必须为数值!';
    }

    var score = 0;
    for (var i = 0; i < data.length; i++) {
        score += SCORE_MAP.CHEXD_DESTROY_K[lumjg][data[i][1]] * data[i][0]
    }

    var yearfactor = 0;
    for (var i = 0; i < SCORE_MAP.CHEXD_LULXS.length; i++) {
        if (SCORE_MAP.CHEXD_LULXS[i][0] <= yearlimit && yearlimit <= SCORE_MAP.CHEXD_LULXS[i][1]) {
            yearfactor = SCORE_MAP.CHEXD_LULXS[i][2];
            break;
        }
    }
    // 车行道完好率
    var whl = (area - score * yearfactor) * 100.0 / area;
    return whl;
}
// 车行道养护状况评定等级: whl(完好率): 78, daollb(道路类别): kuaisl
function chexd_level(whl, daollb) {
    if (typeof whl !== 'number' || (whl < 0 || whl > 100)) {
        return '车行道完好率必须在0~100之间';
    }
    var data = SCORE_MAP.CHEXD_YANGH[daollb];
    if (!data) {
        return '道路类别有误!';
    }
    for (var i = 0; i < data.length; i++) {
        if (data[i][0] <= whl && whl <= data[i][1]) {
            return data[i][2];
        }
    }
    return '未评估';
}
// 人行道养护状况: data(破损面积):[12, 13], area(人行道总面积): 1000
function renxd_disease(data, area) {
    if (!Array.isArray(data)) {
        return '所传递的数据有误!';
    }
    if (typeof area !== 'number') {
        return '所传递的车行道面积必须为数值!';
    }
    var damagearea = 0;
    for (var i = 0; i < data.length; i++) {
        damagearea += data[i];
    }
    var whl = (area - damagearea) * 100.0 / area;
    return whl;
}
// 人行道养护状况评定等级
function renxd_level(whl) {
    if (typeof whl !== 'number' || (whl < 0 || whl > 100)) {
        return '人行道完好率必须在0~100之间';
    }
    for (var i = 0; i < SCORE_MAP.RENXD_YANGH.length; i++) {
        if (SCORE_MAP.RENXD_YANGH[i][0] <= whl && whl <= SCORE_MAP.RENXD_YANGH[i][1]) {
            return SCORE_MAP.RENXD_YANGH[i][2];
        }
    }
    return '未评估'
}
// 路基和排水设施养护状况: data:[(luj, buzcg, 3), (pais, yus, 4)]
function lujpais_disease(data) {
    if (!Array.isArray(data)) {
        return '所传入的数据有误!'
    }
    var score = 0;
    for (var i = 0; i < data.length; i++) {
        score += SCORE_MAP.LUJPAIS_YANGH_FACTOR[data[i][0]][data[i][1]] * data[i][2];
    }
    return 100 - score;
}
// 路基和排水设施养护状况评定等级
function lujpais_level(whl) {
    if (typeof whl !== 'number' || (whl < 0 || whl > 100)) {
        return '路基和排水设施完好率必须在0~100之间';
    }
    for (var i = 0; i < SCORE_MAP.LUJPAIS_YANGH.length; i++) {
        if (SCORE_MAP.LUJPAIS_YANGH[i][0] <= whl && whl <= SCORE_MAP.LUJPAIS_YANGH[i][1]) {
            return SCORE_MAP.LUJPAIS_YANGH[i][2];
        }
    }
    return '未评估';
}
// 其他设施养护状况: data:[(fusjgw, bianx, 3), (fusss, gongnsx, 5)]
function other_disease(data) {
    if (!Array.isArray(data)) {
        return '所传递的数据有误!';
    }
    var score = 0;
    for (var i = 0; i < data.length; i++) {
        score += SCORE_MAP.OTHER_YANGH_FACTOR[data[i][0]][data[i][1]] * data[i][2];
    }
    return 100 - score;
}
// 其他设施养护状况评定等级
function other_level(whl) {
    if (typeof whl !== 'number' || (whl < 0 || whl > 100)) {
        return '其他设施完好率必须在0~100之间';
    }
    for (var i = 0; i < SCORE_MAP.OTHER_YANGH.length; i++) {
        if (SCORE_MAP.OTHER_YANGH[i][0] <= whl && whl <= SCORE_MAP.OTHER_YANGH[i][1]) {
            return SCORE_MAP.OTHER_YANGH[i][2];
        }
    }
    return '未评估';
}

// 测试用例

var whl = chexd_disease([[12, "lief"], [23, "suil"]], "liqlm", 7, 1000);
console.log(whl); //=97.68
var level = chexd_level(whl, 'kuaisl');
if (level != '合格') console.log("error1!");

var whl = renxd_disease([12, 13], 100);
if (whl !== 75) console.log("error2!");
var level = renxd_level(whl);
if (level !== '不合格') console.log("error3!");

var whl = lujpais_disease([["luj", "buzcg", 3], ["pais", "yus", 4]]);
if (whl !== 45) console.log("error4!");
var level = lujpais_level(whl);
if (level !== '不合格') console.log("error5!");

var whl = other_disease([["fusjgw", "bianx", 3], ["fusss", "gongnsx", 5]])
if (whl !== 35) console.log("error6!");
var level = other_level(whl);
if (level !== '不合格') console.log('error7!');
