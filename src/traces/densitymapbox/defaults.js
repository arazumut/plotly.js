'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var colorscaleDefaults = require('../../components/colorscale/defaults');
var attributes = require('./attributes');

// Varsayılan değerleri sağlamak için fonksiyon
module.exports = function varsayilanDegerleriSagla(traceIn, traceOut, varsayilanRenk, layout) {
    // Kolay erişim için yardımcı fonksiyon
    function zorla(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // Longitude ve Latitude değerlerini zorla
    var lon = zorla('lon') || [];
    var lat = zorla('lat') || [];

    // Longitude ve Latitude uzunluklarını kontrol et
    var uzunluk = Math.min(lon.length, lat.length);
    if(!uzunluk) {
        traceOut.visible = false;
        return;
    }

    traceOut._length = uzunluk;

    // Diğer gerekli değerleri zorla
    zorla('z');
    zorla('radius');
    zorla('below');

    zorla('text');
    zorla('hovertext');
    zorla('hovertemplate');

    // Renk skalası varsayılanlarını zorla
    colorscaleDefaults(traceIn, traceOut, layout, zorla, {prefix: '', cLetter: 'z'});
};
