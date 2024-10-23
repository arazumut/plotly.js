'use strict';

var eksenOzellikleri = require('../../plots/cartesian/layout_attributes');
var yazıTipiOzellikleri = require('../../plots/font_attributes');
var extendFlat = require('../../lib/extend').extendFlat;
var overrideAll = require('../../plot_api/edit_types').overrideAll;

module.exports = overrideAll({
    yön: {
        valType: 'enumerated',
        values: ['h', 'v'],
        dflt: 'v',
        description: 'Renk çubuğunun yönünü ayarlar.'
    },
    kalinlikModu: {
        valType: 'enumerated',
        values: ['fraction', 'pixels'],
        dflt: 'pixels',
        description: [
            'Bu renk çubuğunun kalınlığının',
            '(yani sabit renk yönündeki ölçü)',
            'grafik *kesir* birimlerinde mi yoksa *piksel* birimlerinde mi ayarlandığını belirler.',
            'Değeri ayarlamak için `kalinlik` kullanın.'
        ].join(' ')
    },
    kalinlik: {
        valType: 'number',
        min: 0,
        dflt: 30,
        description: [
            'Renk çubuğunun kalınlığını ayarlar.',
            'Bu ölçü, dolgu, işaretler ve etiketlerin boyutunu içermez.'
        ].join(' ')
    },
    uzunlukModu: {
        valType: 'enumerated',
        values: ['fraction', 'pixels'],
        dflt: 'fraction',
        description: [
            'Bu renk çubuğunun uzunluğunun',
            '(yani renk değişim yönündeki ölçü)',
            'grafik *kesir* birimlerinde mi yoksa *piksel* birimlerinde mi ayarlandığını belirler.',
            'Değeri ayarlamak için `uzunluk` kullanın.'
        ].join(' ')
    },
    uzunluk: {
        valType: 'number',
        min: 0,
        dflt: 1,
        description: [
            'Renk çubuğunun uzunluğunu ayarlar.',
            'Bu ölçü, her iki ucun dolgusunu içermez.',
            'Yani, renk çubuğu uzunluğu bu uzunluk eksi her iki uçtaki dolgudur.'
        ].join(' ')
    },
    x: {
        valType: 'number',
        description: [
            'Renk çubuğunun `xref`e göre x konumunu ayarlar (grafik kesirinde).',
            '`xref` *kağıt* olduğunda, `yön` *v* olduğunda varsayılan olarak 1.02 ve',
            '`yön` *h* olduğunda 0.5 olur.',
            '`xref` *konteyner* olduğunda, `yön` *v* olduğunda varsayılan olarak *1* ve',
            '`yön` *h* olduğunda 0.5 olur.',
            '`xref` *konteyner* ise *0* ile *1* arasında olmalı',
            've `xref` *kağıt* ise *-2* ile *3* arasında olmalıdır.'
        ].join(' ')
    },
    xref: {
        valType: 'enumerated',
        dflt: 'paper',
        values: ['container', 'paper'],
        editType: 'layoutstyle',
        description: [
            '`x`in atıfta bulunduğu konteyneri ayarlar.',
            '*konteyner* grafiğin tüm *genişliğini* kapsar.',
            '*kağıt* yalnızca çizim alanının genişliğine atıfta bulunur.'
        ].join(' ')
    },
    xankoru: {
        valType: 'enumerated',
        values: ['left', 'center', 'right'],
        description: [
            'Bu renk çubuğunun yatay konum çapasını ayarlar.',
            'Bu çapa, `x` konumunu renk çubuğunun *sol*, *orta*',
            'veya *sağ* kısmına bağlar.',
            '`yön` *v* olduğunda varsayılan olarak *sol* ve',
            '`yön` *h* olduğunda *orta* olur.'
        ].join(' ')
    },
    xdolgu: {
        valType: 'number',
        min: 0,
        dflt: 10,
        description: 'x yönünde dolgu miktarını (px cinsinden) ayarlar.'
    },
    y: {
        valType: 'number',
        description: [
            'Renk çubuğunun `yref`e göre y konumunu ayarlar (grafik kesirinde).',
            '`yref` *kağıt* olduğunda, `yön` *v* olduğunda varsayılan olarak 0.5 ve',
            '`yön` *h* olduğunda 1.02 olur.',
            '`yref` *konteyner* olduğunda, `yön` *v* olduğunda varsayılan olarak 0.5 ve',
            '`yön` *h* olduğunda 1 olur.',
            '`yref` *konteyner* ise *0* ile *1* arasında olmalı',
            've `yref` *kağıt* ise *-2* ile *3* arasında olmalıdır.'
        ].join(' ')
    },
    yref: {
        valType: 'enumerated',
        dflt: 'paper',
        values: ['container', 'paper'],
        editType: 'layoutstyle',
        description: [
            '`y`in atıfta bulunduğu konteyneri ayarlar.',
            '*konteyner* grafiğin tüm *yüksekliğini* kapsar.',
            '*kağıt* yalnızca çizim alanının yüksekliğine atıfta bulunur.'
        ].join(' '),
    },
    yankoru: {
        valType: 'enumerated',
        values: ['top', 'middle', 'bottom'],
        description: [
            'Bu renk çubuğunun dikey konum çapasını ayarlar.',
            'Bu çapa, `y` konumunu renk çubuğunun *üst*, *orta*',
            'veya *alt* kısmına bağlar.',
            '`yön` *v* olduğunda varsayılan olarak *orta* ve',
            '`yön` *h* olduğunda *alt* olur.'
        ].join(' ')
    },
    ydolgu: {
        valType: 'number',
        min: 0,
        dflt: 10,
        description: 'y yönünde dolgu miktarını (px cinsinden) ayarlar.'
    },
    // Çubuğun kendisinin etrafındaki olası bir çizgi
    dışÇizgiRengi: eksenOzellikleri.linecolor,
    dışÇizgiGenişliği: eksenOzellikleri.linewidth,
    // DışÇizgiGenişliği {dflt: 0} olmalı mı?
    // Dolgu ve işaret etiketlerinin dışındaki olası başka bir çizgi
    kenarRengi: eksenOzellikleri.linecolor,
    kenarGenişliği: {
        valType: 'number',
        min: 0,
        dflt: 0,
        description: [
            'Bu renk çubuğunu çevreleyen kenarın genişliğini (px cinsinden) ayarlar.'
        ].join(' ')
    },
    arkaPlanRengi: {
        valType: 'color',
        dflt: 'rgba(0,0,0,0)',
        description: 'Dolgu alanının rengini ayarlar.'
    },
    // İşaret ve başlık özellikleri eksenlerdeki gibi adlandırılır ve işlev görür
    işaretModu: eksenOzellikleri.minor.tickmode,
    işaretSayısı: eksenOzellikleri.nticks,
    işaret0: eksenOzellikleri.tick0,
    işaretAralığı: eksenOzellikleri.dtick,
    işaretDeğerleri: eksenOzellikleri.tickvals,
    işaretMetni: eksenOzellikleri.ticktext,
    işaretler: extendFlat({}, eksenOzellikleri.ticks, {dflt: ''}),
    işaretEtiketTaşması: extendFlat({}, eksenOzellikleri.ticklabeloverflow, {
        description: [
            'Grafik divini veya eksenin alanını aşacak işaret etiketlerini nasıl ele alacağımızı belirler.',
            'İç işaret etiketleri için varsayılan değer *alanın dışına gizle* dir.',
            'Diğer durumlarda varsayılan değer *divin dışına gizle* dir.'
        ].join(' ')
    }),

    // işaretEtiketKonumu: doğrudan kullanılmaz, çünkü değerler yöne bağlıdır
    // sol/sağ seçenekleri x eksenleri için, üst/alt seçenekleri y eksenleri içindir
    işaretEtiketKonumu: {
        valType: 'enumerated',
        values: [
            'dışarıda', 'içeride',
            'dışarıda üst', 'içeride üst',
            'dışarıda sol', 'içeride sol',
            'dışarıda sağ', 'içeride sağ',
            'dışarıda alt', 'içeride alt'
        ],
        dflt: 'dışarıda',
        description: [
            'İşaret etiketlerinin işaretlere göre nerede çizileceğini belirler.',
            'Sol ve sağ seçenekler `yön` *h* olduğunda kullanılır,',
            'üst ve alt seçenekler `yön` *v* olduğunda kullanılır.'
        ].join(' ')
    },

    işaretUzunluğu: eksenOzellikleri.ticklen,
    işaretGenişliği: eksenOzellikleri.tickwidth,
    işaretRengi: eksenOzellikleri.tickcolor,
    işaretEtiketAdımı: eksenOzellikleri.ticklabelstep,
    işaretEtiketleriniGöster: eksenOzellikleri.showticklabels,
    etiketTakmaAdı: eksenOzellikleri.labelalias,
    işaretYazıTipi: yazıTipiOzellikleri({
        description: 'Renk çubuğunun işaret etiketi yazı tipini ayarlar'
    }),
    işaretAçısı: eksenOzellikleri.tickangle,
    işaretFormatı: eksenOzellikleri.tickformat,
    işaretFormatDurakları: eksenOzellikleri.tickformatstops,
    işaretÖneki: eksenOzellikleri.tickprefix,
    işaretÖnekiniGöster: eksenOzellikleri.showtickprefix,
    işaretSoneki: eksenOzellikleri.ticksuffix,
    işaretSonekiniGöster: eksenOzellikleri.showticksuffix,
    binlerceAyır: eksenOzellikleri.separatethousands,
    üsFormatı: eksenOzellikleri.exponentformat,
    minÜs: eksenOzellikleri.minexponent,
    üsGöster: eksenOzellikleri.showexponent,
    başlık: {
        metin: {
            valType: 'string',
            description: 'Renk çubuğunun başlığını ayarlar.'
        },
        yazıTipi: yazıTipiOzellikleri({
            description: 'Bu renk çubuğunun başlık yazı tipini ayarlar.'
        }),
        taraf: {
            valType: 'enumerated',
            values: ['sağ', 'üst', 'alt'],
            description: [
                'Renk çubuğunun başlığının konumunu belirler.',
                '`yön` *v* olduğunda varsayılan olarak *üst* ve',
                '`yön` *h* olduğunda varsayılan olarak *sağ* olur.'
            ].join(' ')
        }
    },
}, 'renkCubuklari', 'kökten');
