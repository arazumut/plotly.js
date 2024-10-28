'use strict';

// Gerekli modülleri dahil et
var isNumeric = require('fast-isnumeric');
var isArrayOrTypedArray = require('../../lib').isArrayOrTypedArray;
var BADNUM = require('../../constants/numerical').BADNUM;
var colorscaleCalc = require('../../components/colorscale/calc');
var _ = require('../../lib')._;

// Hesaplama fonksiyonunu dışa aktar
module.exports = function hesapla(gd, iz) {
    var uzunluk = iz._length;
    var hesapIz = new Array(uzunluk);
    var z = iz.z;
    var zVarMi = isArrayOrTypedArray(z) && z.length;

    for(var i = 0; i < uzunluk; i++) {
        var cdi = hesapIz[i] = {};

        var boylam = iz.lon[i];
        var enlem = iz.lat[i];

        cdi.lonlat = isNumeric(boylam) && isNumeric(enlem) ?
            [+boylam, +enlem] :
            [BADNUM, BADNUM];

        if(zVarMi) {
            var zi = z[i];
            cdi.z = isNumeric(zi) ? zi : BADNUM;
        }
    }

    colorscaleCalc(gd, iz, {
        vals: zVarMi ? z : [0, 1],
        containerStr: '',
        cLetter: 'z'
    });

    if(uzunluk) {
        hesapIz[0].t = {
            etiketler: {
                enlem: _(gd, 'enlem:') + ' ',
                boylam: _(gd, 'boylam:') + ' '
            }
        };
    }

    return hesapIz;
};
