'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var colorscaleDefaults = require('../../components/colorscale/defaults');
var attributes = require('./attributes');

// Varsayılan değerleri sağlamak için fonksiyon
module.exports = function supplyDefaults(traceIn, traceOut, defaultColor, layout) {
    // Koerce fonksiyonu, bir özelliği varsayılan değeriyle birlikte zorlar
    function coerce(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // Longitude ve latitude değerlerini zorla
    var lon = coerce('lon') || [];
    var lat = coerce('lat') || [];

    // Longitude ve latitude uzunluklarının minimumunu al
    var len = Math.min(lon.length, lat.length);
    if(!len) {
        traceOut.visible = false; // Eğer uzunluk yoksa görünürlüğü false yap
        return;
    }

    traceOut._length = len; // Uzunluğu ayarla

    // Diğer özellikleri zorla
    coerce('z');
    coerce('radius');
    coerce('below');

    coerce('text');
    coerce('hovertext');
    coerce('hovertemplate');

    // Renk skalası varsayılanlarını zorla
    colorscaleDefaults(traceIn, traceOut, layout, coerce, {prefix: '', cLetter: 'z'});
};
