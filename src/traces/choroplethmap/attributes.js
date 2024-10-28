'use strict';

// Gerekli modülleri içe aktar
var choroplethAttrs = require('../choropleth/attributes');
var colorScaleAttrs = require('../../components/colorscale/attributes');
var hovertemplateAttrs = require('../../plots/template_attributes').hovertemplateAttrs;
var baseAttrs = require('../../plots/attributes');
var extendFlat = require('../../lib/extend').extendFlat;

// Modülü dışa aktar
module.exports = extendFlat({
    // Konumları ayarlar
    locations: {
        valType: 'data_array',
        editType: 'calc',
        description: [
            '*geojson* içinde bulunan özelliklerin `id` alanlarını kullanarak',
            'hangi özelliklerin çizileceğini ayarlar.'
        ].join(' ')
    },

    // Renk değerlerini ayarlar
    z: {
        valType: 'data_array',
        editType: 'calc',
        description: 'Renk değerlerini ayarlar.'
    },

    // GeoJSON verilerini ayarlar
    geojson: {
        valType: 'any',
        editType: 'calc',
        description: [
            'Bu iz ile ilişkili GeoJSON verilerini ayarlar.',
            'Geçerli bir GeoJSON nesnesi veya bir URL dizesi olarak ayarlanabilir.',
            'Sadece *FeatureCollection* veya *Feature* türündeki GeoJSON\'ları kabul ederiz',
            've geometrileri *Polygon* veya *MultiPolygon* türünde olmalıdır.'
        ].join(' ')
    },
    featureidkey: extendFlat({}, choroplethAttrs.featureidkey, {
        description: [
            'GeoJSON özelliklerinde `locations` dizisindeki öğelerle eşleşmek için',
            'kullanılan anahtarı ayarlar.',
            'Örneğin *properties.name* gibi iç içe geçmiş özellikleri destekler.'
        ].join(' ')
    }),

    // Katmanların yerleştirilmesini ayarlar
    below: {
        valType: 'string',
        editType: 'plot',
        description: [
            'Choropleth poligonlarının belirtilen ID\'ye sahip katmanın',
            'öncesine yerleştirilip yerleştirilmeyeceğini belirler.',
            'Varsayılan olarak, choroplethmap izleri su katmanlarının üzerine yerleştirilir.',
            'Eğer boş bırakılırsa,',
            'katman mevcut tüm katmanların üzerine yerleştirilir.'
        ].join(' ')
    },

    // Metin ve hover metin özelliklerini ayarlar
    text: choroplethAttrs.text,
    hovertext: choroplethAttrs.hovertext,

    // Marker özelliklerini ayarlar
    marker: {
        line: {
            color: extendFlat({}, choroplethAttrs.marker.line.color, {editType: 'plot'}),
            width: extendFlat({}, choroplethAttrs.marker.line.width, {editType: 'plot'}),
            editType: 'calc'
        },
        opacity: extendFlat({}, choroplethAttrs.marker.opacity, {editType: 'plot'}),
        editType: 'calc'
    },

    // Seçili ve seçilmemiş marker özelliklerini ayarlar
    selected: {
        marker: {
            opacity: extendFlat({}, choroplethAttrs.selected.marker.opacity, {editType: 'plot'}),
            editType: 'plot'
        },
        editType: 'plot'
    },
    unselected: {
        marker: {
            opacity: extendFlat({}, choroplethAttrs.unselected.marker.opacity, {editType: 'plot'}),
            editType: 'plot'
        },
        editType: 'plot'
    },

    // Hover bilgi ve hover şablon özelliklerini ayarlar
    hoverinfo: choroplethAttrs.hoverinfo,
    hovertemplate: hovertemplateAttrs({}, {keys: ['properties']}),

    // Legend gösterimini ayarlar
    showlegend: extendFlat({}, baseAttrs.showlegend, {dflt: false})
},

    // Renk skalası özelliklerini ayarlar
    colorScaleAttrs('', {
        cLetter: 'z',
        editTypeOverride: 'calc'
    })
);
