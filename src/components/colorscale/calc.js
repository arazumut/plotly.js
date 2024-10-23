'use strict';

var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var extractOpts = require('./helpers').extractOpts;

module.exports = function hesapla(gd, iz, ayarlar) {
    var tamYerlesim = gd._fullLayout;
    var degerler = ayarlar.degerler;
    var konteynerStr = ayarlar.konteynerStr;

    var konteyner = konteynerStr ?
        Lib.nestedProperty(iz, konteynerStr).get() :
        iz;

    var cAyarlar = extractOpts(konteyner);
    var otomatik = cAyarlar.otomatik !== false;
    var min = cAyarlar.min;
    var max = cAyarlar.max;
    var orta = cAyarlar.orta;

    var minDeger = function() { return Lib.aggNums(Math.min, null, degerler); };
    var maxDeger = function() { return Lib.aggNums(Math.max, null, degerler); };

    if(min === undefined) {
        min = minDeger();
    } else if(otomatik) {
        if(konteyner._renkEksen && isNumeric(min)) {
            min = Math.min(min, minDeger());
        } else {
            min = minDeger();
        }
    }

    if(max === undefined) {
        max = maxDeger();
    } else if(otomatik) {
        if(konteyner._renkEksen && isNumeric(max)) {
            max = Math.max(max, maxDeger());
        } else {
            max = maxDeger();
        }
    }

    if(otomatik && orta !== undefined) {
        if(max - orta > orta - min) {
            min = orta - (max - orta);
        } else if(max - orta < orta - min) {
            max = orta + (orta - min);
        }
    }

    if(min === max) {
        min -= 0.5;
        max += 0.5;
    }

    cAyarlar._sync('min', min);
    cAyarlar._sync('max', max);

    if(cAyarlar.otomatikRenkSkalasi) {
        var renkSkalasi;
        if(min * max < 0) renkSkalasi = tamYerlesim.renkSkalasi.diverging;
        else if(min >= 0) renkSkalasi = tamYerlesim.renkSkalasi.sequential;
        else renkSkalasi = tamYerlesim.renkSkalasi.sequentialminus;
        cAyarlar._sync('renkSkalasi', renkSkalasi);
    }
};
