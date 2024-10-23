'use strict';

// Gerekli kütüphaneleri dahil et
var Lib = require('../../lib');
var handleRThetaDefaults = require('../scatterpolar/defaults').handleRThetaDefaults;
var handleStyleDefaults = require('../bar/style_defaults');
var attributes = require('./attributes');

// Varsayılan değerleri sağlamak için fonksiyon
module.exports = function varsayilanDegerleriSagla(traceIn, traceOut, varsayilanRenk, layout) {
    // Koerce fonksiyonu
    function koerce(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // R ve Theta varsayılanlarını işle
    var uzunluk = handleRThetaDefaults(traceIn, traceOut, layout, koerce);
    if(!uzunluk) {
        traceOut.visible = false;
        return;
    }

    // Koerce işlemleri
    koerce('thetaunit');
    koerce('base');
    koerce('offset');
    koerce('width');

    koerce('text');
    koerce('hovertext');
    koerce('hovertemplate');

    // Stil varsayılanlarını işle
    handleStyleDefaults(traceIn, traceOut, koerce, varsayilanRenk, layout);

    // Seçim işaretleyici opaklığını koerce et
    Lib.coerceSelectionMarkerOpacity(traceOut, koerce);
};
