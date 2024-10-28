'use strict';

// Gerekli modülleri dahil et
var isNumeric = require('fast-isnumeric');
var BADNUM = require('../../constants/numerical').BADNUM;

var colorscaleCalc = require('../../components/colorscale/calc');
var arraysToCalcdata = require('../scatter/arrays_to_calcdata');
var calcSelection = require('../scatter/calc_selection');

// Boş olmayan bir string olup olmadığını kontrol eden fonksiyon
function isNonBlankString(v) {
    return v && typeof v === 'string';
}

// Hesaplama fonksiyonunu dışa aktar
module.exports = function calc(gd, trace) {
    var len = trace._length;
    var calcTrace = new Array(len);

    var isValidLoc;

    // geojson varsa, konumun geçerli olup olmadığını kontrol eden fonksiyon
    if(trace.geojson) {
        isValidLoc = function(v) { return isNonBlankString(v) || isNumeric(v); };
    } else {
        isValidLoc = isNonBlankString;
    }

    // Her bir veri noktası için hesaplama yap
    for(var i = 0; i < len; i++) {
        var calcPt = calcTrace[i] = {};
        var loc = trace.locations[i];
        var z = trace.z[i];

        // Geçerli konum ve z değeri varsa, hesaplama noktasına ekle
        if(isValidLoc(loc) && isNumeric(z)) {
            calcPt.loc = loc;
            calcPt.z = z;
        } else {
            calcPt.loc = null;
            calcPt.z = BADNUM;
        }

        calcPt.index = i;
    }

    // Hesaplama verilerini diziye dönüştür
    arraysToCalcdata(calcTrace, trace);
    // Renk skalası hesaplaması yap
    colorscaleCalc(gd, trace, {
        vals: trace.z,
        containerStr: '',
        cLetter: 'z'
    });
    // Seçim hesaplaması yap
    calcSelection(calcTrace, trace);

    return calcTrace;
};
