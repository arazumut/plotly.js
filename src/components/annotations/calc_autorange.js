'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var Axes = require('../../plots/cartesian/axes');
var draw = require('./draw').draw;

// calcAutorange fonksiyonunu dışa aktar
module.exports = function calcAutorange(gd) {
    var fullLayout = gd._fullLayout;
    var annotationList = Lib.filterVisible(fullLayout.annotations);

    if (annotationList.length && gd._fullData.length) {
        return Lib.syncOrAsync([draw, annAutorange], gd);
    }
};

// annAutorange fonksiyonu
function annAutorange(gd) {
    var fullLayout = gd._fullLayout;

    // Her bir anotasyon için sınır kutularını bul
    Lib.filterVisible(fullLayout.annotations).forEach(function(ann) {
        var xa = Axes.getFromId(gd, ann.xref);
        var ya = Axes.getFromId(gd, ann.yref);
        var xRefType = Axes.getRefType(ann.xref);
        var yRefType = Axes.getRefType(ann.yref);

        ann._extremes = {};
        if (xRefType === 'range') hesaplaEksenGenislemesi(ann, xa);
        if (yRefType === 'range') hesaplaEksenGenislemesi(ann, ya);
    });
}

// hesaplaEksenGenislemesi fonksiyonu
function hesaplaEksenGenislemesi(ann, ax) {
    var axId = ax._id;
    var harf = axId.charAt(0);
    var pos = ann[harf];
    var apos = ann['a' + harf];
    var ref = ann[harf + 'ref'];
    var aref = ann['a' + harf + 'ref'];
    var padplus = ann['_' + harf + 'padplus'];
    var padminus = ann['_' + harf + 'padminus'];
    var kayma = {x: 1, y: -1}[harf] * ann[harf + 'shift'];
    var okBasiBoyutu = 3 * ann.arrowsize * ann.arrowwidth || 0;
    var okBasiArtı = okBasiBoyutu + kayma;
    var okBasiEksi = okBasiBoyutu - kayma;
    var baslangicOkBasiBoyutu = 3 * ann.startarrowsize * ann.arrowwidth || 0;
    var baslangicOkBasiArtı = baslangicOkBasiBoyutu + kayma;
    var baslangicOkBasiEksi = baslangicOkBasiBoyutu - kayma;
    var sınırlar;

    if (aref === ref) {
        // Ok başı için genişlet (ok başı ile yastıklı)
        var okBasiSınırları = Axes.findExtremes(ax, [ax.r2c(pos)], {
            ppadplus: okBasiArtı,
            ppadminus: okBasiEksi
        });
        // Metin kutusu için tekrar genişlet (metin kutusu ile yastıklı)
        var metinSınırları = Axes.findExtremes(ax, [ax.r2c(apos)], {
            ppadplus: Math.max(padplus, baslangicOkBasiArtı),
            ppadminus: Math.max(padminus, baslangicOkBasiEksi)
        });
        sınırlar = {
            min: [okBasiSınırları.min[0], metinSınırları.min[0]],
            max: [okBasiSınırları.max[0], metinSınırları.max[0]]
        };
    } else {
        baslangicOkBasiArtı = apos ? baslangicOkBasiArtı + apos : baslangicOkBasiArtı;
        baslangicOkBasiEksi = apos ? baslangicOkBasiEksi - apos : baslangicOkBasiEksi;
        sınırlar = Axes.findExtremes(ax, [ax.r2c(pos)], {
            ppadplus: Math.max(padplus, okBasiArtı, baslangicOkBasiArtı),
            ppadminus: Math.max(padminus, okBasiEksi, baslangicOkBasiEksi)
        });
    }

    ann._extremes[axId] = sınırlar;
}
