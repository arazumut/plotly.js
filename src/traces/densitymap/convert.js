'use strict';

// Gerekli modülleri dahil et
var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var Color = require('../../components/color');
var Colorscale = require('../../components/colorscale');

var BADNUM = require('../../constants/numerical').BADNUM;
var makeBlank = require('../../lib/geojson_utils').makeBlank;

// convert fonksiyonunu dışa aktar
module.exports = function convert(calcTrace) {
    var trace = calcTrace[0].trace;
    var isVisible = (trace.visible === true && trace._length !== 0);

    var heatmap = {
        layout: {visibility: 'none'},
        paint: {}
    };

    var opts = trace._opts = {
        heatmap: heatmap,
        geojson: makeBlank()
    };

    // Görünür değilse veya yer tutucuysa erken dönüş yap
    if(!isVisible) return opts;

    var features = [];
    var i;

    var z = trace.z;
    var radius = trace.radius;
    var hasZ = Lib.isArrayOrTypedArray(z) && z.length;
    var hasArrayRadius = Lib.isArrayOrTypedArray(radius);

    for(i = 0; i < calcTrace.length; i++) {
        var cdi = calcTrace[i];
        var lonlat = cdi.lonlat;

        if(lonlat[0] !== BADNUM) {
            var props = {};

            if(hasZ) {
                var zi = cdi.z;
                props.z = zi !== BADNUM ? zi : 0;
            }
            if(hasArrayRadius) {
                props.r = (isNumeric(radius[i]) && radius[i] > 0) ? +radius[i] : 0;
            }

            features.push({
                type: 'Feature',
                geometry: {type: 'Point', coordinates: lonlat},
                properties: props
            });
        }
    }

    var cOpts = Colorscale.extractOpts(trace);
    var scl = cOpts.reversescale ?
        Colorscale.flipScale(cOpts.colorscale) :
        cOpts.colorscale;

    // İlk renk skalası adımına alfa kanalı ekle.
    // Eğer eklemezsek, tüm haritayı renklendirmiş oluruz.
    // Bkz: https://maplibre.org/maplibre-gl-js/docs/examples/heatmap-layer/
    var scl01 = scl[0][1];
    var color0 = Color.opacity(scl01) < 1 ? scl01 : Color.addOpacity(scl01, 0);

    var heatmapColor = [
        'interpolate', ['linear'],
        ['heatmap-density'],
        0, color0
    ];
    for(i = 1; i < scl.length; i++) {
        heatmapColor.push(scl[i][0], scl[i][1]);
    }

    // Bu "ağırlıklar" [0, 1] aralığında olmalı, bunu şu şekilde yapabiliriz:
    // - burada olduğu gibi bir map-gl ifadesi kullanarak
    // - veya, özellik döngüsünde 'z' özelliğini ölçekleyerek
    var zExp = [
        'interpolate', ['linear'],
        ['get', 'z'],
        cOpts.min, 0,
        cOpts.max, 1
    ];

    Lib.extendFlat(opts.heatmap.paint, {
        'heatmap-weight': hasZ ? zExp : 1 / (cOpts.max - cOpts.min),

        'heatmap-color': heatmapColor,

        'heatmap-radius': hasArrayRadius ?
            {type: 'identity', property: 'r'} :
            trace.radius,

        'heatmap-opacity': trace.opacity
    });

    opts.geojson = {type: 'FeatureCollection', features: features};
    opts.heatmap.layout.visibility = 'visible';

    return opts;
};
