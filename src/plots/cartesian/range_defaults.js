'use strict';

var handleAutorangeOptionsDefaults = require('./autorange_options_defaults');

module.exports = function handleRangeDefaults(containerIn, containerOut, coerce, options) {
    var axTemplate = containerOut._template || {};
    var axType = containerOut.type || axTemplate.type || '-';

    coerce('minallowed');
    coerce('maxallowed');

    var range = coerce('range');
    if(!range) {
        var insiderange;
        if(!options.noInsiderange && axType !== 'log') {
            insiderange = coerce('insiderange');

            // Gelecekte kısmi insiderange'leri destekleyebiliriz
            // Şu an için kapsam dışı
            if(insiderange && (
                    insiderange[0] === null ||
                    insiderange[1] === null
            )) {
                containerOut.insiderange = false;
                insiderange = undefined;
            }

            if(insiderange) range = coerce('range', insiderange);
        }
    }

    var autorangeDflt = containerOut.getAutorangeDflt(range, options);
    var autorange = coerce('autorange', autorangeDflt);

    var shouldAutorange;

    // Aralığı doğrula ve geçersiz kısmi aralıklar için otomatik aralığı true olarak ayarla
    if(range && (
        (range[0] === null && range[1] === null) ||
        ((range[0] === null || range[1] === null) && (autorange === 'reversed' || autorange === true)) ||
        (range[0] !== null && (autorange === 'min' || autorange === 'max reversed')) ||
        (range[1] !== null && (autorange === 'max' || autorange === 'min reversed'))
    )) {
        range = undefined;
        delete containerOut.range;
        containerOut.autorange = true;
        shouldAutorange = true;
    }

    if(!shouldAutorange) {
        autorangeDflt = containerOut.getAutorangeDflt(range, options);
        autorange = coerce('autorange', autorangeDflt);
    }

    if(autorange) {
        handleAutorangeOptionsDefaults(coerce, autorange, range);
        if(axType === 'linear' || axType === '-') coerce('rangemode');
    }

    containerOut.cleanRange();
};
