'use strict';

var Lib = require('../../lib');

// Alt grafik veya x ve y eksenlerini arar
// splom durumunu ele almaz
exports.getSubplot = function(trace) {
    return trace.subplot || (trace.xaxis + trace.yaxis) || trace.geo;
};

// Verilen alt grafik listesinde iz var mı?
// splom durumunu ele alır
exports.isTraceInSubplots = function(trace, subplots) {
    if(trace.type === 'splom') {
        var xaxes = trace.xaxes || [];
        var yaxes = trace.yaxes || [];
        for(var i = 0; i < xaxes.length; i++) {
            for(var j = 0; j < yaxes.length; j++) {
                if(subplots.indexOf(xaxes[i] + yaxes[j]) !== -1) {
                    return true;
                }
            }
        }
        return false;
    }

    return subplots.indexOf(exports.getSubplot(trace)) !== -1;
};

// Tüm ilgili eksenleri eşlemek için kolaylık fonksiyonları
exports.flat = function(subplots, v) {
    var out = new Array(subplots.length);
    for(var i = 0; i < subplots.length; i++) {
        out[i] = v;
    }
    return out;
};

exports.p2c = function(axArray, v) {
    var out = new Array(axArray.length);
    for(var i = 0; i < axArray.length; i++) {
        out[i] = axArray[i].p2c(v);
    }
    return out;
};

exports.getDistanceFunction = function(mode, dx, dy, dxy) {
    if(mode === 'closest') return dxy || exports.quadrature(dx, dy);
    return mode.charAt(0) === 'x' ? dx : dy;
};

exports.getClosest = function(cd, distfn, pointData) {
    // Zaten bir nokta numaramız var mı? (dizi modu sadece)
    if(pointData.index !== false) {
        if(pointData.index >= 0 && pointData.index < cd.length) {
            pointData.distance = 0;
        } else pointData.index = false;
    } else {
        // Mesafe fonksiyonunu her veri noktasına uygula
        for(var i = 0; i < cd.length; i++) {
            var newDistance = distfn(cd[i]);
            if(newDistance <= pointData.distance) {
                pointData.index = i;
                pointData.distance = newDistance;
            }
        }
    }
    return pointData;
};

/*
 * Alanlar üzerindeki hover efektleri için pseudo-mesafe fonksiyonu: bölge içinde
 * mesafe sonludur (`passVal`), dışında sonsuzdur.
 *
 * @param {number} v0: mevcut pozisyon ile sol kenar arasındaki imzalı fark
 * @param {number} v1: mevcut pozisyon ile sağ kenar arasındaki imzalı fark
 * @param {number} passVal: başarı durumunda döndürülecek değer
 */
exports.inbox = function(v0, v1, passVal) {
    return (v0 * v1 < 0 || v0 === 0) ? passVal : Infinity;
};

exports.quadrature = function(dx, dy) {
    return function(di) {
        var x = dx(di);
        var y = dy(di);
        return Math.sqrt(x * x + y * y);
    };
};

/** Hover ve seçim için olay veri noktası nesnesini doldurur.
 *  _module.eventData varsa çağırır.
 *
 * Not: 'index' girdisi veri dizisi indeksine karşılık gelir
 *  oysa 'number' onun dönüşüm sonrası versiyonudur.
 *
 * Hovered/seçilen nokta birden fazla giriş noktasına karşılık geliyorsa
 * (örneğin histogram ve dönüştürülmüş izler için), 'pointNumbers` ve 'pointIndices'
 * olay verilerine dahil edilir.
 *
 * @param {object} pt
 * @param {object} trace
 * @param {object} cd
 * @return {object}
 */
