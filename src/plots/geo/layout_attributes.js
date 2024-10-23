'use strict';

var renkOzellikleri = require('../../components/color/attributes');
var alanOzellikleri = require('../domain').attributes;
var cizgi = require('../../components/drawing/attributes').dash;
var sabitler = require('./constants');
var hepsiniGecersizKil = require('../../plot_api/edit_types').overrideAll;
var nesneAnahtarlariniSirala = require('../../lib/sort_object_keys');

var geoEksenOzellikleri = {
    aralik: {
        valType: 'info_array',
        items: [
            {valType: 'number'},
            {valType: 'number'}
        ],
        description: [
            'Bu eksenin aralığını (derece cinsinden) ayarlar,',
            'haritanın kırpılmış koordinatlarını ayarlar.'
        ].join(' ')
    },
    gridGoster: {
        valType: 'boolean',
        dflt: false,
        description: 'Haritada ızgara çizgilerinin gösterilip gösterilmeyeceğini ayarlar.'
    },
    tick0: {
        valType: 'number',
        dflt: 0,
        description: [
            'Izgara çizgilerinin başlangıç uzunluk/enlem tikini ayarlar.'
        ].join(' ')
    },
    dtick: {
        valType: 'number',
        description: [
            'Izgara çizgilerinin uzunluk/enlem tik adımını ayarlar.'
        ].join(' ')
    },
    gridRenk: {
        valType: 'color',
        dflt: renkOzellikleri.lightLine,
        description: [
            'Izgara çizgilerinin çizgi rengini ayarlar.'
        ].join(' ')
    },
    gridGenislik: {
        valType: 'number',
        min: 0,
        dflt: 1,
        description: [
            'Izgara çizgilerinin çizgi genişliğini (px cinsinden) ayarlar.'
        ].join(' ')
    },
    gridCizgi: cizgi
};

