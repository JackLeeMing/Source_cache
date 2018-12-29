var SCORE_MAP = {};
// 评分函数部分
$.ajax({
    url : '/manage/road/score',
    data : {},
    cache : false,
    async : false,
    type : 'POST',
    success : function(rs) {
        SCORE_MAP = rs;
    }
});

// 获取等级的基础函数
function baseFunc(arr, score, len) {
    if (!Array.isArray(arr)) {
        return;
    }
    len = len || arr.length;

    for (var i = 0; i < len; i++) {
        var item = arr[i];
        if (3 == item.length) {
            if (score >= item[0] && score <= item[1]) {
                return item[2];
            }
        } 
    }
}
// 获取评分区间的基础函数
function baseScoreFunc(arr, score, len) {
    if (!Array.isArray(arr)) {
        return;
    }
    len = len || arr.length;

    for (var i = 0; i < len; i++) {
        var item = arr[i];
        if (4 == item.length) {
            if (score >= item[0] && score <= item[1]) {
                return item[2] + (score - item[0]) / (item[1] - item[0]) * (item[3] - item[2]);
            }
        }
    }
}
// 综合等级评价分数/等级关联
function func_score_pqi(name, score) {
    var len = SCORE_MAP.SCORE_PQI && SCORE_MAP.SCORE_PQI[name] && SCORE_MAP.SCORE_PQI[name].length || 0;
    if (len > 0) {
        return baseFunc(SCORE_MAP.SCORE_PQI[name], score, len);
    }
}
// 路面平整度分数/等级关联
function func_score_lumpzd(name, score) {
    var len = SCORE_MAP.SCORE_LUMPZD && SCORE_MAP.SCORE_LUMPZD[name] && SCORE_MAP.SCORE_LUMPZD[name].length || 0;
    if (len > 0) {
        return baseFunc(SCORE_MAP.SCORE_LUMPZD[name], score, len);
    }
}
// 人行道平整度分数/等级关联
function func_score_renxdpzd(score) {
    var len = SCORE_MAP.SCORE_RENXDPZD && SCORE_MAP.SCORE_RENXDPZD.length || 0;
    if (len > 0) {
        return baseFunc(SCORE_MAP.SCORE_RENXDPZD, score, len);
    }
}
// 路面抗滑分数/等级关联
function func_score_lumkh(key, name, score) {
    var len = SCORE_MAP.SCORE_LUMKH && SCORE_MAP.SCORE_LUMKH[key] && SCORE_MAP.SCORE_LUMKH[key][name] && SCORE_MAP.SCORE_LUMKH[key][name].length || 0;
    if (len > 0) {
        return baseFunc(SCORE_MAP.SCORE_LUMKH[key][name], score, len);
    }
}
// 结构强度分数/等级关联
function func_score_pssi(key, name, score) {
    var len = SCORE_MAP.SCORE_PSSI && SCORE_MAP.SCORE_PSSI[key] && SCORE_MAP.SCORE_PSSI[key][name] && SCORE_MAP.SCORE_PSSI[key][name].length || 0;
    if (len > 0) {
        return baseFunc(SCORE_MAP.SCORE_PSSI[key][name], score, len);
    }
}
// 沥青路面损坏单项扣分
function func_score_liqlm(name, score) {
    var len = SCORE_MAP.SCORE_LIQLM && SCORE_MAP.SCORE_LIQLM[name] && SCORE_MAP.SCORE_LIQLM[name].length || 0;
    if (len > 0) {
        return baseScoreFunc(SCORE_MAP.SCORE_LIQLM[name], score, len);
    }
}
// 水泥路面损坏单项扣分
function func_score_shuinlm(name, score) {
    var len = SCORE_MAP.SCORE_SHUINLM && SCORE_MAP.SCORE_SHUINLM[name] && SCORE_MAP.SCORE_SHUINLM[name].length || 0;
    if (len > 0) {
        return baseScoreFunc(SCORE_MAP.SCORE_SHUINLM[name], score, len);
    }
}

// 人行道损坏单项扣分
function func_score_renxd(name, score) {
    var len = SCORE_MAP.SCORE_RENXD && SCORE_MAP.SCORE_RENXD[name] && SCORE_MAP.SCORE_RENXD[name].length || 0;
    if (len > 0) {
        return baseScoreFunc(SCORE_MAP.SCORE_RENXD[name], score, len);
    }
}

// 沥青路面/水泥路面损坏状况评价标准
function func_score_pci(name, score) {
    var len = SCORE_MAP.SCORE_PCI && SCORE_MAP.SCORE_PCI[name] && SCORE_MAP.SCORE_PCI[name].length || 0;
    if (len > 0) {
        return baseFunc(SCORE_MAP.SCORE_PCI[name], score, len);
    }
}

// 人行道损坏状况评价标准
function func_score_fci(score) {
    var len = SCORE_MAP.SCORE_FCI && SCORE_MAP.SCORE_FCI.length || 0;
    if (len > 0) {
        return baseFunc(SCORE_MAP.SCORE_FCI, score, len);
    }
}

console.log(func_score_pqi('cigl', 55));
console.log(func_score_lumpzd('zhugl', 2.1));
console.log(func_score_renxdpzd(1.9));
console.log(func_score_lumkh('BPN', 'kuaisl', 40));
console.log(func_score_pssi('sssjc', 3, 70));
console.log(func_score_liqlm('kengc', 5));
console.log(func_score_shuinlm('xiubsh', 7)); 
console.log(func_score_renxd('songdhbx', 0.03));
console.log(func_score_pci('zhugl', 72));
console.log(func_score_fci(78));
