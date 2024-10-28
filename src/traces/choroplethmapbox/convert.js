'use strict';

// Gerekli modülleri dahil et
var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var Colorscale = require('../../components/colorscale');
var Drawing = require('../../components/drawing');

var makeBlank = require('../../lib/geojson_utils').makeBlank;
var geoUtils = require('../../lib/geo_location_utils');

/* NOT:
 *
 * GeoJSON dosyalarını "kendimiz" alıyoruz (mapbox.prototype.fetchMapData sırasında)
 * ve bunlar `PlotlyGeoAssets` adlı global bir nesnede saklanıyor (topojson dosyaları `geo` alt grafiklerinde olduğu gibi).
 *
 * Mapbox, geojson kaynakları olarak URL'lerin kullanılmasına izin veriyor, ancak
 * özellik `id`'si sayı olmayan özellikleri filtrelemeye izin vermiyor (daha fazla bilgi için:
 * https://github.com/mapbox/mapbox-gl-js/issues/8088).
 */

function dönüştür(calcTrace) {
    var iz = calcTrace[0].trace;
    var görünür = iz.visible === true && iz._length !== 0;

    var dolgu = {
        layout: {visibility: 'none'},
        paint: {}
    };

    var çizgi = {
        layout: {visibility: 'none'},
        paint: {}
    };

    var seçenekler = iz._opts = {
        fill: dolgu,
        line: çizgi,
        geojson: makeBlank()
    };

    if(!görünür) return seçenekler;

    var özellikler = geoUtils.extractTraceFeature(calcTrace);

    if(!özellikler) return seçenekler;

    var renkSkalasıFonksiyonu = Colorscale.makeColorScaleFuncFromTrace(iz);
    var işaretçi = iz.marker;
    var işaretçiÇizgisi = işaretçi.line || {};

    var opaklıkFonksiyonu;
    if(Lib.isArrayOrTypedArray(işaretçi.opacity)) {
        opaklıkFonksiyonu = function(d) {
            var mo = d.mo;
            return isNumeric(mo) ? +Lib.constrain(mo, 0, 1) : 0;
        };
    }

    var çizgiRengiFonksiyonu;
    if(Lib.isArrayOrTypedArray(işaretçiÇizgisi.color)) {
        çizgiRengiFonksiyonu = function(d) { return d.mlc; };
    }

    var çizgiGenişliğiFonksiyonu;
    if(Lib.isArrayOrTypedArray(işaretçiÇizgisi.width)) {
        çizgiGenişliğiFonksiyonu = function(d) { return d.mlw; };
    }

    for(var i = 0; i < calcTrace.length; i++) {
        var cdi = calcTrace[i];
        var fOut = cdi.fOut;

        if(fOut) {
            var özellikler = fOut.properties;
            özellikler.fc = renkSkalasıFonksiyonu(cdi.z);
            if(opaklıkFonksiyonu) özellikler.mo = opaklıkFonksiyonu(cdi);
            if(çizgiRengiFonksiyonu) özellikler.mlc = çizgiRengiFonksiyonu(cdi);
            if(çizgiGenişliğiFonksiyonu) özellikler.mlw = çizgiGenişliğiFonksiyonu(cdi);
            cdi.ct = özellikler.ct;
            cdi._polygons = geoUtils.feature2polygons(fOut);
        }
    }

    var opaklıkAyarı = opaklıkFonksiyonu ?
        {type: 'identity', property: 'mo'} :
        işaretçi.opacity;

    Lib.extendFlat(dolgu.paint, {
        'fill-color': {type: 'identity', property: 'fc'},
        'fill-opacity': opaklıkAyarı
    });

    Lib.extendFlat(çizgi.paint, {
        'line-color': çizgiRengiFonksiyonu ?
            {type: 'identity', property: 'mlc'} :
            işaretçiÇizgisi.color,
        'line-width': çizgiGenişliğiFonksiyonu ?
            {type: 'identity', property: 'mlw'} :
            işaretçiÇizgisi.width,
        'line-opacity': opaklıkAyarı
    });

    dolgu.layout.visibility = 'visible';
    çizgi.layout.visibility = 'visible';

    seçenekler.geojson = {type: 'FeatureCollection', features: özellikler};

    seçiliDönüştür(calcTrace);

    return seçenekler;
}

function seçiliDönüştür(calcTrace) {
    var iz = calcTrace[0].trace;
    var seçenekler = iz._opts;
    var opaklıkAyarı;

    if(iz.selectedpoints) {
        var fonksiyonlar = Drawing.makeSelectedPointStyleFns(iz);

        for(var i = 0; i < calcTrace.length; i++) {
            var cdi = calcTrace[i];
            if(cdi.fOut) {
                cdi.fOut.properties.mo2 = fonksiyonlar.selectedOpacityFn(cdi);
            }
        }

        opaklıkAyarı = {type: 'identity', property: 'mo2'};
    } else {
        opaklıkAyarı = Lib.isArrayOrTypedArray(iz.marker.opacity) ?
            {type: 'identity', property: 'mo'} :
            iz.marker.opacity;
    }

    Lib.extendFlat(seçenekler.fill.paint, {'fill-opacity': opaklıkAyarı});
    Lib.extendFlat(seçenekler.line.paint, {'line-opacity': opaklıkAyarı});

    return seçenekler;
}

module.exports = {
    dönüştür: dönüştür,
    seçiliDönüştür: seçiliDönüştür
};
