'use strict';

// Gerekli modülleri içe aktarma
var hovertemplateAttrs = require('../../plots/template_attributes').hovertemplateAttrs;
var scatterGeoAttrs = require('../scattergeo/attributes');
var colorScaleAttrs = require('../../components/colorscale/attributes');
var baseAttrs = require('../../plots/attributes');
var defaultLine = require('../../components/color/attributes').defaultLine;

var extendFlat = require('../../lib/extend').extendFlat;

var scatterGeoMarkerLineAttrs = scatterGeoAttrs.marker.line;

// Modülü dışa aktarma
module.exports = extendFlat({
    // Konumları ayarlama
    locations: {
        valType: 'data_array',
        editType: 'calc',
        description: [
            'Konum kimlikleri veya isimleri aracılığıyla koordinatları ayarlar.',
            '`locationmode` için daha fazla bilgiye bakın.'
        ].join(' ')
    },
    locationmode: scatterGeoAttrs.locationmode,
    z: {
        valType: 'data_array',
        editType: 'calc',
        description: 'Renk değerlerini ayarlar.'
    },
    geojson: extendFlat({}, scatterGeoAttrs.geojson, {
        description: [
            'Bu iz ile ilişkili isteğe bağlı GeoJSON verilerini ayarlar.',
            'Verilmezse, temel haritadaki özellikler kullanılır.',

            'Geçerli bir GeoJSON nesnesi veya bir URL dizesi olarak ayarlanabilir.',
            'Yalnızca *FeatureCollection* veya *Feature* türündeki GeoJSON\'ları kabul ettiğimizi unutmayın',
            '*Polygon* veya *MultiPolygon* türündeki geometrilerle.'

            // TODO topojson desteği ekle, ek 'topojsonobject' özelliği ile?
            // https://github.com/topojson/topojson-specification/blob/master/README.md
        ].join(' ')
    }),
    featureidkey: scatterGeoAttrs.featureidkey,

    text: extendFlat({}, scatterGeoAttrs.text, {
        description: 'Her konumla ilişkili metin öğelerini ayarlar.'
    }),
    hovertext: extendFlat({}, scatterGeoAttrs.hovertext, {
        description: 'Aynı `text` gibi.'
    }),
    marker: {
        line: {
            color: extendFlat({}, scatterGeoMarkerLineAttrs.color, {dflt: defaultLine}),
            width: extendFlat({}, scatterGeoMarkerLineAttrs.width, {dflt: 1}),
            editType: 'calc'
        },
        opacity: {
            valType: 'number',
            arrayOk: true,
            min: 0,
            max: 1,
            dflt: 1,
            editType: 'style',
            description: 'Konumların opaklığını ayarlar.'
        },
        editType: 'calc'
    },

    selected: {
        marker: {
            opacity: scatterGeoAttrs.selected.marker.opacity,
            editType: 'plot'
        },
        editType: 'plot'
    },
    unselected: {
        marker: {
            opacity: scatterGeoAttrs.unselected.marker.opacity,
            editType: 'plot'
        },
        editType: 'plot'
    },

    hoverinfo: extendFlat({}, baseAttrs.hoverinfo, {
        editType: 'calc',
        flags: ['location', 'z', 'text', 'name']
    }),
    hovertemplate: hovertemplateAttrs(),
    showlegend: extendFlat({}, baseAttrs.showlegend, {dflt: false})
},

    colorScaleAttrs('', {
        cLetter: 'z',
        editTypeOverride: 'calc'
    })
);
