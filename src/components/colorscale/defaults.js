'use strict';

var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var hasColorbar = require('../colorbar/has_colorbar');
var colorbarDefaults = require('../colorbar/defaults');

var isValidScale = require('./scales').isValid;
var traceIs = require('../../registry').traceIs;

function npMaybe(parentCont, prefix) {
    var containerStr = prefix.slice(0, prefix.length - 1);
    return prefix ?
        Lib.nestedProperty(parentCont, containerStr).get() || {} :
        parentCont;
}

/**
 * Renk ölçeği / renk çubuğu varsayılan işleyici
 *
 * @param {object} parentContIn : kullanıcı (giriş) üst konteyneri (örneğin, iz veya düzen renk ekseni nesnesi)
 * @param {object} parentContOut : tam üst konteyner
 * @param {object} layout : (tam) düzen nesnesi
 * @param {fn} coerce : Lib.coerce sarmalayıcı
 * @param {object} opts :
 * - prefix {string} : üst kökten renk ölçeği konteynerine kadar olan öznitelik dizesi öneki
 * - cLetter {string} : 'c' veya 'z' renk harfi
 */
module.exports = function colorScaleDefaults(parentContIn, parentContOut, layout, coerce, opts) {
    var prefix = opts.prefix;
    var cLetter = opts.cLetter;
    var inTrace = '_module' in parentContOut;
    var containerIn = npMaybe(parentContIn, prefix);
    var containerOut = npMaybe(parentContOut, prefix);
    var template = npMaybe(parentContOut._template || {}, prefix) || {};

    // colorScaleDefaults sarmalayıcı, geçersiz renk eksenlerine bağlı konteynerlerin renk ölçeği
    // özniteliklerini sıfırlamamız gerektiğinde çağrılır
    var thisFn = function() {
        delete parentContIn.coloraxis;
        delete parentContOut.coloraxis;
        return colorScaleDefaults(parentContIn, parentContOut, layout, coerce, opts);
    };

    if(inTrace) {
        var colorAxes = layout._colorAxes || {};
        var colorAx = coerce(prefix + 'coloraxis');

        if(colorAx) {
            var colorbarVisuals = (
                traceIs(parentContOut, 'contour') &&
                Lib.nestedProperty(parentContOut, 'contours.coloring').get()
            ) || 'heatmap';

            var stash = colorAxes[colorAx];

            if(stash) {
                stash[2].push(thisFn);

                if(stash[0] !== colorbarVisuals) {
                    stash[0] = false;
                    Lib.warn([
                        'Renk ekseni yoksayılıyor:', colorAx, 'ayar',
                        'çünkü uyumsuz renk ölçeklerine bağlı.'
                    ].join(' '));
                }
            } else {
                // stash:
                // - renk çubuğu görsel 'türü'
                // - Colorbar.draw'da yardımcı olacak renk çubuğu seçenekleri
                // - colorScaleDefaults sarmalayıcı işlevlerinin listesi
                colorAxes[colorAx] = [colorbarVisuals, parentContOut, [thisFn]];
            }
            return;
        }
    }

    var minIn = containerIn[cLetter + 'min'];
    var maxIn = containerIn[cLetter + 'max'];
    var validMinMax = isNumeric(minIn) && isNumeric(maxIn) && (minIn < maxIn);
    var auto = coerce(prefix + cLetter + 'auto', !validMinMax);

    if(auto) {
        coerce(prefix + cLetter + 'mid');
    } else {
        coerce(prefix + cLetter + 'min');
        coerce(prefix + cLetter + 'max');
    }

    // hem iz durumu (autocolorscale varsayılan olarak false) hem de
    // işaretleyici ve işaretleyici çizgisi durumu (autocolorscale varsayılan olarak true) için geçerlidir
    var sclIn = containerIn.colorscale;
    var sclTemplate = template.colorscale;
    var autoColorscaleDflt;
    if(sclIn !== undefined) autoColorscaleDflt = !isValidScale(sclIn);
    if(sclTemplate !== undefined) autoColorscaleDflt = !isValidScale(sclTemplate);
    coerce(prefix + 'autocolorscale', autoColorscaleDflt);

    coerce(prefix + 'colorscale');
    coerce(prefix + 'reversescale');

    if(prefix !== 'marker.line.') {
        // hem iz durumu için geçerlidir (varsayılan attributes'de listelenmiştir) hem de
        // işaretleyici durumu için (varsayılan hasColorbar tarafından belirlenir)
        var showScaleDflt;
        if(prefix && inTrace) showScaleDflt = hasColorbar(containerIn);

        var showScale = coerce(prefix + 'showscale', showScaleDflt);
        if(showScale) {
            if(prefix && template) containerOut._template = template;
            colorbarDefaults(containerIn, containerOut, layout);
        }
    }
};
