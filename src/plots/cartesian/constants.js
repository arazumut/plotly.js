'use strict';

// Gerekli modülleri yükle
var counterRegex = require('../../lib/regex').counter;

module.exports = {
    // ID düzenli ifadeleri
    idRegex: {
        x: counterRegex('x', '( domain)?'),
        y: counterRegex('y', '( domain)?')
    },

    // Özellik düzenli ifadeleri
    attrRegex: counterRegex('[xy]axis'),

    // Eksen eşleşme düzenli ifadeleri
    xAxisMatch: counterRegex('xaxis'),
    yAxisMatch: counterRegex('yaxis'),

    // Eksen kimlikleri ve isimleri için desenler
    // Bu, counterRegex'den daha izin vericidir çünkü
    // id2name, name2id ve cleanId "x1" gibi değerleri kabul eder
    AX_ID_PATTERN: /^[xyz][0-9]*( domain)?$/,
    AX_NAME_PATTERN: /^[xyz]axis[0-9]*$/,

    // 2D alt grafikler için desen
    SUBPLOT_PATTERN: /^x([0-9]*)y([0-9]*)$/,

    // Saat ve hafta günü desenleri
    HOUR_PATTERN: 'saat',
    WEEKDAY_PATTERN: 'haftanın günü',

    // Fareyi başlangıç noktasına sabitlemeden önce hareket ettirilecek piksel sayısı
    MINDRAG: 8,

    // Bir yakınlaştırma kutusu için izin verilen en küçük boyut
    MINZOOM: 20,

    // Eksen sürükleme bölgelerinin genişliği
    DRAGGERSIZE: 20,

    // Pürüzsüz kaydırma ve yakınlaştırmadan sonra yeniden çizim (yeniden yerleştirme) gecikmesi
    REDRAWDELAY: 50,

    // Veri yoksa x ve y eksenleri için son çare eksen aralıkları
    DFLTRANGEX: [-1, 6],
    DFLTRANGEY: [-1, 4],

    // İz türlerini doğru sırada tutmak için katmanlar
    // N.B. her 'benzersiz' çizim yöntemi kendi katmanına sahip olmalıdır
    traceLayerClasses: [
        'imagelayer',
        'heatmaplayer',
        'contourcarpetlayer', 'contourlayer',
        'funnellayer', 'waterfalllayer', 'barlayer',
        'carpetlayer',
        'violinlayer',
        'boxlayer',
        'ohlclayer',
        'scattercarpetlayer', 'scatterlayer'
    ],

    // Eksen üzerinde kesme işlemi yanlış olan katmanlar
    clipOnAxisFalseQuery: [
        '.scatterlayer',
        '.barlayer',
        '.funnellayer',
        '.waterfalllayer'
    ],

    // Katman değerlerini katman sınıflarına eşleştir
    layerValue2layerClass: {
        'izlerin üstünde': 'above',
        'izlerin altında': 'below'
    },

    // Kartezyen alt grafiklerin zindex'i için ayırıcı
    zindexSeparator: 'z', // örneğin xy, xyz2, xyz3, vb.
};
