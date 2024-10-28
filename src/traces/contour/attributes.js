'use strict';

// Gerekli modülleri dahil et
var heatmapAttrs = require('../heatmap/attributes');
var scatterAttrs = require('../scatter/attributes');
var axisFormat = require('../../plots/cartesian/axis_format_attributes');
var axisHoverFormat = axisFormat.axisHoverFormat;
var descriptionOnlyNumbers = axisFormat.descriptionOnlyNumbers;
var colorScaleAttrs = require('../../components/colorscale/attributes');
var dash = require('../../components/drawing/attributes').dash;
var fontAttrs = require('../../plots/font_attributes');
var extendFlat = require('../../lib/extend').extendFlat;

var filterOps = require('../../constants/filter_ops');
var COMPARISON_OPS2 = filterOps.COMPARISON_OPS2;
var INTERVAL_OPS = filterOps.INTERVAL_OPS;

var scatterLineAttrs = scatterAttrs.line;

// Modülü dışa aktar
module.exports = extendFlat({
    z: heatmapAttrs.z,
    x: heatmapAttrs.x,
    x0: heatmapAttrs.x0,
    dx: heatmapAttrs.dx,
    y: heatmapAttrs.y,
    y0: heatmapAttrs.y0,
    dy: heatmapAttrs.dy,

    xperiod: heatmapAttrs.xperiod,
    yperiod: heatmapAttrs.yperiod,
    xperiod0: scatterAttrs.xperiod0,
    yperiod0: scatterAttrs.yperiod0,
    xperiodalignment: heatmapAttrs.xperiodalignment,
    yperiodalignment: heatmapAttrs.yperiodalignment,

    text: heatmapAttrs.text,
    hovertext: heatmapAttrs.hovertext,
    transpose: heatmapAttrs.transpose,
    xtype: heatmapAttrs.xtype,
    ytype: heatmapAttrs.ytype,
    xhoverformat: axisHoverFormat('x'),
    yhoverformat: axisHoverFormat('y'),
    zhoverformat: axisHoverFormat('z', 1),
    hovertemplate: heatmapAttrs.hovertemplate,
    texttemplate: extendFlat({}, heatmapAttrs.texttemplate, {
        description: [
            'Bu iz için sadece `coloring` *heatmap* olarak ayarlandığında etkisi vardır.',
            heatmapAttrs.texttemplate.description
        ].join(' ')
    }),
    textfont: extendFlat({}, heatmapAttrs.textfont, {
        description: [
            'Bu iz için sadece `coloring` *heatmap* olarak ayarlandığında etkisi vardır.',
            heatmapAttrs.textfont.description
        ].join(' ')
    }),
    hoverongaps: heatmapAttrs.hoverongaps,
    connectgaps: extendFlat({}, heatmapAttrs.connectgaps, {
        description: [
            'Boşlukların (örneğin {nan} veya eksik değerler) `z` verilerinde doldurulup doldurulmadığını belirler.',
            'Eğer `z` bir boyutlu bir dizi ise varsayılan olarak true, aksi takdirde varsayılan olarak false olur.'
        ].join(' ')
    }),

    fillcolor: {
        valType: 'color',
        editType: 'calc',
        description: [
            '`contours.type` *constraint* olarak ayarlandığında dolgu rengini ayarlar.',
            'Varsayılan olarak çizgi renginin, işaretleyici renginin veya işaretleyici çizgi renginin yarı şeffaf bir varyantıdır.'
        ].join(' ')
    },

    autocontour: {
        valType: 'boolean',
        dflt: true,
        editType: 'calc',
        impliedEdits: {
            'contours.start': undefined,
            'contours.end': undefined,
            'contours.size': undefined
        },
        description: [
            'Kontur seviye özniteliklerinin bir algoritma tarafından seçilip seçilmediğini belirler.',
            'Eğer *true* ise, kontur seviyelerinin sayısı `ncontours` içinde ayarlanabilir.',
            'Eğer *false* ise, kontur seviye özniteliklerini `contours` içinde ayarlayın.'
        ].join(' ')
    },
    ncontours: {
        valType: 'integer',
        dflt: 15,
        min: 1,
        editType: 'calc',
        description: [
            'Maksimum kontur seviyesi sayısını ayarlar. Gerçek kontur sayısı otomatik olarak `ncontours` değerinden az veya ona eşit olacak şekilde seçilecektir.',
            'Sadece `autocontour` *true* ise veya `contours.size` eksikse etkisi vardır.'
        ].join(' ')
    },

    contours: {
        type: {
            valType: 'enumerated',
            values: ['levels', 'constraint'],
            dflt: 'levels',
            editType: 'calc',
            description: [
                '`levels` ise, veri birden fazla seviye ile gösterilen bir kontur grafiği olarak temsil edilir.',
                '`constraint` ise, veri `operation` ve `value` parametreleri ile belirtilen geçersiz bölge gölgeli olarak kısıtlamalarla temsil edilir.'
            ].join(' ')
        },
        start: {
            valType: 'number',
            dflt: null,
            editType: 'plot',
            impliedEdits: {'^autocontour': false},
            description: [
                'Başlangıç kontur seviyesi değerini ayarlar.',
                '`contours.end` değerinden küçük olmalıdır.'
            ].join(' ')
        },
        end: {
            valType: 'number',
            dflt: null,
            editType: 'plot',
            impliedEdits: {'^autocontour': false},
            description: [
                'Bitiş kontur seviyesi değerini ayarlar.',
                '`contours.start` değerinden büyük olmalıdır.'
            ].join(' ')
        },
        size: {
            valType: 'number',
            dflt: null,
            min: 0,
            editType: 'plot',
            impliedEdits: {'^autocontour': false},
            description: [
                'Her kontur seviyesi arasındaki adımı ayarlar.',
                'Pozitif olmalıdır.'
            ].join(' ')
        },
        coloring: {
            valType: 'enumerated',
            values: ['fill', 'heatmap', 'lines', 'none'],
            dflt: 'fill',
            editType: 'calc',
            description: [
                'Kontur değerlerini gösteren renklendirme yöntemini belirler.',
                '*fill* ise, her kontur seviyesi arasında eşit olarak renklendirme yapılır.',
                '*heatmap* ise, her kontur seviyesi arasında bir ısı haritası gradyan renklendirmesi uygulanır.',
                '*lines* ise, kontur çizgilerinde renklendirme yapılır.',
                '*none* ise, bu izde renklendirme uygulanmaz.'
            ].join(' ')
        },
        showlines: {
            valType: 'boolean',
            dflt: true,
            editType: 'plot',
            description: [
                'Kontur çizgilerinin çizilip çizilmediğini belirler.',
                'Sadece `contours.coloring` *fill* olarak ayarlandığında etkisi vardır.'
            ].join(' ')
        },
        showlabels: {
            valType: 'boolean',
            dflt: false,
            editType: 'plot',
            description: [
                'Kontur çizgilerini değerleriyle etiketleyip etiketlemeyeceğini belirler.'
            ].join(' ')
        },
        labelfont: fontAttrs({
            editType: 'plot',
            colorEditType: 'style',
            description: [
                'Kontur seviyelerini etiketlemek için kullanılan yazı tipini ayarlar.',
                'Varsayılan renk çizgilerden gelir, eğer gösteriliyorsa.',
                'Varsayılan aile ve boyut `layout.font`dan gelir.'
            ].join(' '),
        }),
        labelformat: {
            valType: 'string',
            dflt: '',
            editType: 'plot',
            description: descriptionOnlyNumbers('kontur etiketi')
        },
        operation: {
            valType: 'enumerated',
            values: [].concat(COMPARISON_OPS2).concat(INTERVAL_OPS),
            dflt: '=',
            editType: 'calc',
            description: [
                'Kısıtlama işlemini ayarlar.',

                '*=* `value` değerine eşit bölgeleri tutar',

                '*<* ve *<=* `value` değerinden küçük bölgeleri tutar',

                '*>* ve *>=* `value` değerinden büyük bölgeleri tutar',

                '*[]*, *()*, *[)*, ve *(]* `value[0]` ile `value[1]` arasındaki bölgeleri tutar',

                '*][*, *)(*, *](*, *)[* `value[0]` ile `value[1]` arasındaki bölgeleri tutar',

                'Açık ve kapalı aralıklar kısıtlama gösterimi için fark yaratmaz, ancak',
                'tüm versiyonlar filtre dönüşümleri ile tutarlılık için izin verilir.'
            ].join(' ')
        },
        value: {
            valType: 'any',
            dflt: 0,
            editType: 'calc',
            description: [
                'Kısıtlama sınırının değerini veya değerlerini ayarlar.',

                '`operation` bir karşılaştırma değeri olarak ayarlandığında',
                '(' + COMPARISON_OPS2 + ')',
                '*value* bir sayı olması beklenir.',

                '`operation` bir aralık değeri olarak ayarlandığında',
                '(' + INTERVAL_OPS + ')',
                '*value* iki sayının olduğu bir dizi olması beklenir, ilk sayı alt sınır ve ikinci sayı üst sınırdır.'
            ].join(' ')
        },
        editType: 'calc',
        impliedEdits: {autocontour: false}
    },

    line: {
        color: extendFlat({}, scatterLineAttrs.color, {
            editType: 'style+colorbars',
            description: [
                'Kontur seviyesinin rengini ayarlar.',
                '`contours.coloring` *lines* olarak ayarlandığında etkisi yoktur.'
            ].join(' ')
        }),
        width: {
            valType: 'number',
            min: 0,
            editType: 'style+colorbars',
            description: [
                'Kontur çizgi genişliğini (px cinsinden) ayarlar.',
                '`contours.type` *levels* olduğunda varsayılan olarak *0.5* dir.',
                '`contour.type` *constraint* olduğunda varsayılan olarak *2* dir.'
            ].join(' ')
        },
        dash: dash,
        smoothing: extendFlat({}, scatterLineAttrs.smoothing, {
            description: [
                'Kontur çizgileri için yumuşatma miktarını ayarlar,',
                '*0* yumuşatma olmadığını gösterir.'
            ].join(' ')
        }),
        editType: 'plot'
    },
    zorder: scatterAttrs.zorder
},
    colorScaleAttrs('', {
        cLetter: 'z',
        autoColorDflt: false,
        editTypeOverride: 'calc'
    })
);
