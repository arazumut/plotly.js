'use strict';

// Gerekli modülleri dahil et
var isNumeric = require('fast-isnumeric');
var Registry = require('../../registry');
var Lib = require('../../lib');
var Template = require('../../plot_api/plot_template');
var attributes = require('./attributes');

// Modülü dışa aktar
module.exports = function(traceIn, traceOut, defaultColor, opts) {
    var objName = 'error_' + opts.axis;
    var containerOut = Template.newContainer(traceOut, objName);
    var containerIn = traceIn[objName] || {};

    // Değer atama fonksiyonu
    function coerce(attr, dflt) {
        return Lib.coerce(containerIn, containerOut, attributes, attr, dflt);
    }

    // Hata çubuklarının olup olmadığını kontrol et
    var hasErrorBars = (
        containerIn.array !== undefined ||
        containerIn.value !== undefined ||
        containerIn.type === 'sqrt'
    );

    // Görünürlüğü belirle
    var visible = coerce('visible', hasErrorBars);
    if(visible === false) return;

    // Hata çubuğu türünü belirle
    var type = coerce('type', 'array' in containerIn ? 'data' : 'percent');
    var symmetric = true;

    if(type !== 'sqrt') {
        symmetric = coerce('symmetric',
            !((type === 'data' ? 'arrayminus' : 'valueminus') in containerIn));
    }

    // Türüne göre gerekli değerleri ata
    if(type === 'data') {
        coerce('array');
        coerce('traceref');
        if(!symmetric) {
            coerce('arrayminus');
            coerce('tracerefminus');
        }
    } else if(type === 'percent' || type === 'constant') {
        coerce('value');
        if(!symmetric) coerce('valueminus');
    }

    // Stil miras alma işlemi
    var copyAttr = 'copy_' + opts.inherit + 'style';
    if(opts.inherit) {
        var inheritObj = traceOut['error_' + opts.inherit];
        if((inheritObj || {}).visible) {
            coerce(copyAttr, !(containerIn.color ||
                               isNumeric(containerIn.thickness) ||
                               isNumeric(containerIn.width)));
        }
    }
    if(!opts.inherit || !containerOut[copyAttr]) {
        coerce('color', defaultColor);
        coerce('thickness');
        coerce('width', Registry.traceIs(traceOut, 'gl3d') ? 0 : 4);
    }
};
