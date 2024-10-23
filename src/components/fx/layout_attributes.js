'use strict';

var constants = require('./constants');
var fontAttrs = require('../../plots/font_attributes');

var font = fontAttrs({
    editType: 'none',
    description: 'Grafikteki tüm izler tarafından kullanılan varsayılan hover etiket yazı tipini ayarlar.'
});
font.family.dflt = constants.HOVERFONT;
font.size.dflt = constants.HOVERFONTSIZE;

module.exports = {
    clickmode: {
        valType: 'flaglist',
        flags: ['event', 'select'],
        dflt: 'event',
        editType: 'plot',
        extras: ['none'],
        description: [
            'Tek tıklama etkileşimlerinin modunu belirler.',
            '*event* varsayılan değerdir ve `plotly_click` olayını yayar.',
            'Ek olarak bu mod, *lasso* ve *select* sürükleme modlarında `plotly_selected` olayını yayar,',
            'ancak olay verisi eklenmeden (uyumluluk nedenleriyle saklanır).',
            '*select* bayrağı, tek veri noktalarını tıklama ile seçmeyi etkinleştirir.',
            'Bu mod ayrıca kalıcı seçimleri destekler, yani Shift tuşuna basarak tıklamak,',
            'mevcut bir seçime ekler veya çıkarır. *select* ile `hovermode`: *x* kafa karıştırıcı olabilir,',
            '`hovermode`: *closest* olarak açıkça ayarlamayı düşünün.',
            'Seçim olayları, *event* bayrağı da ayarlandığı sürece uygun şekilde gönderilir.',
            '*event* bayrağı eksik olduğunda, `plotly_click` ve `plotly_selected` olayları yayılmaz.'
        ].join(' ')
    },
    dragmode: {
        valType: 'enumerated',
        values: [
            'zoom',
            'pan',
            'select',
            'lasso',
            'drawclosedpath',
            'drawopenpath',
            'drawline',
            'drawrect',
            'drawcircle',
            'orbit',
            'turntable',
            false
        ],
        dflt: 'zoom',
        editType: 'modebar',
        description: [
            'Sürükleme etkileşimlerinin modunu belirler.',
            '*select* ve *lasso* sadece işaretleyiciler veya metin içeren scatter izlerine uygulanır.',
            '*orbit* ve *turntable* sadece 3D sahnelere uygulanır.'
        ].join(' ')
    },
    hovermode: {
        valType: 'enumerated',
        values: ['x', 'y', 'closest', false, 'x unified', 'y unified'],
        dflt: 'closest',
        editType: 'modebar',
        description: [
            'Hover etkileşimlerinin modunu belirler.',
            '*closest* ise, `hoverdistance` içindeki *en yakın* nokta için tek bir hover etiketi görünür.',
            '*x* (veya *y*) ise, `hoverdistance` içindeki *en yakın* x- (veya y-) koordinatındaki',
            'birden fazla nokta için birden fazla hover etiketi görünür, ancak iz başına en fazla bir hover etiketi görünür.',
            '*x unified* (veya *y unified*) ise, `hoverdistance` içindeki en yakın x- (veya y-) koordinatındaki',
            'birden fazla nokta için tek bir hover etiketi görünür, ancak iz başına en fazla bir hover etiketi görünür.',
            'Bu modda, belirtilen eksene dik olarak spikelines varsayılan olarak etkinleştirilir.',
            'False ise, hover etkileşimleri devre dışı bırakılır.'
        ].join(' ')
    },
    hoversubplots: {
        valType: 'enumerated',
        values: ['single', 'overlaying', 'axis'],
        dflt: 'overlaying',
        editType: 'none',
        description: [
            'Hover efektlerinin diğer alt grafiklere genişlemesini belirler.',
            '*single* ise, sadece birincil noktanın eksen çifti dahil edilir, üst üste binen alt grafikler olmadan.',
            '*overlaying* ise, ana ekseni kullanan ve aynı alanı kaplayan tüm alt grafikler dahil edilir.',
            '*axis* ise, `hovermode` *x*, *x unified*, *y* veya *y unified* olarak ayarlandığında aynı ekseni kullanan',
            'üst üste binen alt grafikler de dahil edilir.'
        ].join(' ')
    },
    hoverdistance: {
        valType: 'integer',
        min: -1,
        dflt: 20,
        editType: 'none',
        description: [
            'Veri eklemek için varsayılan mesafeyi (piksel cinsinden) ayarlar',
            'hover etiketlerine (-1 kesme yok, 0 veri arama yok anlamına gelir).',
            'Bu, nokta benzeri nesneler üzerinde hover için gerçek bir mesafedir,',
            'örneğin scatter noktaları gibi. Alan benzeri nesneler (çubuklar, scatter doldurmaları, vb.) için',
            'hover alanın içinde ve dışında kapalıdır, ancak bu nesneler',
            'çakışma durumunda nokta benzeri nesneler üzerinde hover yapmayı geçersiz kılmaz.'
        ].join(' ')
    },
    spikedistance: {
        valType: 'integer',
        min: -1,
        dflt: -1,
        editType: 'none',
        description: [
            'Veri çizmek için varsayılan mesafeyi (piksel cinsinden) ayarlar',
            'spikelines (-1 kesme yok, 0 veri arama yok anlamına gelir).',
            'Hoverdistance ile olduğu gibi, mesafe alan benzeri nesnelere uygulanmaz.',
            'Ek olarak, bazı nesneler hover yapılabilir ancak spikelines oluşturmaz,',
            'örneğin scatter doldurmaları gibi.'
        ].join(' ')
    },
    hoverlabel: {
        bgcolor: {
            valType: 'color',
            editType: 'none',
            description: [
                'Grafikteki tüm hover etiketlerinin arka plan rengini ayarlar.'
            ].join(' ')
        },
        bordercolor: {
            valType: 'color',
            editType: 'none',
            description: [
                'Grafikteki tüm hover etiketlerinin kenar rengini ayarlar.'
            ].join(' ')
        },
        font: font,
        grouptitlefont: fontAttrs({
            editType: 'none',
            description: [
                'Hover (birleştirilmiş modlar) grup başlıkları için yazı tipini ayarlar.',
                'Varsayılan olarak `hoverlabel.font` kullanılır.'
            ].join(' ')
        }),
        align: {
            valType: 'enumerated',
            values: ['left', 'right', 'auto'],
            dflt: 'auto',
            editType: 'none',
            description: [
                'Hover etiket kutusu içindeki metin içeriğinin yatay hizalamasını ayarlar.',
                'Sadece hover etiketi metni iki veya daha fazla satır içeriyorsa etkili olur.'
            ].join(' ')
        },
        namelength: {
            valType: 'integer',
            min: -1,
            dflt: 15,
            editType: 'none',
            description: [
                'Tüm izler için hover etiketlerindeki iz adının varsayılan uzunluğunu (karakter sayısı olarak) ayarlar.',
                '-1, uzunluğa bakılmaksızın tüm adı gösterir. 0-3, ilk 0-3 karakteri gösterir ve',
                '3\'ten büyük bir tamsayı, adın tamamını gösterir, ancak daha uzunsa,',
                '`namelength - 3` karaktere kısaltır ve bir elips ekler.'
            ].join(' ')
        },
        editType: 'none'
    },
    selectdirection: {
        valType: 'enumerated',
        values: ['h', 'v', 'd', 'any'],
        dflt: 'any',
        description: [
            '`dragmode` *select* olarak ayarlandığında, sürükleme seçimini',
            'yatay, dikey veya çapraz olarak sınırlar. *h* sadece yatay seçime izin verir,',
            '*v* sadece dikey, *d* sadece çapraz ve *any* sınır koymaz.'
        ].join(' '),
        editType: 'none'
    }
};
