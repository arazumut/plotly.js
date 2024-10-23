'use strict';

var Registry = require('../../registry');
var constants = require('./constants');

// Eksen isimleri (xaxis, xaxis2, vb., gd.layout öğeleri) ile eksen kimlikleri (x, x2, vb.) arasında dönüşüm yapar.
// 'xaxis' yerine sadece 'x' kullanmayı tercih ederdik, ancak API'de yerleşik olduğu için bu şekilde kaldı.
exports.id2name = function id2name(id) {
    if (typeof id !== 'string' || !id.match(constants.AX_ID_PATTERN)) return;
    var axNum = id.split(' ')[0].substr(1);
    if (axNum === '1') axNum = '';
    return id.charAt(0) + 'axis' + axNum;
};

exports.name2id = function name2id(name) {
    if (!name.match(constants.AX_NAME_PATTERN)) return;
    var axNum = name.substr(5);
    if (axNum === '1') axNum = '';
    return name.charAt(0) + axNum;
};

/*
 * Bir eksenin numarasını temizler, örneğin 'x002'->'x2', 'x0'->'x', 'x1' -> 'x', vb.
 * domainId true ise, id bir domain referansı olabilir ve öyleyse,
 * ' domain' kısmı eksen kimliği dizisinin sonunda tutulur.
 */
exports.cleanId = function cleanId(id, axLetter, domainId) {
    var domainTest = /( domain)$/.test(id);
    if (typeof id !== 'string' || !id.match(constants.AX_ID_PATTERN)) return;
    if (axLetter && id.charAt(0) !== axLetter) return;
    if (domainTest && (!domainId)) return;
    var axNum = id.split(' ')[0].substr(1).replace(/^0+/, '');
    if (axNum === '1') axNum = '';
    return id.charAt(0) + axNum + (domainTest && domainId ? ' domain' : '');
};

// Tüm eksen nesnelerini alır, listNames ile sınırlıdır
exports.list = function(gd, axLetter, only2d) {
    var fullLayout = gd._fullLayout;
    if (!fullLayout) return [];

    var idList = exports.listIds(gd, axLetter);
    var out = new Array(idList.length);
    var i;

    for (i = 0; i < idList.length; i++) {
        var idi = idList[i];
        out[i] = fullLayout[idi.charAt(0) + 'axis' + idi.substr(1)];
    }

    if (!only2d) {
        var sceneIds3D = fullLayout._subplots.gl3d || [];

        for (i = 0; i < sceneIds3D.length; i++) {
            var scene = fullLayout[sceneIds3D[i]];

            if (axLetter) out.push(scene[axLetter + 'axis']);
            else out.push(scene.xaxis, scene.yaxis, scene.zaxis);
        }
    }

    return out;
};

// Tüm eksen kimliklerini alır, harf ile sınırlı olabilir
// bu sadece 2d eksenler için anlamlıdır
exports.listIds = function(gd, axLetter) {
    var fullLayout = gd._fullLayout;
    if (!fullLayout) return [];

    var subplotLists = fullLayout._subplots;
    if (axLetter) return subplotLists[axLetter + 'axis'];
    return subplotLists.xaxis.concat(subplotLists.yaxis);
};

// 'x', 'x2' vb. kimlikten eksen nesnesi alır
// isteğe bağlı olarak, kimlik bir alt grafik olabilir (örneğin 'x2y3') ve tür x veya y'yi alır
exports.getFromId = function(gd, id, type) {
    var fullLayout = gd._fullLayout;
    // "domain" son ekini kaldır
    id = ((id === undefined) || (typeof(id) !== 'string')) ? id : id.replace(' domain', '');

    if (type === 'x') id = id.replace(/y[0-9]*/, '');
    else if (type === 'y') id = id.replace(/x[0-9]*/, '');

    return fullLayout[exports.id2name(id)];
};

// Belirtilen türden eksen nesnesini içeren izden alır
exports.getFromTrace = function(gd, fullTrace, type) {
    var fullLayout = gd._fullLayout;
    var ax = null;

    if (Registry.traceIs(fullTrace, 'gl3d')) {
        var scene = fullTrace.scene;
        if (scene.substr(0, 5) === 'scene') {
            ax = fullLayout[scene][type + 'axis'];
        }
    } else {
        ax = exports.getFromId(gd, fullTrace[type + 'axis'] || type);
    }

    return ax;
};

// x, x2, x10, y, y2, y10... sıralar
exports.idSort = function(id1, id2) {
    var letter1 = id1.charAt(0);
    var letter2 = id2.charAt(0);
    if (letter1 !== letter2) return letter1 > letter2 ? 1 : -1;
    return +(id1.substr(1) || 1) - +(id2.substr(1) || 1);
};

/*
 * Bir eksen referansı (örneğin, bir nesnenin 'xref' anahtarındaki içerik) ekstra bilgi içerebilir.
 * Sadece eksen kimliğini çıkarır.
 *
 * ar: eksen referans dizgesi
 *
 */
exports.ref2id = function(ar) {
    // Bu, ar'nin coerceRef aracılığıyla zorlandığını varsayar ve eksen kimliğini döndürüp döndürmeyeceğini belirlemek için
    // ilk harfin [xyz] ile eşleşip eşleşmediğini kontrol etme kısayolunu kullanır. Aksi takdirde false döner.
    return (/^[xyz]/.test(ar)) ? ar.split(' ')[0] : false;
};

function isFound(axId, list) {
    if (list && list.length) {
        for (var i = 0; i < list.length; i++) {
            if (list[i][axId]) return true;
        }
    }
    return false;
}

exports.isLinked = function(fullLayout, axId) {
    return (
        isFound(axId, fullLayout._axisMatchGroups) ||
        isFound(axId, fullLayout._axisConstraintGroups)
    );
};
