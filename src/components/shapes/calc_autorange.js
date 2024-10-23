'use strict';

var Lib = require('../../lib');
var Axes = require('../../plots/cartesian/axes');

var constants = require('./constants');
var helpers = require('./helpers');

module.exports = function otomatikAralikHesapla(gd) {
    var tamYerlesim = gd._fullLayout;
    var sekilListesi = Lib.filterVisible(tamYerlesim.shapes);

    if(!sekilListesi.length || !gd._fullData.length) return;

    for(var i = 0; i < sekilListesi.length; i++) {
        var sekil = sekilListesi[i];
        sekil._extremes = {};

        var eksen; var sınırlar;
        var xRefTipi = Axes.getRefType(sekil.xref);
        var yRefTipi = Axes.getRefType(sekil.yref);

        // kağıt ve eksen alanı referanslı şekiller otomatik aralığı etkilemez
        if(sekil.xref !== 'paper' && xRefTipi !== 'domain') {
            eksen = Axes.getFromId(gd, sekil.xref);

            sınırlar = sekilSınırları(eksen, sekil, constants.paramIsX);
            if(sınırlar) {
                sekil._extremes[eksen._id] = Axes.findExtremes(eksen, sınırlar, xDolguSeçenekleriHesapla(sekil));
            }
        }

        if(sekil.yref !== 'paper' && yRefTipi !== 'domain') {
            eksen = Axes.getFromId(gd, sekil.yref);

            sınırlar = sekilSınırları(eksen, sekil, constants.paramIsY);
            if(sınırlar) {
                sekil._extremes[eksen._id] = Axes.findExtremes(eksen, sınırlar, yDolguSeçenekleriHesapla(sekil));
            }
        }
    }
};

function xDolguSeçenekleriHesapla(sekil) {
    return dolguSeçenekleriHesapla(sekil.line.width, sekil.xsizemode, sekil.x0, sekil.x1, sekil.path, false);
}

function yDolguSeçenekleriHesapla(sekil) {
    return dolguSeçenekleriHesapla(sekil.line.width, sekil.ysizemode, sekil.y0, sekil.y1, sekil.path, true);
}

function dolguSeçenekleriHesapla(cizgiGenisligi, boyutModu, v0, v1, yol, yEkseniMi) {
    var ppad = cizgiGenisligi / 2;
    var eksenYonuTers = yEkseniMi;

    if(boyutModu === 'pixel') {
        var koordinatlar = yol ?
            helpers.extractPathCoords(yol, yEkseniMi ? constants.paramIsY : constants.paramIsX) :
            [v0, v1];
        var maxDeger = Lib.aggNums(Math.max, null, koordinatlar);
        var minDeger = Lib.aggNums(Math.min, null, koordinatlar);
        var onceDolgu = minDeger < 0 ? Math.abs(minDeger) + ppad : ppad;
        var sonraDolgu = maxDeger > 0 ? maxDeger + ppad : ppad;

        return {
            ppad: ppad,
            ppadplus: eksenYonuTers ? onceDolgu : sonraDolgu,
            ppadminus: eksenYonuTers ? sonraDolgu : onceDolgu
        };
    } else {
        return {ppad: ppad};
    }
}

function sekilSınırları(eksen, sekil, kullanilacakParametreler) {
    var boyut = eksen._id.charAt(0) === 'x' ? 'x' : 'y';
    var kategoriMi = eksen.type === 'category' || eksen.type === 'multicategory';
    var v0;
    var v1;
    var baslangicKaydirma = 0;
    var bitisKaydirma = 0;

    var degerDonustur = kategoriMi ? eksen.r2c : eksen.d2c;

    var boyutModuOlcek = sekil[boyut + 'sizemode'] === 'scaled';
    if(boyutModuOlcek) {
        v0 = sekil[boyut + '0'];
        v1 = sekil[boyut + '1'];
        if(kategoriMi) {
            baslangicKaydirma = sekil[boyut + '0shift'];
            bitisKaydirma = sekil[boyut + '1shift'];
        }
    } else {
        v0 = sekil[boyut + 'anchor'];
        v1 = sekil[boyut + 'anchor'];
    }

    if(v0 !== undefined) return [degerDonustur(v0) + baslangicKaydirma, degerDonustur(v1) + bitisKaydirma];
    if(!sekil.path) return;

    var min = Infinity;
    var max = -Infinity;
    var segmentler = sekil.path.match(constants.segmentRE);
    var i;
    var segment;
    var cizilenParam;
    var parametreler;
    var deger;

    if(eksen.type === 'date') degerDonustur = helpers.decodeDate(degerDonustur);

    for(i = 0; i < segmentler.length; i++) {
        segment = segmentler[i];
        cizilenParam = kullanilacakParametreler[segment.charAt(0)].drawn;
        if(cizilenParam === undefined) continue;

        parametreler = segmentler[i].substr(1).match(constants.paramRE);
        if(!parametreler || parametreler.length < cizilenParam) continue;

        deger = degerDonustur(parametreler[cizilenParam]);
        if(deger < min) min = deger;
        if(deger > max) max = deger;
    }
    if(max >= min) return [min, max];
}
