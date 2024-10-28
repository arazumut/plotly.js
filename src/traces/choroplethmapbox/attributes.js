'use strict';

// Gerekli modülleri dahil et
var choroplethAttrs = require('../choropleth/attributes');
var colorScaleAttrs = require('../../components/colorscale/attributes');
var hovertemplateAttrs = require('../../plots/template_attributes').hovertemplateAttrs;
var baseAttrs = require('../../plots/attributes');
var extendFlat = require('../../lib/extend').extendFlat;

// Modülü dışa aktar
module.exports = extendFlat({
    // Konumları ayarla
    locations: {
        valType: 'data_array',
        editType: 'calc',
        description: [
            '*geojson* içinde bulunan özelliklerin',
            'özellik `id` alanını kullanarak çizileceğini ayarlar.'
        ].join(' ')
    },

    // Renk değerlerini ayarla
    z: {
        valType: 'data_array',
        editType: 'calc',
        description: 'Renk değerlerini ayarlar.'
    },

    // GeoJSON verilerini ayarla
    geojson: {
        valType: 'any',
        editType: 'calc',
        description: [
            'Bu iz ile ilişkili GeoJSON verilerini ayarlar.',
            'Geçerli bir GeoJSON nesnesi veya bir URL dizesi olarak ayarlanabilir.',
            'Yalnızca *FeatureCollection* veya *Feature* türünde GeoJSON\'ları kabul ederiz',
            've geometrileri *Polygon* veya *MultiPolygon* türünde olmalıdır.'
        ].join(' ')
    },
    featureidkey: extendFlat({}, choroplethAttrs.featureidkey, {
        description: [
            'GeoJSON özelliklerinde, `locations` dizisindeki öğelerle eşleşmek için',
            'kullanılan anahtarı ayarlar.',
            'Örneğin *properties.name* gibi iç içe geçmiş özellikleri destekler.'
        ].join(' ')
    }),

    // Katmanların yerleştirilme sırasını ayarla
    below: {
        valType: 'string',
        editType: 'plot',
        description: [
            'Choropleth poligonlarının, belirtilen ID\'ye sahip katmanın',
            'öncesine yerleştirilip yerleştirilmeyeceğini belirler.',
            'Varsayılan olarak, choroplethmapbox izleri su katmanlarının üzerine yerleştirilir.',
            'Eğer boş bırakılırsa,',
            'katman mevcut tüm katmanların üzerine yerleştirilir.'
        ].join(' ')
    },

    // Metin ve hover metin özelliklerini ayarla
    text: choroplethAttrs.text,
    hovertext: choroplethAttrs.hovertext,

    // Marker özelliklerini ayarla
    marker: {
        line: {
            color: extendFlat({}, choroplethAttrs.marker.line.color, {editType: 'plot'}),
            width: extendFlat({}, choroplethAttrs.marker.line.width, {editType: 'plot'}),
            editType: 'calc'
        },
        opacity: extendFlat({}, choroplethAttrs.marker.opacity, {editType: 'plot'}),
        editType: 'calc'
    },

    // Seçili ve seçilmemiş marker özelliklerini ayarla
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

    // Hover bilgi ve hover şablon özelliklerini ayarla
    hoverinfo: choroplethAttrs.hoverinfo,
    hovertemplate: hovertemplateAttrs({}, {keys: ['properties']}),

    // Legend gösterimini ayarla
    showlegend: extendFlat({}, baseAttrs.showlegend, {dflt: false})
},

    // Renk skalası özelliklerini ayarla
    colorScaleAttrs('', {
        cLetter: 'z',
        editTypeOverride: 'calc'
    })
);
