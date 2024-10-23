'use strict';

var sortObjectKeys = require('../../lib/sort_object_keys');
var arcgisSatHybrid = require('./styles/arcgis-sat-hybrid'); // https://raw.githubusercontent.com/go2garret/maps/v1.0.0/LICENSE
var arcgisSat = require('./styles/arcgis-sat');

var OSM = '© <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar';

var cartoPositron = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
var cartoDarkmatter = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
var cartoVoyager = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
var cartoPositronNoLabels = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
var cartoDarkmatterNoLabels = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';
var cartoVoyagerNoLabels = 'https://basemaps.cartocdn.com/gl/voyager-nolabels-gl-style/style.json';

var stilHaritasi = {
    temel: cartoVoyager,
    sokaklar: cartoVoyager,
    dışmekan: cartoVoyager,
    açık: cartoPositron,
    koyu: cartoDarkmatter,
    uydu: arcgisSat,
    'uydu-sokaklar': arcgisSatHybrid,
    'açık-sokak-haritası': {
        id: 'osm',
        versiyon: 8,
        kaynaklar: {
            'plotly-osm-tiles': {
                tür: 'raster',
                atıf: OSM,
                döşemeler: [
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                döşemeBoyutu: 256
            }
        },
        katmanlar: [{
            id: 'plotly-osm-tiles',
            tür: 'raster',
            kaynak: 'plotly-osm-tiles',
            minzoom: 0,
            maxzoom: 22
        }],
        glifler: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf'
    },
    'beyaz-arka-plan': {
        id: 'white-bg',
        versiyon: 8,
        kaynaklar: {},
        katmanlar: [{
            id: 'white-bg',
            tür: 'background',
            boya: {'background-color': '#FFFFFF'},
            minzoom: 0,
            maxzoom: 22
        }],
        glifler: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf'
    },
    'carto-positron': cartoPositron,
    'carto-darkmatter': cartoDarkmatter,
    'carto-voyager': cartoVoyager,
    'carto-positron-etiketsiz': cartoPositronNoLabels,
    'carto-darkmatter-etiketsiz': cartoDarkmatterNoLabels,
    'carto-voyager-etiketsiz': cartoVoyagerNoLabels,
};

var stilDegerleriHaritasi = sortObjectKeys(stilHaritasi);

module.exports = {
    varsayılanStilDegeri: 'temel',
    stilHaritasi: stilHaritasi,
    stilDegerleriHaritasi: stilDegerleriHaritasi,

    izKatmanÖneki: 'plotly-iz-katmanı-',
    düzenKatmanÖneki: 'plotly-düzen-katmanı-',

    eksikStilHataMesaji: [
        'Geçerli bir maplibre stili bulunamadı, lütfen `map.style` değerini şu seçeneklerden birine ayarlayın:',
        stilDegerleriHaritasi.join(', '),
        'veya bir döşeme hizmeti kullanın.'
    ].join('\n'),

    haritaHataMesaji: 'Harita hatası.',
};
