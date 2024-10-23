'use strict';

var Lib = require('../../lib');
var defaultLine = require('../../components/color').defaultLine;
var domainAttrs = require('../domain').attributes;
var fontAttrs = require('../font_attributes');
var textposition = require('../../traces/scatter/attributes').textposition;
var overrideAll = require('../../plot_api/edit_types').overrideAll;
var templatedArray = require('../../plot_api/plot_template').templatedArray;

var constants = require('./constants');

var fontAttr = fontAttrs({
    noFontVariant: true,
    noFontShadow: true,
    noFontLineposition: true,
    noFontTextcase: true,
    description: [
        'Simge metin yazı tipini ayarlar (renk=map.layer.paint.text-color, boyut=map.layer.layout.text-size).',
        'Sadece `type` *symbol* olarak ayarlandığında etkili olur.'
    ].join(' ')
});
fontAttr.family.dflt = 'Open Sans Regular, Arial Unicode MS Regular';

var attrs = module.exports = overrideAll({
    _arrayAttrRegexps: [Lib.counterRegex('map', '.layers', true)],

    domain: domainAttrs({name: 'map'}),

    style: {
        valType: 'any',
        values: constants.styleValuesMap,
        dflt: constants.styleValueDflt,
        description: [
            'Varsayılan olarak iz katmanlarının altında render edilen harita katmanlarını tanımlar,',
            'ki bunlar varsayılan olarak `data` içinde tanımlanan katmanların altında render edilir,',
            've bunlar da varsayılan olarak `layout.map.layers` içinde tanımlanan katmanların altında render edilir.',
            '',
            'Bu katmanlar, birden fazla katman tanımı içerebilen bir Harita Stili nesnesi olarak açıkça tanımlanabilir,',
            'veya yerleşik stil nesnelerinden biri kullanılarak dolaylı olarak tanımlanabilir,',
            'veya özel bir stil URL\'si kullanılarak tanımlanabilir.',
            '',
            'Harita Stili nesneleri, MapLibre GL JS belgelerinde açıklanan formdadır,',
            'https://maplibre.org/maplibre-style-spec/ adresinde mevcuttur.',
            '',
            'Yerleşik plotly.js stil nesneleri şunlardır:', constants.styleValuesMap.join(', ') + '.'
        ].join(' ')
    },

    center: {
        lon: {
            valType: 'number',
            dflt: 0,
            description: 'Haritanın merkezinin boylamını ayarlar (Doğu derecelerinde).'
        },
        lat: {
            valType: 'number',
            dflt: 0,
            description: 'Haritanın merkezinin enlemini ayarlar (Kuzey derecelerinde).'
        }
    },
    zoom: {
        valType: 'number',
        dflt: 1,
        description: 'Haritanın yakınlaştırma seviyesini ayarlar (map.zoom).'
    },
    bearing: {
        valType: 'number',
        dflt: 0,
        description: 'Haritanın kuzeyden saat yönünün tersine olan açı derecesini ayarlar (map.bearing).'
    },
    pitch: {
        valType: 'number',
        dflt: 0,
        description: [
            'Haritanın eğim açısını ayarlar',
            '(derece cinsinden, *0* haritanın yüzeyine dik anlamına gelir) (map.pitch).'
        ].join(' ')
    },

    bounds: {
        west: {
            valType: 'number',
            description: [
                'Haritanın minimum boylamını ayarlar (Doğu derecelerinde)',
                'eğer `east`, `south` ve `north` belirtilmişse.'
            ].join(' ')
        },
        east: {
            valType: 'number',
            description: [
                'Haritanın maksimum boylamını ayarlar (Doğu derecelerinde)',
                'eğer `west`, `south` ve `north` belirtilmişse.'
            ].join(' ')
        },
        south: {
            valType: 'number',
            description: [
                'Haritanın minimum enlemini ayarlar (Kuzey derecelerinde)',
                'eğer `east`, `west` ve `north` belirtilmişse.'
            ].join(' ')
        },
        north: {
            valType: 'number',
            description: [
                'Haritanın maksimum enlemini ayarlar (Kuzey derecelerinde)',
                'eğer `east`, `west` ve `south` belirtilmişse.'
            ].join(' ')
        }
    },

    layers: templatedArray('layer', {
        visible: {
            valType: 'boolean',
            dflt: true,
            description: [
                'Bu katmanın görüntülenip görüntülenmeyeceğini belirler'
            ].join(' ')
        },
        sourcetype: {
            valType: 'enumerated',
            values: ['geojson', 'vector', 'raster', 'image'],
            dflt: 'geojson',
            description: [
                'Bu katman için kaynak türünü ayarlar,',
                'yani katman verisinin türünü.'
            ].join(' ')
        },

        source: {
            valType: 'any',
            description: [
                'Bu katman için kaynak verisini ayarlar (map.layer.source).',
                '`sourcetype` *geojson* olarak ayarlandığında, `source` bir GeoJSON URL\'si',
                'veya bir GeoJSON nesnesi olabilir.',
                '`sourcetype` *vector* veya *raster* olarak ayarlandığında, `source` bir URL veya',
                'bir dizi döşeme URL\'si olabilir.',
                '`sourcetype` *image* olarak ayarlandığında, `source` bir resim URL\'si olabilir.'
            ].join(' ')
        },

        sourcelayer: {
            valType: 'string',
            dflt: '',
            description: [
                'Bir vektör döşeme kaynağından kullanılacak katmanı belirtir (map.layer.source-layer).',
                'Birden fazla katmanı destekleyen *vector* kaynak türü için gereklidir.'
            ].join(' ')
        },

        sourceattribution: {
            valType: 'string',
            description: [
                'Bu kaynak için atıf ayarlar.'
            ].join(' ')
        },

        type: {
            valType: 'enumerated',
            values: ['circle', 'line', 'fill', 'symbol', 'raster'],
            dflt: 'circle',
            description: [
                'Katman türünü ayarlar,',
                'yani `source` içinde ayarlanan katman verisinin nasıl render edileceğini belirler.',
                '`sourcetype` *geojson* olarak ayarlandığında, aşağıdaki değerler izin verilir:',
                '*circle*, *line*, *fill* ve *symbol*.',
                'ancak *line* ve *fill* Nokta',
                'GeoJSON geometrileri ile uyumlu değildir.',
                '`sourcetype` *vector* olarak ayarlandığında, aşağıdaki değerler izin verilir:',
                ' *circle*, *line*, *fill* ve *symbol*.',
                '`sourcetype` *raster* veya *image* olarak ayarlandığında, sadece *raster* değeri izin verilir.'
            ].join(' ')
        },

        coordinates: {
            valType: 'any',
            description: [
                'Koordinatlar dizisini ayarlar, [boylam, enlem] çiftlerini içerir',
                'resim köşeleri için saat yönünde sıralanmış: ',
                'sol üst, sağ üst, sağ alt, sol alt.',
                'Sadece *image* `sourcetype` için etkili olur.'
            ].join(' ')
        },

        // tüm türler arasında paylaşılan öznitelikler
        below: {
            valType: 'string',
            description: [
                'Katmanın belirtilen ID\'ye sahip katmanın önüne yerleştirilip yerleştirilmeyeceğini belirler.',
                'Atlanırsa veya boş bırakılırsa,',
                'katman mevcut tüm katmanların üzerine yerleştirilir.'
            ].join(' ')
        },
        color: {
            valType: 'color',
            dflt: defaultLine,
            description: [
                'Birincil katman rengini ayarlar.',
                '`type` *circle* ise, renk daire rengini ifade eder (map.layer.paint.circle-color)',
                '`type` *line* ise, renk çizgi rengini ifade eder (map.layer.paint.line-color)',
                '`type` *fill* ise, renk dolgu rengini ifade eder (map.layer.paint.fill-color)',
                '`type` *symbol* ise, renk simge rengini ifade eder (map.layer.paint.icon-color)'
            ].join(' ')
        },
        opacity: {
            valType: 'number',
            min: 0,
            max: 1,
            dflt: 1,
            description: [
                'Katmanın opaklığını ayarlar.',
                '`type` *circle* ise, opaklık daire opaklığını ifade eder (map.layer.paint.circle-opacity)',
                '`type` *line* ise, opaklık çizgi opaklığını ifade eder (map.layer.paint.line-opacity)',
                '`type` *fill* ise, opaklık dolgu opaklığını ifade eder (map.layer.paint.fill-opacity)',
                '`type` *symbol* ise, opaklık simge/metin opaklığını ifade eder (map.layer.paint.text-opacity)'
            ].join(' ')
        },
        minzoom: {
            valType: 'number',
            min: 0,
            max: 24,
            dflt: 0,
            description: [
                'Minimum yakınlaştırma seviyesini ayarlar (map.layer.minzoom).',
                'Yakınlaştırma seviyeleri minzoom\'dan daha az olduğunda, katman gizlenecektir.',
            ].join(' ')
        },
        maxzoom: {
            valType: 'number',
            min: 0,
            max: 24,
            dflt: 24,
            description: [
                'Maksimum yakınlaştırma seviyesini ayarlar (map.layer.maxzoom).',
                'Yakınlaştırma seviyeleri maxzoom\'a eşit veya daha büyük olduğunda, katman gizlenecektir.'
            ].join(' ')
        },

        // türüne özgü stil öznitelikleri
        circle: {
            radius: {
                valType: 'number',
                dflt: 15,
                description: [
                    'Daire yarıçapını ayarlar (map.layer.paint.circle-radius).',
                    'Sadece `type` *circle* olarak ayarlandığında etkili olur.'
                ].join(' ')
            }
        },

        line: {
            width: {
                valType: 'number',
                dflt: 2,
                description: [
                    'Çizgi genişliğini ayarlar (map.layer.paint.line-width).',
                    'Sadece `type` *line* olarak ayarlandığında etkili olur.'
                ].join(' ')
            },
            dash: {
                valType: 'data_array',
                description: [
                    'Çizgi ve boşlukların uzunluğunu ayarlar (map.layer.paint.line-dasharray).',
                    'Sadece `type` *line* olarak ayarlandığında etkili olur.'
                ].join(' ')
            }
        },

        fill: {
            outlinecolor: {
                valType: 'color',
                dflt: defaultLine,
                description: [
                    'Dolgu dış çizgi rengini ayarlar (map.layer.paint.fill-outline-color).',
                    'Sadece `type` *fill* olarak ayarlandığında etkili olur.'
                ].join(' ')
            }
        },

        symbol: {
            icon: {
                valType: 'string',
                dflt: 'marker',
                description: [
                    'Simge simge resmini ayarlar (map.layer.layout.icon-image).',
                    'Tam liste: https://www.map.com/maki-icons/'
                ].join(' ')
            },
            iconsize: {
                valType: 'number',
                dflt: 10,
                description: [
                    'Simge simge boyutunu ayarlar (map.layer.layout.icon-size).',
                    'Sadece `type` *symbol* olarak ayarlandığında etkili olur.'
                ].join(' ')
            },
            text: {
                valType: 'string',
                dflt: '',
                description: [
                    'Simge metnini ayarlar (map.layer.layout.text-field).'
                ].join(' ')
            },
            placement: {
                valType: 'enumerated',
                values: ['point', 'line', 'line-center'],
                dflt: 'point',
                description: [
                    'Simge ve/veya metin yerleşimini ayarlar (map.layer.layout.symbol-placement).',
                    '`placement` *point* ise, etiket geometrinin bulunduğu yere yerleştirilir',
                    '`placement` *line* ise, etiket geometrinin hattı boyunca yerleştirilir',
                    '`placement` *line-center* ise, etiket geometrinin merkezine yerleştirilir',
                ].join(' ')
            },
            textfont: fontAttr,
            textposition: Lib.extendFlat({}, textposition, { arrayOk: false })
        }
    })
}, 'plot', 'from-root');

// uirevision'ı overrideAll dışında ayarlayın, böylece `editType: 'none'` olabilir
attrs.uirevision = {
    valType: 'any',
    editType: 'none',
    description: [
        'Görünümde kullanıcı tarafından yapılan değişikliklerin kalıcılığını kontrol eder:',
        '`center`, `zoom`, `bearing`, `pitch`. Varsayılan olarak `layout.uirevision`.'
    ].join(' ')
};
