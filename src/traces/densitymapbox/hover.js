'use strict';

// Gerekli modülleri dahil et
var Axes = require('../../plots/cartesian/axes');
var scatterMapboxHoverPoints = require('../scattermapbox/hover').hoverPoints;
var getExtraText = require('../scattermapbox/hover').getExtraText;

// hoverPoints fonksiyonunu dışa aktar
module.exports = function hoverPoints(pointData, xval, yval) {
    // scatterMapboxHoverPoints fonksiyonunu çağır ve sonuçları pts değişkenine ata
    var pts = scatterMapboxHoverPoints(pointData, xval, yval);
    if(!pts) return;

    // Yeni nokta verisini pts[0] olarak ata
    var newPointData = pts[0];
    var cd = newPointData.cd;
    var trace = cd[0].trace;
    var di = cd[newPointData.index];

    // Fx.hover'ın rengi seçmesine izin ver
    delete newPointData.color;

    // Eğer di içinde 'z' varsa
    if('z' in di) {
        var ax = newPointData.subplot.mockAxis;
        newPointData.z = di.z;
        newPointData.zLabel = Axes.tickText(ax, ax.c2l(di.z), 'hover').text;
    }

    // Ekstra metni al ve newPointData.extraText olarak ata
    newPointData.extraText = getExtraText(trace, di, cd[0].t.labels);

    // newPointData'yı bir dizi olarak döndür
    return [newPointData];
};