exports.makeEventData = function(pt, trace, cd) {
    // hover 'index' kullanır, seçim 'pointNumber' kullanır
    var pointNumber = 'index' in pt ? pt.index : pt.pointNumber;

    var out = {
        data: trace._input,
        fullData: trace,
        curveNumber: trace.index,
        pointNumber: pointNumber
    };

    if(trace._indexToPoints) {
        var pointIndices = trace._indexToPoints[pointNumber];

        if(pointIndices.length === 1) {
            out.pointIndex = pointIndices[0];
        } else {
            out.pointIndices = pointIndices;
        }
    } else {
        out.pointIndex = pointNumber;
    }

    if(trace._module.eventData) {
        out = trace._module.eventData(out, pt, trace, cd, pointNumber);
    } else {
        if('xVal' in pt) out.x = pt.xVal;
        else if('x' in pt) out.x = pt.x;

        if('yVal' in pt) out.y = pt.yVal;
        else if('y' in pt) out.y = pt.y;

        if(pt.xa) out.xaxis = pt.xa;
        if(pt.ya) out.yaxis = pt.ya;
        if(pt.zLabelVal !== undefined) out.z = pt.zLabelVal;
    }

    exports.appendArrayPointValue(out, trace, pointNumber);

    return out;
};

/** Verilen nokta numarasına karşılık gelen dizi öznitelikleri içindeki değerleri ekler
 *
 * @param {object} pointData : nokta veri nesnesi (burada değiştirilir)
 * @param {object} trace : tam iz nesnesi
 * @param {number|Array(number)} pointNumber : nokta numarası. 2D dizilere girmek için
 *     [satır, sütun] uzunluğunda bir dizi olabilir
 */
exports.appendArrayPointValue = function(pointData, trace, pointNumber) {
    var arrayAttrs = trace._arrayAttrs;

    if(!arrayAttrs) {
        return;
    }

    for(var i = 0; i < arrayAttrs.length; i++) {
        var astr = arrayAttrs[i];
        var key = getPointKey(astr);

        if(pointData[key] === undefined) {
            var val = Lib.nestedProperty(trace, astr).get();
            var pointVal = getPointData(val, pointNumber);

            if(pointVal !== undefined) pointData[key] = pointVal;
        }
    }
};

/**
 * Verilen nokta numarası dizisine karşılık gelen dizi öznitelikleri içindeki değerleri ekler
 * Nokta verileri birden fazla giriş noktasından kaynaklanan (veya potansiyel olarak kaynaklanan)
 * bir çizim varlığını referans aldığında kullanılır
 *
 * @param {object} pointData : nokta veri nesnesi (burada değiştirilir)
 * @param {object} trace : tam iz nesnesi
 * @param {Array(number)|Array(Array(number))} pointNumbers : Nokta numaraları dizisi.
 *     Dizideki her giriş, 2D dizilere girmek için [satır, sütun] uzunluğunda bir dizi olabilir
 */
exports.appendArrayMultiPointValues = function(pointData, trace, pointNumbers) {
    var arrayAttrs = trace._arrayAttrs;

    if(!arrayAttrs) {
        return;
    }

    for(var i = 0; i < arrayAttrs.length; i++) {
        var astr = arrayAttrs[i];
        var key = getPointKey(astr);

        if(pointData[key] === undefined) {
            var val = Lib.nestedProperty(trace, astr).get();
            var keyVal = new Array(pointNumbers.length);

            for(var j = 0; j < pointNumbers.length; j++) {
                keyVal[j] = getPointData(val, pointNumbers[j]);
            }
            pointData[key] = keyVal;
        }
    }
};

var pointKeyMap = {
    ids: 'id',
    locations: 'location',
    labels: 'label',
    values: 'value',
    'marker.colors': 'color',
    parents: 'parent'
};

function getPointKey(astr) {
    return pointKeyMap[astr] || astr;
}

function getPointData(val, pointNumber) {
    if(Array.isArray(pointNumber)) {
        if(Array.isArray(val) && Array.isArray(val[pointNumber[0]])) {
            return val[pointNumber[0]][pointNumber[1]];
        }
    } else {
        return val[pointNumber];
    }
}

var xyHoverMode = {
    x: true,
    y: true
};

var unifiedHoverMode = {
    'x unified': true,
    'y unified': true
};

exports.isUnifiedHover = function(hovermode) {
    if(typeof hovermode !== 'string') return false;
    return !!unifiedHoverMode[hovermode];
};

exports.isXYhover = function(hovermode) {
    if(typeof hovermode !== 'string') return false;
    return !!xyHoverMode[hovermode];
};
