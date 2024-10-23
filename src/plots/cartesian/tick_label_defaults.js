'use strict';

var Lib = require('../../lib');
var contrast = require('../../components/color').contrast;
var layoutAttributes = require('./layout_attributes');
var getShowAttrDflt = require('./show_dflt');
var handleArrayContainerDefaults = require('../array_container_defaults');

module.exports = function handleTickLabelDefaults(containerIn, containerOut, coerce, axType, options) {
    if(!options) options = {};

    var etiketTakmaAdı = coerce('labelalias');
    if(!Lib.isPlainObject(etiketTakmaAdı)) delete containerOut.labelalias;

    var gösterimÖzelliğiVarsayılanı = getShowAttrDflt(containerIn);

    var etiketleriGöster = coerce('showticklabels');
    if(etiketleriGöster) {
        if(!options.noTicklabelshift) {
            coerce('ticklabelshift');
        }
        if(!options.noTicklabelstandoff) {
            coerce('ticklabelstandoff');
        }
        var yazıTipi = options.font || {};
        var konteynerRengi = containerOut.color;
        var pozisyon = containerOut.ticklabelposition || '';
        var varsayılanYazıRengi = pozisyon.indexOf('inside') !== -1 ?
            contrast(options.bgColor) :
            (konteynerRengi && konteynerRengi !== layoutAttributes.color.dflt) ?
            konteynerRengi : yazıTipi.color;

        Lib.coerceFont(coerce, 'tickfont', yazıTipi, { overrideDflt: {
            color: varsayılanYazıRengi
        }});

        if(
            !options.noTicklabelstep &&
            axType !== 'multicategory' &&
            axType !== 'log'
        ) {
            coerce('ticklabelstep');
        }

        if(!options.noAng) {
            var etiketAçısı = coerce('tickangle');
            if(!options.noAutotickangles && etiketAçısı === 'auto') {
                coerce('autotickangles');
            }
        }

        if(axType !== 'category') {
            var etiketFormatı = coerce('tickformat');

            handleArrayContainerDefaults(containerIn, containerOut, {
                name: 'tickformatstops',
                inclusionAttr: 'enabled',
                handleItemDefaults: tickformatstopDefaults
            });
            if(!containerOut.tickformatstops.length) {
                delete containerOut.tickformatstops;
            }

            if(!options.noExp && !etiketFormatı && axType !== 'date') {
                coerce('showexponent', gösterimÖzelliğiVarsayılanı);
                coerce('exponentformat');
                coerce('minexponent');
                coerce('separatethousands');
            }
        }
    }
};

function tickformatstopDefaults(valueIn, valueOut) {
    function coerce(attr, dflt) {
        return Lib.coerce(valueIn, valueOut, layoutAttributes.tickformatstops, attr, dflt);
    }

    var etkin = coerce('enabled');
    if(etkin) {
        coerce('dtickrange');
        coerce('value');
    }
}
