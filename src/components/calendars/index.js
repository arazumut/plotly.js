'use strict';

// Takvimleri içe aktar
var takvimler = require('./calendars');

// Kütüphane ve sabitleri içe aktar
var Lib = require('../../lib');
var sabitler = require('../../constants/numerical');

// Sabitler
var EPOCHJD = sabitler.EPOCHJD;
var ONEDAY = sabitler.ONEDAY;

// Özellikler
var özellikler = {
    valType: 'enumerated',
    values: Lib.sortObjectKeys(takvimler.calendars),
    editType: 'calc',
    dflt: 'gregorian'
};

// Varsayılanları işleme fonksiyonu
var varsayılanlarıİşle = function(contIn, contOut, attr, dflt) {
    var attrs = {};
    attrs[attr] = özellikler;

    return Lib.coerce(contIn, contOut, attrs, attr, dflt);
};

// İz varsayılanlarını işleme fonksiyonu
var izVarsayılanlarınıİşle = function(traceIn, traceOut, coords, layout) {
    for(var i = 0; i < coords.length; i++) {
        varsayılanlarıİşle(traceIn, traceOut, coords[i] + 'calendar', layout.calendar);
    }
};

// Her takvimin kendi varsayılan kanonik tick'i olmalı
var KANONİK_TICK = {
    chinese: '2000-01-01',
    coptic: '2000-01-01',
    discworld: '2000-01-01',
    ethiopian: '2000-01-01',
    hebrew: '5000-01-01',
    islamic: '1000-01-01',
    julian: '2000-01-01',
    mayan: '5000-01-01',
    nanakshahi: '1000-01-01',
    nepali: '2000-01-01',
    persian: '1000-01-01',
    jalali: '1000-01-01',
    taiwan: '1000-01-01',
    thai: '2000-01-01',
    ummalqura: '1400-01-01'
};

// Pazar günü ile başla - hafta tick'leri için
var KANONİK_PAZAR = {
    chinese: '2000-01-02',
    coptic: '2000-01-03',
    discworld: '2000-01-03',
    ethiopian: '2000-01-05',
    hebrew: '5000-01-01',
    islamic: '1000-01-02',
    julian: '2000-01-03',
    mayan: '5000-01-01',
    nanakshahi: '1000-01-05',
    nepali: '2000-01-05',
    persian: '1000-01-01',
    jalali: '1000-01-01',
    taiwan: '1000-01-04',
    thai: '2000-01-04',
    ummalqura: '1400-01-06'
};

// Varsayılan aralıklar
var VARSAYILAN_ARALIK = {
    chinese: ['2000-01-01', '2001-01-01'],
    coptic: ['1700-01-01', '1701-01-01'],
    discworld: ['1800-01-01', '1801-01-01'],
    ethiopian: ['2000-01-01', '2001-01-01'],
    hebrew: ['5700-01-01', '5701-01-01'],
    islamic: ['1400-01-01', '1401-01-01'],
    julian: ['2000-01-01', '2001-01-01'],
    mayan: ['5200-01-01', '5201-01-01'],
    nanakshahi: ['0500-01-01', '0501-01-01'],
    nepali: ['2000-01-01', '2001-01-01'],
    persian: ['1400-01-01', '1401-01-01'],
    jalali: ['1400-01-01', '1401-01-01'],
    taiwan: ['0100-01-01', '0101-01-01'],
    thai: ['2500-01-01', '2501-01-01'],
    ummalqura: ['1400-01-01', '1401-01-01']
};

// d3 şablonlarını world-calendars şablonlarına dönüştür
var BİLİNMEYEN = '##';
var d3ToWorldCalendars = {
    d: {0: 'dd', '-': 'd'}, // 2 haneli veya yastıksız ay günü
    e: {0: 'd', '-': 'd'}, // alternatif, her zaman yastıksız ay günü
    a: {0: 'D', '-': 'D'}, // kısa hafta günü adı
    A: {0: 'DD', '-': 'DD'}, // tam hafta günü adı
    j: {0: 'oo', '-': 'o'}, // 3 haneli veya yastıksız yıl günü
    W: {0: 'ww', '-': 'w'}, // 2 haneli veya yastıksız yıl haftası (Pazartesi ilk)
    m: {0: 'mm', '-': 'm'}, // 2 haneli veya yastıksız ay numarası
    b: {0: 'M', '-': 'M'}, // kısa ay adı
    B: {0: 'MM', '-': 'MM'}, // tam ay adı
    y: {0: 'yy', '-': 'yy'}, // 2 haneli yıl (yastıksızdan sıfır yastıklıya eşle)
    Y: {0: 'yyyy', '-': 'yyyy'}, // 4 haneli yıl (yastıksızdan sıfır yastıklıya eşle)
    U: BİLİNMEYEN, // Pazar ilk yıl haftası
    w: BİLİNMEYEN, // hafta günü [0(pazar),6]
    c: {0: 'D M d %X yyyy', '-': 'D M d %X yyyy'},
    x: {0: 'mm/dd/yyyy', '-': 'mm/dd/yyyy'}
};

