'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var attributes = require('./attributes');
var handleHoverLabelDefaults = require('./hoverlabel_defaults');

// Varsayılan değerleri sağlamak için bir fonksiyon tanımla
module.exports = function varsayilanDegerleriSagla(traceIn, traceOut, varsayilanRenk, yerlesim) {
    // Bir özellik için varsayılan değeri zorla
    function zorla(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // Yerleşimden hoverlabel seçeneklerini kopyala
    var secenekler = Lib.extendFlat({}, yerlesim.hoverlabel);
    if(traceOut.hovertemplate) secenekler.isimUzunlugu = -1;

    // Hoverlabel varsayılanlarını işle
    handleHoverLabelDefaults(traceIn, traceOut, zorla, secenekler);
};