var ozellikler = module.exports = hepsiniGecersizKil({
    alan: alanOzellikleri({name: 'geo'}, {
        description: [
            'Geo alt grafiklerinin alan tarafından kısıtlandığını unutmayın.',
            'Genel olarak, `projection.scale` 1 olarak ayarlandığında,',
            'bir harita ya x ya da y alanına sığar, ancak her ikisine birden değil.'
        ].join(' ')
    }),

    fitbounds: {
        valType: 'enumerated',
        values: [false, 'locations', 'geojson'],
        dflt: false,
        editType: 'plot',
        description: [
            'Bu alt grafiğin görünüm ayarlarının iz verilerine uyacak şekilde otomatik olarak hesaplanıp hesaplanmayacağını belirler.',

            'Sınırlı haritalarda, `fitbounds` ayarlandığında `center.lon` ve `center.lat` otomatik olarak doldurulur.',

            'Kesilmemiş projeksiyona sahip haritalarda, `fitbounds` ayarlandığında `center.lon`, `center.lat`,',
            've `projection.rotation.lon` otomatik olarak doldurulur.',

            'Kesilmiş projeksiyona sahip haritalarda, `fitbounds` ayarlandığında `center.lon`, `center.lat`,',
            '`projection.rotation.lon`, `projection.rotation.lat`, `lonaxis.range` ve `lataxis.range`',
            'otomatik olarak doldurulur.',

            'Eğer *locations* ise, sadece iz görünür konumları `fitbounds` hesaplamalarında dikkate alınır.',
            'Eğer *geojson* ise, sağlanan tüm iz girişi `geojson` (varsa) `fitbounds` hesaplamalarında dikkate alınır,',
            'Varsayılan olarak *false*.'
        ].join(' ')
    },

    cozum: {
        valType: 'enumerated',
        values: [110, 50],
        dflt: 110,
        coerceNumber: true,
        description: [
            'Temel katmanların çözünürlüğünü ayarlar.',
            'Değerler km/mm birimindedir,',
            'örneğin 110, 1:110,000,000 ölçek oranına karşılık gelir.'
        ].join(' ')
    },
    kapsam: {
        valType: 'enumerated',
        values: nesneAnahtarlariniSirala(sabitler.scopeDefaults),
        dflt: 'world',
        description: 'Haritanın kapsamını ayarlar.'
    },
    projeksiyon: {
        type: {
            valType: 'enumerated',
            values: nesneAnahtarlariniSirala(sabitler.projNames),
            description: 'Projeksiyon türünü ayarlar.'
        },
        rotation: {
            lon: {
                valType: 'number',
                description: [
                    'Haritayı paraleller boyunca döndürür',
                    '(doğu derecelerinde).',
                    'Varsayılan olarak `lonaxis.range` değerlerinin ortasına ayarlanır.'
                ].join(' ')
            },
            lat: {
                valType: 'number',
                description: [
                    'Haritayı meridyenler boyunca döndürür',
                    '(kuzey derecelerinde).'
                ].join(' ')
            },
            roll: {
                valType: 'number',
                description: [
                    'Haritayı döndürür (derece cinsinden)',
                    'Örneğin, *180* derecelik bir döndürme haritayı ters çevirir.'
                ].join(' ')
            }
        },
        tilt: {
            valType: 'number',
            dflt: 0,
            description: [
                'Sadece uydu projeksiyon türü için.',
                'Perspektif projeksiyonun eğim açısını ayarlar.'
            ].join(' ')
        },
        distance: {
            valType: 'number',
            min: 1.001,
            dflt: 2,
            description: [
                'Sadece uydu projeksiyon türü için.',
                'Bakış noktasının kürenin merkezine olan mesafesini ayarlar',
                'küre yarıçapının bir oranı olarak.'
            ].join(' ')
        }, 
        parallels: {
            valType: 'info_array',
            items: [
                {valType: 'number'},
                {valType: 'number'}
            ],
            description: [
                'Sadece konik projeksiyon türleri için.',
                'Koninin küreyi kestiği paralelleri (teğet, kesen) ayarlar.'
            ].join(' ')
        },
        scale: {
            valType: 'number',
            min: 0,
            dflt: 1,
            description: [
                'Harita görünümünü yakınlaştırır veya uzaklaştırır.',
                '*1* ölçeği, haritanın uzunluk ve enlem aralıklarına sığan en büyük yakınlaştırma seviyesine karşılık gelir.'
            ].join(' ')
        },
    },
    merkez: {
        lon: {
            valType: 'number',
            description: [
                'Haritanın merkezinin boylamını ayarlar.',
                'Varsayılan olarak, haritanın boylam merkezi, sınırlı projeksiyon için boylam aralığının ortasında yer alır',
                've aksi takdirde `projection.rotation.lon` üzerinde bulunur.'
            ].join(' ')
        },
        lat: {
            valType: 'number',
            description: [
                'Haritanın merkezinin enlemini ayarlar.',
                'Tüm projeksiyon türleri için, haritanın enlem merkezi varsayılan olarak enlem aralığının ortasında yer alır.'
            ].join(' ')
        }
    },
    gorunur: {
        valType: 'boolean',
        dflt: true,
        description: 'Temel katmanların varsayılan görünürlüğünü ayarlar.'
    },
    sahilCizgileriniGoster: {
        valType: 'boolean',
        description: 'Sahil çizgilerinin çizilip çizilmeyeceğini ayarlar.'
    },
    sahilCizgisiRengi: {
        valType: 'color',
        dflt: renkOzellikleri.defaultLine,
        description: 'Sahil çizgisi rengini ayarlar.'
    },
    sahilCizgisiGenisligi: {
        valType: 'number',
        min: 0,
        dflt: 1,
        description: 'Sahil çizgisi çizgi genişliğini (px cinsinden) ayarlar.'
    },
    karaGoster: {
        valType: 'boolean',
        dflt: false,
        description: 'Kara kütlelerinin renkle doldurulup doldurulmayacağını ayarlar.'
    },
    karaRengi: {
        valType: 'color',
        dflt: sabitler.landColor,
        description: 'Kara kütlesi rengini ayarlar.'
    },
    okyanusGoster: {
        valType: 'boolean',
        dflt: false,
        description: 'Okyanusların renkle doldurulup doldurulmayacağını ayarlar.'
    },
    okyanusRengi: {
        valType: 'color',
        dflt: sabitler.waterColor,
        description: 'Okyanus rengini ayarlar.'
    },
    golGoster: {
        valType: 'boolean',
        dflt: false,
        description: 'Göllerin çizilip çizilmeyeceğini ayarlar.'
    },
    golRengi: {
        valType: 'color',
        dflt: sabitler.waterColor,
        description: 'Göllerin rengini ayarlar.'
    },
    nehirGoster: {
        valType: 'boolean',
        dflt: false,
        description: 'Nehirlerin çizilip çizilmeyeceğini ayarlar.'
    },
    nehirRengi: {
        valType: 'color',
        dflt: sabitler.waterColor,
        description: 'Nehirlerin rengini ayarlar.'
    },
    nehirGenisligi: {
        valType: 'number',
        min: 0,
        dflt: 1,
        description: 'Nehirlerin çizgi genişliğini (px cinsinden) ayarlar.'
    },
    ulkeGoster: {
        valType: 'boolean',
        description: 'Ülke sınırlarının çizilip çizilmeyeceğini ayarlar.'
    },
    ulkeRengi: {
        valType: 'color',
        dflt: renkOzellikleri.defaultLine,
        description: 'Ülke sınırlarının çizgi rengini ayarlar.'
    },
    ulkeGenisligi: {
        valType: 'number',
        min: 0,
        dflt: 1,
        description: 'Ülke sınırlarının çizgi genişliğini (px cinsinden) ayarlar.'
    },
    altBirimGoster: {
        valType: 'boolean',
        description: [
            'Ülkeler içindeki alt birimlerin (örneğin, eyaletler, iller) sınırlarının çizilip çizilmeyeceğini ayarlar.'
        ].join(' ')
    },
    altBirimRengi: {
        valType: 'color',
        dflt: renkOzellikleri.defaultLine,
        description: 'Alt birim sınırlarının rengini ayarlar.'
    },
    altBirimGenisligi: {
        valType: 'number',
        min: 0,
        dflt: 1,
        description: 'Alt birim sınırlarının çizgi genişliğini (px cinsinden) ayarlar.'
    },
    cerceveGoster: {
        valType: 'boolean',
        description: 'Haritanın etrafında bir çerçeve çizilip çizilmeyeceğini ayarlar.'
    },
    cerceveRengi: {
        valType: 'color',
        dflt: renkOzellikleri.defaultLine,
        description: 'Çerçevenin rengini ayarlar.'
    },
    cerceveGenisligi: {
        valType: 'number',
        min: 0,
        dflt: 1,
        description: 'Çerçevenin çizgi genişliğini (px cinsinden) ayarlar.'
    },
    arkaPlanRengi: {
        valType: 'color',
        dflt: renkOzellikleri.background,
        description: 'Haritanın arka plan rengini ayarlar.'
    },
    uzunlukEkseni: geoEksenOzellikleri,
    enlemEkseni: geoEksenOzellikleri
}, 'plot', 'from-root');

// uirevision'ı overrideAll dışında ayarlayın, böylece `editType: 'none'` olabilir
ozellikler.uirevision = {
    valType: 'any',
    editType: 'none',
    description: [
        'Kullanıcı tarafından yapılan görünüm değişikliklerinin kalıcılığını kontrol eder',
        '(projeksiyon ve merkez). Varsayılan olarak `layout.uirevision`.'
    ].join(' ')
};
