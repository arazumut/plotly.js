'use strict';

// Gerekli modülleri dahil etme
var colorScaleAttrs = require('../../components/colorscale/attributes');
var hovertemplateAttrs = require('../../plots/template_attributes').hovertemplateAttrs;
var baseAttrs = require('../../plots/attributes');
var scatterMapboxAttrs = require('../scattermapbox/attributes');

var extendFlat = require('../../lib/extend').extendFlat;

/*
 * - https://docs.mapbox.com/help/tutorials/make-a-heatmap-with-mapbox-gl-js/
 * - https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/
 * - https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers-heatmap
 * - https://blog.mapbox.com/introducing-heatmaps-in-mapbox-gl-js-71355ada9e6c
 *
 * Dikkat Edilmesi Gerekenler:
 * - https://github.com/mapbox/mapbox-gl-js/issues/6463
 * - https://github.com/mapbox/mapbox-gl-js/issues/6112
 */

/*
 *
 * Matematiksel terimlerle, Mapbox GL ısı haritaları, Gauss çekirdeği ile iki değişkenli (2D) bir çekirdek yoğunluk
 * tahminidir. Bu, her veri noktasının etrafında bir "etki" alanına sahip olduğu anlamına gelir (çekirdek olarak adlandırılır)
 * ve etki (yoğunluk olarak adlandırdığımız) sayısal değeri noktadan uzaklaştıkça azalır.
 * Tüm noktaların yoğunluk değerlerini ekranın her pikselinde toplarsak, birleştirilmiş bir yoğunluk değeri elde ederiz
 * ve bunu bir ısı haritası rengine eşleriz.
 *
 */

module.exports = extendFlat({
    lon: scatterMapboxAttrs.lon,
    lat: scatterMapboxAttrs.lat,

    z: {
        valType: 'data_array',
        editType: 'calc',
        description: [
            'Noktaların ağırlığını ayarlar.',
            'Örneğin, 10 değeri, aynı noktada ağırlığı 1 olan 10 noktaya eşdeğer olur.'
        ].join(' ')
    },

    radius: {
        valType: 'number',
        editType: 'plot',
        arrayOk: true,
        min: 1,
        dflt: 30,
        description: [
            'Bir `lon` / `lat` noktasının etki yarıçapını pikseller cinsinden ayarlar.',
            'Değeri artırmak densitymapbox izini daha pürüzsüz hale getirir, ancak daha az ayrıntılı olur.'
        ].join(' ')
    },

    below: {
        valType: 'string',
        editType: 'plot',
        description: [
            'Densitymapbox izinin, belirtilen ID\'ye sahip katmanın önüne mi yerleştirileceğini belirler.',
            'Varsayılan olarak, densitymapbox izleri ilk sembol türündeki katmanın altına yerleştirilir.',
            'Eğer boş bırakılırsa, katman mevcut tüm katmanların üstüne yerleştirilir.'
        ].join(' ')
    },

    text: scatterMapboxAttrs.text,
    hovertext: scatterMapboxAttrs.hovertext,

    hoverinfo: extendFlat({}, baseAttrs.hoverinfo, {
        flags: ['lon', 'lat', 'z', 'text', 'name']
    }),
    hovertemplate: hovertemplateAttrs(),
    showlegend: extendFlat({}, baseAttrs.showlegend, {dflt: false})
},
    colorScaleAttrs('', {
        cLetter: 'z',
        editTypeOverride: 'calc'
    })
);
