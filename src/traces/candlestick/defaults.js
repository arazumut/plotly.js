'use strict';

// Gerekli modülleri dahil et
var Lib = require('../../lib');
var Color = require('../../components/color');
var handleOHLC = require('../ohlc/ohlc_defaults');
var handlePeriodDefaults = require('../scatter/period_defaults');
var attributes = require('./attributes');

// Varsayılan değerleri sağlama fonksiyonu
module.exports = function varsayilanDegerleriSagla(traceIn, traceOut, varsayilanRenk, layout) {
    // Koerce fonksiyonu, bir özelliği varsayılan değeriyle birlikte zorlar
    function koerce(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // OHLC verilerini işleme
    var uzunluk = handleOHLC(traceIn, traceOut, koerce, layout);
    if(!uzunluk) {
        traceOut.visible = false;
        return;
    }

    // Periyot varsayılanlarını işleme
    handlePeriodDefaults(traceIn, traceOut, layout, koerce, {x: true});
    koerce('xhoverformat');
    koerce('yhoverformat');

    // Çizgi genişliğini zorla
    koerce('line.width');

    // Artan ve azalan yönleri işleme
    yonuIsle(traceIn, traceOut, koerce, 'increasing');
    yonuIsle(traceIn, traceOut, koerce, 'decreasing');

    // Metin ve hover metinlerini zorla
    koerce('text');
    koerce('hovertext');
    koerce('whiskerwidth');

    // Range slider isteğini layout'a ekle
    layout._requestRangeslider[traceOut.xaxis] = true;
    koerce('zorder');
};

// Yönü işleme fonksiyonu
function yonuIsle(traceIn, traceOut, koerce, yon) {
    var cizgiRengi = koerce(yon + '.line.color');
    koerce(yon + '.line.width', traceOut.line.width);
    koerce(yon + '.fillcolor', Color.addOpacity(cizgiRengi, 0.5));
}
