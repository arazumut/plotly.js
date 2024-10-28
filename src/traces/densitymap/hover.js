'use strict';

// Gerekli modülleri dahil et
var Axes = require('../../plots/cartesian/axes');
var scatterMapHoverPoints = require('../scattermap/hover').hoverPoints;
var getExtraText = require('../scattermap/hover').getExtraText;

// hoverPoints fonksiyonunu dışa aktar
module.exports = function hoverPoints(pointData, xval, yval) {
    // scatterMapHoverPoints fonksiyonunu çağır ve sonuçları pts değişkenine ata
    var pts = scatterMapHoverPoints(pointData, xval, yval);
    if(!pts) return; // Eğer pts boşsa, fonksiyondan çık

    var newPointData = pts[0]; // İlk noktayı al
    var cd = newPointData.cd; // cd değişkenine ata
    var trace = cd[0].trace; // trace değişkenine ata
    var di = cd[newPointData.index]; // di değişkenine ata

    // Fx.hover'ın rengi seçmesine izin ver
    delete newPointData.color;

    // Eğer di içinde 'z' varsa
    if('z' in di) {
        var ax = newPointData.subplot.mockAxis; // mockAxis'i al
        newPointData.z = di.z; // z değerini ata
        newPointData.zLabel = Axes.tickText(ax, ax.c2l(di.z), 'hover').text; // zLabel'ı ata
    }

    // Ekstra metni al ve ata
    newPointData.extraText = getExtraText(trace, di, cd[0].t.labels);

    return [newPointData]; // Yeni noktayı döndür
};
