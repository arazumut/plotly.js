'use strict';

var fontAttrs = require('../../plots/font_attributes');
var padAttrs = require('../../plots/pad_attributes');
var extendDeepAll = require('../../lib/extend').extendDeepAll;
var overrideAll = require('../../plot_api/edit_types').overrideAll;
var animationAttrs = require('../../plots/animation_attributes');
var templatedArray = require('../../plot_api/plot_template').templatedArray;
var constants = require('./constants');

var adimOzellikleri = templatedArray('adim', {
    gorunur: {
        valType: 'boolean',
        dflt: true,
        description: [
            'Bu adımın kaydırıcıya dahil edilip edilmediğini belirler.'
        ].join(' ')
    },
    metod: {
        valType: 'enumerated',
        values: ['restyle', 'relayout', 'animate', 'update', 'skip'],
        dflt: 'restyle',
        description: [
            'Kaydırıcı değeri değiştirildiğinde çağrılacak Plotly metodunu ayarlar.',
            '`skip` metodu kullanılırsa, API kaydırıcısı normal çalışır',
            'ancak API çağrıları yapmaz ve duruma otomatik olarak bağlanmaz.',
            'Bu, bir bileşen arayüzü oluşturmak ve kaydırıcı olaylarına manuel olarak',
            'JavaScript ile bağlanmak için kullanılabilir.'
        ].join(' ')
    },
    argumanlar: {
        valType: 'info_array',
        freeLength: true,
        items: [
            { valType: 'any' },
            { valType: 'any' },
            { valType: 'any' }
        ],
        description: [
            'Kaydırıcıda belirlenen `metod`a geçilecek argüman değerlerini ayarlar.'
        ].join(' ')
    },
    etiket: {
        valType: 'string',
        description: 'Kaydırıcıda görünecek metin etiketini ayarlar'
    },
    deger: {
        valType: 'string',
        description: [
            'Kaydırıcı adımının değerini ayarlar, programatik olarak adı geçer.',
            'Sağlanmazsa, kaydırıcı etiketi varsayılan olarak kullanılır.'
        ].join(' ')
    },
    calistir: {
        valType: 'boolean',
        dflt: true,
        description: [
            'Doğru olduğunda, API metodu çalıştırılır. Yanlış olduğunda, diğer tüm davranışlar aynı kalır',
            've komut yürütme atlanır. Bu, örneğin `plotly_sliderchange` metoduna bağlanırken ve',
            'API komutunu manuel olarak çalıştırırken kaydırıcının duruma otomatik olarak bağlanma',
            'faydasını kaybetmeden kullanılabilir.'
        ].join(' ')
    }
});

