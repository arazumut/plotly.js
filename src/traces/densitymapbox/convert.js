'use strict';

var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var Color = require('../../components/color');
var Colorscale = require('../../components/colorscale');

var BADNUM = require('../../constants/numerical').BADNUM;
var makeBlank = require('../../lib/geojson_utils').makeBlank;

module.exports = function dönüştür(calcTrace) {
    var iz = calcTrace[0].trace;
    var görünür = (iz.visible === true && iz._length !== 0);

    var ısıHaritası = {
        layout: {visibility: 'none'},
        paint: {}
    };

    var seçenekler = iz._opts = {
        heatmap: ısıHaritası,
        geojson: makeBlank()
    };

    // erken dönüş, eğer görünür değilse veya yer tutucuysa
    if(!görünür) return seçenekler;

    var özellikler = [];
    var i;

    var z = iz.z;
    var yarıçap = iz.radius;
    var zVar = Lib.isArrayOrTypedArray(z) && z.length;
    var arrayYarıçapVar = Lib.isArrayOrTypedArray(yarıçap);

    for(i = 0; i < calcTrace.length; i++) {
        var cdi = calcTrace[i];
        var lonlat = cdi.lonlat;

        if(lonlat[0] !== BADNUM) {
            var özellikler = {};

            if(zVar) {
                var zi = cdi.z;
                özellikler.z = zi !== BADNUM ? zi : 0;
            }
            if(arrayYarıçapVar) {
                özellikler.r = (isNumeric(yarıçap[i]) && yarıçap[i] > 0) ? +yarıçap[i] : 0;
            }

            özellikler.push({
                type: 'Feature',
                geometry: {type: 'Point', coordinates: lonlat},
                properties: özellikler
            });
        }
    }

    var cSeçenekler = Colorscale.extractOpts(iz);
    var renkSkalası = cSeçenekler.reversescale ?
        Colorscale.flipScale(cSeçenekler.colorscale) :
        cSeçenekler.colorscale;

    // İlk renk skalası adımına alfa kanalı ekleyin.
    // Eğer eklemezsek, tüm haritayı renklendirmiş oluruz.
    // Bkz: https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/
    var renkSkalası01 = renkSkalası[0][1];
    var renk0 = Color.opacity(renkSkalası01) < 1 ? renkSkalası01 : Color.addOpacity(renkSkalası01, 0);

    var ısıHaritasıRengi = [
        'interpolate', ['linear'],
        ['heatmap-density'],
        0, renk0
    ];
    for(i = 1; i < renkSkalası.length; i++) {
        ısıHaritasıRengi.push(renkSkalası[i][0], renkSkalası[i][1]);
    }

    // Bu "ağırlıklar" [0, 1] aralığında olmalı, bunu şu şekilde yapabiliriz:
    // - burada olduğu gibi bir mapbox-gl ifadesi kullanarak
    // - veya, özellik döngüsünde 'z' özelliğini ölçekleyerek
    var zExp = [
        'interpolate', ['linear'],
        ['get', 'z'],
        cSeçenekler.min, 0,
        cSeçenekler.max, 1
    ];

    Lib.extendFlat(seçenekler.heatmap.paint, {
        'heatmap-weight': zVar ? zExp : 1 / (cSeçenekler.max - cSeçenekler.min),

        'heatmap-color': ısıHaritasıRengi,

        'heatmap-radius': arrayYarıçapVar ?
            {type: 'identity', property: 'r'} :
            iz.radius,

        'heatmap-opacity': iz.opacity
    });

    seçenekler.geojson = {type: 'FeatureCollection', features: özellikler};
    seçenekler.heatmap.layout.visibility = 'visible';

    return seçenekler;
};
