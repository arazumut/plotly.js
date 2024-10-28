'use strict';

// Gerekli modülleri içe aktarıyoruz
var colorScaleAttrs = require('../../components/colorscale/attributes');
var hovertemplateAttrs = require('../../plots/template_attributes').hovertemplateAttrs;
var baseAttrs = require('../../plots/attributes');
var scatterMapAttrs = require('../scattermap/attributes');

var extendFlat = require('../../lib/extend').extendFlat;

/*
 * - https://docs.map.com/help/tutorials/make-a-heatmap-with-mapbox-gl-js/
 * - https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/
 * - https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers-heatmap
 * - https://blog.map.com/introducing-heatmaps-in-mapbox-gl-js-71355ada9e6c
 *
 * Dikkat Edilmesi Gerekenler:
 * - https://github.com/mapbox/mapbox-gl-js/issues/6463
 * - https://github.com/mapbox/mapbox-gl-js/issues/6112
 */

/*
 *
 * Matematiksel terimlerle, Map GL ısı haritaları iki değişkenli (2D) çekirdek yoğunluk
 * tahmini ile Gauss çekirdeği kullanır. Bu, her veri noktasının etrafında bir
 * "etki" alanına sahip olduğu anlamına gelir (çekirdek olarak adlandırılır) ve
 * etki değeri (yoğunluk olarak adlandırdığımız) noktadan uzaklaştıkça azalır.
 * Tüm noktaların yoğunluk değerlerini ekranın her pikselinde toplarsak,
 * birleştirilmiş bir yoğunluk değeri elde ederiz ve bunu bir ısı haritası rengine eşleriz.
 *
 */

module.exports = extendFlat({
    lon: scatterMapAttrs.lon,
    lat: scatterMapAttrs.lat,

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
            'Değeri artırmak, yoğunluk haritası izini daha pürüzsüz hale getirir, ancak daha az ayrıntılı olur.'
        ].join(' ')
    },

    below: {
        valType: 'string',
        editType: 'plot',
        description: [
            'Yoğunluk haritası izinin, belirtilen ID\'ye sahip katmanın',
            'öncesine yerleştirilip yerleştirilmeyeceğini belirler.',
            'Varsayılan olarak, yoğunluk haritası izleri ilk sembol',
            'katmanının altına yerleştirilir.',
            'Eğer boş bırakılırsa,',
            'katman mevcut tüm katmanların üzerine yerleştirilir.'
        ].join(' ')
    },

    text: scatterMapAttrs.text,
    hovertext: scatterMapAttrs.hovertext,

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
