'use strict';

// Gerekli modülleri dahil et
var Axes = require('../../plots/cartesian/axes');
var attributes = require('./attributes');
var fillText = require('../../lib').fillText;

// hoverPoints fonksiyonunu dışa aktar
module.exports = function hoverPoints(pointData, xval, yval) {
    var cd = pointData.cd;
    var trace = cd[0].trace;
    var geo = pointData.subplot;

    var pt, i, j, isInside;

    var xy = [xval, yval];
    var altXy = [xval + 360, yval];

    // Verilen x ve y değerlerine göre nokta bul
    for(i = 0; i < cd.length; i++) {
        pt = cd[i];
        isInside = false;

        if(pt._polygons) {
            for(j = 0; j < pt._polygons.length; j++) {
                if(pt._polygons[j].contains(xy)) {
                    isInside = !isInside;
                }
                // Antimeridyen'i geçen poligonlar için xval [-180, 180] aralığında
                if(pt._polygons[j].contains(altXy)) {
                    isInside = !isInside;
                }
            }

            if(isInside) break;
        }
    }

    if(!isInside || !pt) return;

    // Nokta verilerini güncelle
    pointData.x0 = pointData.x1 = pointData.xa.c2p(pt.ct);
    pointData.y0 = pointData.y1 = pointData.ya.c2p(pt.ct);

    pointData.index = pt.index;
    pointData.location = pt.loc;
    pointData.z = pt.z;
    pointData.zLabel = Axes.tickText(geo.mockAxis, geo.mockAxis.c2l(pt.z), 'hover').text;
    pointData.hovertemplate = pt.hovertemplate;

    // Hover bilgilerini oluştur
    makeHoverInfo(pointData, trace, pt);

    return [pointData];
};

// Hover bilgilerini oluşturma fonksiyonu
function makeHoverInfo(pointData, trace, pt) {
    if(trace.hovertemplate) return;

    var hoverinfo = pt.hi || trace.hoverinfo;
    var loc = String(pt.loc);

    var parts = (hoverinfo === 'all') ?
        attributes.hoverinfo.flags :
        hoverinfo.split('+');

    var hasName = (parts.indexOf('name') !== -1);
    var hasLocation = (parts.indexOf('location') !== -1);
    var hasZ = (parts.indexOf('z') !== -1);
    var hasText = (parts.indexOf('text') !== -1);
    var hasIdAsNameLabel = !hasName && hasLocation;

    var text = [];

    if(hasIdAsNameLabel) {
        pointData.nameOverride = loc;
    } else {
        if(hasName) pointData.nameOverride = trace.name;
        if(hasLocation) text.push(loc);
    }

    if(hasZ) {
        text.push(pointData.zLabel);
    }
    if(hasText) {
        fillText(pt, trace, text);
    }

    pointData.extraText = text.join('<br>');
}
