'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var handleXYDefaults = require('./xy_defaults');
var handleABDefaults = require('./ab_defaults');
var attributes = require('./attributes');
var colorAttrs = require('../../components/color/attributes');

// Varsayılan değerleri sağlayan fonksiyon
module.exports = function varsayilanDegerleriSagla(traceIn, traceOut, dfltColor, fullLayout) {
    // Koerce fonksiyonu, bir özelliği varsayılan değeriyle birlikte zorlar
    function koerce(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // Klip yolu kimliğini ayarla
    traceOut._clipPathId = 'clip' + traceOut.uid + 'carpet';

    // Varsayılan rengi ayarla
    var varsayilanRenk = koerce('color', colorAttrs.defaultLine);
    Lib.coerceFont(koerce, 'font', fullLayout.font);

    // Halı özelliğini zorla
    koerce('carpet');

    // AB varsayılanlarını işle
    handleABDefaults(traceIn, traceOut, fullLayout, koerce, varsayilanRenk);

    // A veya B ekseni yoksa görünürlüğü false yap
    if(!traceOut.a || !traceOut.b) {
        traceOut.visible = false;
        return;
    }

    // A ekseni uzunluğu 3'ten küçükse yumuşatma değerini sıfırla
    if(traceOut.a.length < 3) {
        traceOut.aaxis.smoothing = 0;
    }

    // B ekseni uzunluğu 3'ten küçükse yumuşatma değerini sıfırla
    if(traceOut.b.length < 3) {
        traceOut.baxis.smoothing = 0;
    }

    // X/Y varsayılanlarını işle
    var gecerliVeri = handleXYDefaults(traceIn, traceOut, koerce);
    if(!gecerliVeri) {
        traceOut.visible = false;
    }

    // Hileli eğim varsa zorla
    if(traceOut._cheater) {
        koerce('cheaterslope');
    }
    // Z sırasını zorla
    koerce('zorder');
};
