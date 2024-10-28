'use strict';

// Gerekli kütüphaneleri dahil et
var Lib = require('../../lib');

var handleXYZDefaults = require('../heatmap/xyz_defaults');
var handlePeriodDefaults = require('../scatter/period_defaults');
var handleConstraintDefaults = require('./constraint_defaults');
var handleContoursDefaults = require('./contours_defaults');
var handleStyleDefaults = require('./style_defaults');
var handleHeatmapLabelDefaults = require('../heatmap/label_defaults');
var attributes = require('./attributes');

// Varsayılan değerleri sağlamak için kullanılan fonksiyon
module.exports = function varsayilanDegerleriSagla(traceIn, traceOut, varsayilanRenk, layout) {
    // Koerce fonksiyonu, bir özelliği varsayılan değeriyle birlikte zorlar
    function koerce(attr, dflt) {
        return Lib.coerce(traceIn, traceOut, attributes, attr, dflt);
    }

    // Koerce2 fonksiyonu, bir özelliği zorlar
    function koerce2(attr) {
        return Lib.coerce2(traceIn, traceOut, attributes, attr);
    }

    // XYZ varsayılanlarını işle
    var uzunluk = handleXYZDefaults(traceIn, traceOut, koerce, layout);
    if(!uzunluk) {
        traceOut.visible = false;
        return;
    }

    // Dönem varsayılanlarını işle
    handlePeriodDefaults(traceIn, traceOut, layout, koerce);
    koerce('xhoverformat');
    koerce('yhoverformat');

    koerce('text');
    koerce('hovertext');
    koerce('hoverongaps');
    koerce('hovertemplate');

    // Kontur türünü kontrol et
    var isConstraint = (koerce('contours.type') === 'constraint');
    koerce('connectgaps', Lib.isArray1D(traceOut.z));

    if(isConstraint) {
        handleConstraintDefaults(traceIn, traceOut, koerce, layout, varsayilanRenk);
    } else {
        handleContoursDefaults(traceIn, traceOut, koerce, koerce2);
        handleStyleDefaults(traceIn, traceOut, koerce, layout);
    }

    // Eğer kontur renklendirmesi 'heatmap' ise, heatmap etiket varsayılanlarını işle
    if(
        traceOut.contours &&
        traceOut.contours.coloring === 'heatmap'
    ) {
        handleHeatmapLabelDefaults(koerce, layout);
    }
    koerce('zorder');
};
