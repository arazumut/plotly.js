'use strict';

var isNumeric = require('fast-isnumeric');

var KOTUNUM = require('../constants/numerical').BADNUM;

// hız için önceden derle
var COP = /^['"%,$#\s']+|[, ]|['"%,$#\s']+$/g;

/**
 * cleanNumber: yaygın baştaki ve sondaki gereksiz karakterleri kaldırır
 * Her zaman ya bir sayı ya da KOTUNUM döner.
 */
module.exports = function temizSayi(v) {
    if(typeof v === 'string') {
        v = v.replace(COP, '');
    }

    if(isNumeric(v)) return Number(v);

    return KOTUNUM;
};