// Dünya takvim formatı fonksiyonu
function dünyaTakvimFormatı(fmt, x, takvim) {
    var tarihJD = Math.floor((x + 0.05) / ONEDAY) + EPOCHJD;
    var cTarih = takvimAl(takvim).fromJD(tarihJD);
    var i = 0;
    var değiştirici, direktif, direktifUzunluğu, direktifObjesi, değiştirmeParçası;

    while((i = fmt.indexOf('%', i)) !== -1) {
        değiştirici = fmt.charAt(i + 1);
        if(değiştirici === '0' || değiştirici === '-' || değiştirici === '_') {
            direktifUzunluğu = 3;
            direktif = fmt.charAt(i + 2);
            if(değiştirici === '_') değiştirici = '-';
        } else {
            direktif = değiştirici;
            değiştirici = '0';
            direktifUzunluğu = 2;
        }
        direktifObjesi = d3ToWorldCalendars[direktif];
        if(!direktifObjesi) {
            i += direktifUzunluğu;
        } else {
            if(direktifObjesi === BİLİNMEYEN) değiştirmeParçası = BİLİNMEYEN;
            else değiştirmeParçası = cTarih.formatDate(direktifObjesi[değiştirici]);

            fmt = fmt.substr(0, i) + değiştirmeParçası + fmt.substr(i + direktifUzunluğu);
            i += değiştirmeParçası.length;
        }
    }
    return fmt;
}

// Dünya takvimlerini önbelleğe al
var tümTakvimler = {};
function takvimAl(takvim) {
    var takvimObjesi = tümTakvimler[takvim];
    if(takvimObjesi) return takvimObjesi;

    takvimObjesi = tümTakvimler[takvim] = takvimler.instance(takvim);
    return takvimObjesi;
}

// Özellikler oluşturma fonksiyonu
function özelliklerOluştur(açıklama) {
    return Lib.extendFlat({}, özellikler, { description: açıklama });
}

// İz özellik açıklaması oluşturma fonksiyonu
function izÖzellikAçıklamasıOluştur(coord) {
    return '`' + coord + '` tarih verileri ile kullanılacak takvim sistemini ayarlar.';
}

// x özellikleri
var xÖzellikler = {
    xcalendar: özelliklerOluştur(izÖzellikAçıklamasıOluştur('x'))
};

// xy özellikleri
var xyÖzellikler = Lib.extendFlat({}, xÖzellikler, {
    ycalendar: özelliklerOluştur(izÖzellikAçıklamasıOluştur('y'))
});

// xyz özellikleri
var xyzÖzellikler = Lib.extendFlat({}, xyÖzellikler, {
    zcalendar: özelliklerOluştur(izÖzellikAçıklamasıOluştur('z'))
});

// Eksen özellikleri
var eksenÖzellikler = özelliklerOluştur([
    '`range` ve `tick0` için takvim sistemini ayarlar',
    'eğer bu bir tarih ekseni ise. Bu, eksendeki verileri',
    'yorumlamak için takvimi ayarlamaz, bu izde belirtilir',
    'veya genel `layout.calendar` ile.'
].join(' '));

// Modülü dışa aktar
module.exports = {
    moduleType: 'component',
    name: 'calendars',

    schema: {
        traces: {
            scatter: xyÖzellikler,
            bar: xyÖzellikler,
            box: xyÖzellikler,
            heatmap: xyÖzellikler,
            contour: xyÖzellikler,
            histogram: xyÖzellikler,
            histogram2d: xyÖzellikler,
            histogram2dcontour: xyÖzellikler,
            scatter3d: xyzÖzellikler,
            surface: xyzÖzellikler,
            mesh3d: xyzÖzellikler,
            scattergl: xyÖzellikler,
            ohlc: xÖzellikler,
            candlestick: xÖzellikler
        },
        layout: {
            calendar: özelliklerOluştur([
                'Grafikte tarihleri yorumlamak ve',
                'göstermek için varsayılan takvim sistemini ayarlar.'
            ].join(' '))
        },
        subplots: {
            xaxis: {calendar: eksenÖzellikler},
            yaxis: {calendar: eksenÖzellikler},
            scene: {
                xaxis: {calendar: eksenÖzellikler},
                yaxis: {calendar: eksenÖzellikler},
                zaxis: {calendar: eksenÖzellikler}
            },
            polar: {
                radialaxis: {calendar: eksenÖzellikler}
            }
        },
        transforms: {
            filter: {
                valuecalendar: özelliklerOluştur([
                    'UYARI: Tüm dönüşümler kullanımdan kaldırılmıştır ve bir sonraki ana sürümde API\'den kaldırılabilir.',
                    '`value` için takvim sistemini ayarlar, eğer bu bir tarih ise.'
                ].join(' ')),
                targetcalendar: özelliklerOluştur([
                    'UYARI: Tüm dönüşümler kullanımdan kaldırılmıştır ve bir sonraki ana sürümde API\'den kaldırılabilir.',
                    '`target` için takvim sistemini ayarlar, eğer bu bir',
                    'tarih dizisi ise. Eğer `target` bir dize ise (örneğin *x*)',
                    'ilgili iz özelliğini kullanırız (örneğin `xcalendar`),',
                    'hatta `targetcalendar` sağlanmış olsa bile.'
                ].join(' '))
            }
        }
    },

    layoutAttributes: özellikler,

    handleDefaults: varsayılanlarıİşle,
    handleTraceDefaults: izVarsayılanlarınıİşle,

    CANONICAL_SUNDAY: KANONİK_PAZAR,
    CANONICAL_TICK: KANONİK_TICK,
    DFLTRANGE: VARSAYILAN_ARALIK,

    getCal: takvimAl,
    worldCalFmt: dünyaTakvimFormatı
};