module.exports = overrideAll(templatedArray('kaydirici', {
    gorunur: {
        valType: 'boolean',
        dflt: true,
        description: [
            'Kaydırıcının görünür olup olmadığını belirler.'
        ].join(' ')
    },

    aktif: {
        valType: 'number',
        min: 0,
        dflt: 0,
        description: [
            'Hangi düğmenin (0\'dan başlayarak indeks ile) aktif olarak kabul edildiğini belirler.'
        ].join(' ')
    },

    adimlar: adimOzellikleri,

    uzunlukModu: {
        valType: 'enumerated',
        values: ['fraction', 'pixels'],
        dflt: 'fraction',
        description: [
            'Bu kaydırıcı uzunluğunun',
            'grafik *kesir* birimlerinde mi yoksa *piksel* birimlerinde mi ayarlandığını belirler.',
            'Değeri ayarlamak için `uzunluk` kullanın.'
        ].join(' ')
    },
    uzunluk: {
        valType: 'number',
        min: 0,
        dflt: 1,
        description: [
            'Kaydırıcının uzunluğunu ayarlar.',
            'Bu ölçüm, her iki ucun dolgusunu hariç tutar.',
            'Yani, kaydırıcının uzunluğu bu uzunluktan her iki ucun dolgusunun çıkarılmasıyla elde edilir.'
        ].join(' ')
    },
    x: {
        valType: 'number',
        min: -2,
        max: 3,
        dflt: 0,
        description: 'Kaydırıcının x pozisyonunu (normalize edilmiş koordinatlarda) ayarlar.'
    },
    dolgu: extendDeepAll(padAttrs({editType: 'arraydraw'}), {
        description: 'Kaydırıcı bileşeninin her bir kenarındaki dolgu miktarını ayarlar.'
    }, {t: {dflt: 20}}),
    xankoru: {
        valType: 'enumerated',
        values: ['auto', 'left', 'center', 'right'],
        dflt: 'left',
        description: [
            'Kaydırıcının yatay pozisyon ankrajını ayarlar.',
            'Bu ankraj, `x` pozisyonunu *sol*, *orta*',
            'veya *sağ* ile bağlar.'
        ].join(' ')
    },
    y: {
        valType: 'number',
        min: -2,
        max: 3,
        dflt: 0,
        description: 'Kaydırıcının y pozisyonunu (normalize edilmiş koordinatlarda) ayarlar.'
    },
    yankoru: {
        valType: 'enumerated',
        values: ['auto', 'top', 'middle', 'bottom'],
        dflt: 'top',
        description: [
            'Kaydırıcının dikey pozisyon ankrajını ayarlar.',
            'Bu ankraj, `y` pozisyonunu *üst*, *orta*',
            'veya *alt* ile bağlar.'
        ].join(' ')
    },

    gecis: {
        sure: {
            valType: 'number',
            min: 0,
            dflt: 150,
            description: 'Kaydırıcı geçişinin süresini ayarlar'
        },
        yumuşatma: {
            valType: 'enumerated',
            values: animationAttrs.transition.easing.values,
            dflt: 'cubic-in-out',
            description: 'Kaydırıcı geçişinin yumuşatma fonksiyonunu ayarlar'
        }
    },

    mevcutDeger: {
        gorunur: {
            valType: 'boolean',
            dflt: true,
            description: [
                'Kaydırıcının üzerinde şu anda seçili olan değeri gösterir.'
            ].join(' ')
        },

        xankoru: {
            valType: 'enumerated',
            values: ['left', 'center', 'right'],
            dflt: 'left',
            description: [
                'Değer okumasının kaydırıcının uzunluğuna göre hizalanmasını ayarlar.'
            ].join(' ')
        },

        ofset: {
            valType: 'number',
            dflt: 10,
            description: [
                'Mevcut değer etiketi ile kaydırıcı arasındaki boşluk miktarını (piksel cinsinden) ayarlar.'
            ].join(' ')
        },

        onek: {
            valType: 'string',
            description: 'Mevcut değer görünür olduğunda, bu etiketi önek olarak ayarlar.'
        },

        sonek: {
            valType: 'string',
            description: 'Mevcut değer görünür olduğunda, bu etiketi sonek olarak ayarlar.'
        },

        font: fontAttrs({
            description: 'Mevcut değer etiketi metninin yazı tipini ayarlar.'
        })
    },

    font: fontAttrs({
        description: 'Kaydırıcı adım etiketlerinin yazı tipini ayarlar.'
    }),

    aktifArkaPlanRengi: {
        valType: 'color',
        dflt: constants.gripBgActiveColor,
        description: [
            'Kaydırıcı tutamacının arka plan rengini ayarlar',
            'sürüklerken.'
        ].join(' ')
    },
    arkaPlanRengi: {
        valType: 'color',
        dflt: constants.railBgColor,
        description: 'Kaydırıcının arka plan rengini ayarlar.'
    },
    kenarRengi: {
        valType: 'color',
        dflt: constants.railBorderColor,
        description: 'Kaydırıcıyı çevreleyen kenarın rengini ayarlar.'
    },
    kenarGenisligi: {
        valType: 'number',
        min: 0,
        dflt: constants.railBorderWidth,
        description: 'Kaydırıcıyı çevreleyen kenarın genişliğini (px cinsinden) ayarlar.'
    },
    cizgiUzunlugu: {
        valType: 'number',
        min: 0,
        dflt: constants.tickLength,
        description: 'Adım işaretlerinin uzunluğunu piksel cinsinden ayarlar'
    },
    cizgiRengi: {
        valType: 'color',
        dflt: constants.tickColor,
        description: 'Kaydırıcıyı çevreleyen kenarın rengini ayarlar.'
    },
    cizgiGenisligi: {
        valType: 'number',
        min: 0,
        dflt: 1,
        description: 'Çizgi genişliğini (px cinsinden) ayarlar.'
    },
    kucukCizgiUzunlugu: {
        valType: 'number',
        min: 0,
        dflt: constants.minorTickLength,
        description: 'Küçük adım işaretlerinin uzunluğunu piksel cinsinden ayarlar'
    }
}), 'arraydraw', 'from-root');
