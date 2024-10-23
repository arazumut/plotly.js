'use strict';

// Gerekli modülleri dahil et
var d3 = require('@plotly/d3');
var tinycolor = require('tinycolor2');
var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var Color = require('../color');

var isValidScale = require('./scales').isValid;

// Renk skalası olup olmadığını kontrol eden fonksiyon
function hasColorscale(trace, containerStr, colorKey) {
    var container = containerStr ?
        Lib.nestedProperty(trace, containerStr).get() || {} :
        trace;

    var color = container[colorKey || 'color'];
    if(color && color._inputArray) color = color._inputArray;

    var isArrayWithOneNumber = false;
    if(Lib.isArrayOrTypedArray(color)) {
        for(var i = 0; i < color.length; i++) {
            if(isNumeric(color[i])) {
                isArrayWithOneNumber = true;
                break;
            }
        }
    }

    return (
        Lib.isPlainObject(container) && (
            isArrayWithOneNumber ||
            container.showscale === true ||
            (isNumeric(container.cmin) && isNumeric(container.cmax)) ||
            isValidScale(container.colorscale) ||
            Lib.isPlainObject(container.colorbar)
        )
    );
}

var constantAttrs = ['showscale', 'autocolorscale', 'colorscale', 'reversescale', 'colorbar'];
var letterAttrs = ['min', 'max', 'mid', 'auto'];

/**
 * 'c' / 'z', iz / renk ekseni renk skalası seçeneklerini çıkar
 *
 * Not: v3'te tüm z* ile başlayanları c* ile değiştirmek iyi olurdu
 *
 * @param {object} cont : öznitelik konteyneri
 * @return {object}:
 *  - min: cmin veya zmin
 *  - max: cmax veya zmax
 *  - mid: cmid veya zmid
 *  - auto: cauto veya zauto
 *  - *scale: *scale öznitelikleri
 *  - colorbar: colorbar
 *  - _sync: öznitelik ve alt çizgi ikilisini senkronize eden fonksiyon (min/max hesaplanırken kullanışlı)
 */
function extractOpts(cont) {
    var colorAx = cont._colorAx;
    var cont2 = colorAx ? colorAx : cont;
    var out = {};
    var cLetter;
    var i, k;

    for(i = 0; i < constantAttrs.length; i++) {
        k = constantAttrs[i];
        out[k] = cont2[k];
    }

    if(colorAx) {
        cLetter = 'c';
        for(i = 0; i < letterAttrs.length; i++) {
            k = letterAttrs[i];
            out[k] = cont2['c' + k];
        }
    } else {
        var k2;
        for(i = 0; i < letterAttrs.length; i++) {
            k = letterAttrs[i];
            k2 = 'c' + k;
            if(k2 in cont2) {
                out[k] = cont2[k2];
                continue;
            }
            k2 = 'z' + k;
            if(k2 in cont2) {
                out[k] = cont2[k2];
            }
        }
        cLetter = k2.charAt(0);
    }

    out._sync = function(k, v) {
        var k2 = letterAttrs.indexOf(k) !== -1 ? cLetter + k : k;
        cont2[k2] = cont2['_' + k2] = v;
    };

    return out;
}

/**
 * Renk skalasını sayısal domain ve renk aralığına çıkar.
 *
 * @param {object} cont renk skalası konteyneri (örneğin iz, marker)
 *  - colorscale {dizi}
 *  - cmin/zmin {sayı}
 *  - cmax/zmax {sayı}
 *  - reversescale {boolean}
 *
 * @return {object}
 *  - domain {dizi}
 *  - range {dizi}
 */
function extractScale(cont) {
    var cOpts = extractOpts(cont);
    var cmin = cOpts.min;
    var cmax = cOpts.max;

    var scl = cOpts.reversescale ?
        flipScale(cOpts.colorscale) :
        cOpts.colorscale;

    var N = scl.length;
    var domain = new Array(N);
    var range = new Array(N);

    for(var i = 0; i < N; i++) {
        var si = scl[i];
        domain[i] = cmin + si[0] * (cmax - cmin);
        range[i] = si[1];
    }

    return {domain: domain, range: range};
}

// Renk skalasını tersine çeviren fonksiyon
function flipScale(scl) {
    var N = scl.length;
    var sclNew = new Array(N);

    for(var i = N - 1, j = 0; i >= 0; i--, j++) {
        var si = scl[i];
        sclNew[j] = [1 - si[0], si[1]];
    }
    return sclNew;
}

/**
 * Genel renk skalası fonksiyon üreticisi.
 *
 * @param {object} specs Colorscale.extractScale'in çıktısı veya önceden hesaplanmış domain, range.
 *  - domain {dizi}
 *  - range {dizi}
 *
 * @param {object} opts
 *  - noNumericCheck {boolean} true ise, skala fonksiyonu sayısal kontrolleri atlar
 *  - returnArray {boolean} true ise, skala fonksiyonu renk dizeleri yerine 4 öğeli dizi döner
 *
 * @return {function}
 */
function makeColorScaleFunc(specs, opts) {
    opts = opts || {};

    var domain = specs.domain;
    var range = specs.range;
    var N = range.length;
    var _range = new Array(N);

    for(var i = 0; i < N; i++) {
        var rgba = tinycolor(range[i]).toRgb();
        _range[i] = [rgba.r, rgba.g, rgba.b, rgba.a];
    }

    var _sclFunc = d3.scale.linear()
        .domain(domain)
        .range(_range)
        .clamp(true);

    var noNumericCheck = opts.noNumericCheck;
    var returnArray = opts.returnArray;
    var sclFunc;

    if(noNumericCheck && returnArray) {
        sclFunc = _sclFunc;
    } else if(noNumericCheck) {
        sclFunc = function(v) {
            return colorArray2rbga(_sclFunc(v));
        };
    } else if(returnArray) {
        sclFunc = function(v) {
            if(isNumeric(v)) return _sclFunc(v);
            else if(tinycolor(v).isValid()) return v;
            else return Color.defaultLine;
        };
    } else {
        sclFunc = function(v) {
            if(isNumeric(v)) return colorArray2rbga(_sclFunc(v));
            else if(tinycolor(v).isValid()) return v;
            else return Color.defaultLine;
        };
    }

    // colorbar çizimi d3 skala kapanışında domain ve range'e bakar
    sclFunc.domain = _sclFunc.domain;
    sclFunc.range = function() { return range; };

    return sclFunc;
}

// İzden renk skalası fonksiyonu oluşturan fonksiyon
function makeColorScaleFuncFromTrace(trace, opts) {
    return makeColorScaleFunc(extractScale(trace), opts);
}

// Renk dizisini rgba dizgesine dönüştüren fonksiyon
function colorArray2rbga(colorArray) {
    var colorObj = {
        r: colorArray[0],
        g: colorArray[1],
        b: colorArray[2],
        a: colorArray[3]
    };

    return tinycolor(colorObj).toRgbString();
}

// Modülleri dışa aktar
module.exports = {
    hasColorscale: hasColorscale,
    extractOpts: extractOpts,
    extractScale: extractScale,
    flipScale: flipScale,
    makeColorScaleFunc: makeColorScaleFunc,
    makeColorScaleFuncFromTrace: makeColorScaleFuncFromTrace
};
