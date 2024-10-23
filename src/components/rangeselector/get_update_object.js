'use strict';

var d3Time = require('d3-time');
var titleCase = require('../../lib').titleCase;

module.exports = function güncellemeObjesiAl(axisYerleşimi, butonYerleşimi) {
    var eksenAdi = axisYerleşimi._name;
    var güncelleme = {};

    if(butonYerleşimi.adım === 'hepsi') {
        güncelleme[eksenAdi + '.autorange'] = true;
    } else {
        var xAraligi = xAraligiAl(axisYerleşimi, butonYerleşimi);

        güncelleme[eksenAdi + '.range[0]'] = xAraligi[0];
        güncelleme[eksenAdi + '.range[1]'] = xAraligi[1];
    }

    return güncelleme;
};

function xAraligiAl(axisYerleşimi, butonYerleşimi) {
    var mevcutAralik = axisYerleşimi.range;
    var temel = new Date(axisYerleşimi.r2l(mevcutAralik[1]));
    var adim = butonYerleşimi.adım;

    var utcAdim = d3Time['utc' + titleCase(adim)];

    var sayi = butonYerleşimi.sayi;
    var aralik0;

    switch(butonYerleşimi.adimModu) {
        case 'geri':
            aralik0 = axisYerleşimi.l2r(+utcAdim.offset(temel, -sayi));
            break;

        case 'bugüne':
            var temel2 = utcAdim.offset(temel, -sayi);

            aralik0 = axisYerleşimi.l2r(+utcAdim.ceil(temel2));
            break;
    }

    var aralik1 = mevcutAralik[1];

    return [aralik0, aralik1];
}
