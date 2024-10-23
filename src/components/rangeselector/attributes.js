'use strict';

var fontAttrs = require('../../plots/font_attributes');
var colorAttrs = require('../color/attributes');
var templatedArray = require('../../plot_api/plot_template').templatedArray;

var buttonAttrs = templatedArray('button', {
    visible: {
        valType: 'boolean',
        dflt: true,
        editType: 'plot',
        description: 'Bu düğmenin görünür olup olmadığını belirler.'
    },
    step: {
        valType: 'enumerated',
        values: ['month', 'year', 'day', 'hour', 'minute', 'second', 'all'],
        dflt: 'month',
        editType: 'plot',
        description: 'Aralığı belirlemek için `count` değerinin ayarlanacağı ölçü birimi.'
    },
    stepmode: {
        valType: 'enumerated',
        values: ['backward', 'todate'],
        dflt: 'backward',
        editType: 'plot',
        description: [
            'Aralık güncelleme modunu ayarlar.',
            '*backward* ise, aralık güncellemesi aralığın başlangıcını',
            '*count* kez *step* milisaniye geri kaydırır.',
            '*todate* ise, aralık güncellemesi aralığın başlangıcını',
            'ilk zaman damgasına geri kaydırır.',
            'Örneğin, `step` *year* ve `count` *1* olarak ayarlandığında',
            'aralık güncellemesi aralığın başlangıcını',
            'mevcut yılın 01 Ocak tarihine geri kaydırır.',
            'Ay ve yıl *todate* şu anda yalnızca',
            'yerleşik (Gregoryen) takvim için kullanılabilir.'
        ].join(' ')
    },
    count: {
        valType: 'number',
        min: 0,
        dflt: 1,
        editType: 'plot',
        description: [
            'Aralığı güncellemek için kaç adım atılacağını ayarlar.',
            'Güncelleme aralığını belirtmek için `step` ile kullanın.'
        ].join(' ')
    },
    label: {
        valType: 'string',
        editType: 'plot',
        description: 'Düğmede görünecek metin etiketini ayarlar.'
    },
    editType: 'plot',
    description: [
        'Her düğme için özellikleri ayarlar.',
        'Varsayılan olarak, bir aralık seçici düğmesiz gelir.'
    ].join(' ')
});

module.exports = {
    visible: {
        valType: 'boolean',
        editType: 'plot',
        description: [
            'Bu aralık seçicinin görünür olup olmadığını belirler.',
            'Aralık seçicilerin yalnızca x eksenleri için mevcut olduğunu unutmayın,',
            '`type` *date* olarak ayarlanmış veya otomatik olarak ayarlanmış.'
        ].join(' ')
    },

    buttons: buttonAttrs,

    x: {
        valType: 'number',
        min: -2,
        max: 3,
        editType: 'plot',
        description: 'Aralık seçicinin x konumunu (normalize edilmiş koordinatlarda) ayarlar.'
    },
    xanchor: {
        valType: 'enumerated',
        values: ['auto', 'left', 'center', 'right'],
        dflt: 'left',
        editType: 'plot',
        description: [
            'Aralık seçicinin yatay konum çapasını ayarlar.',
            'Bu çapa, `x` konumunu aralık seçicinin *left*, *center*',
            'veya *right* kısmına bağlar.'
        ].join(' ')
    },
    y: {
        valType: 'number',
        min: -2,
        max: 3,
        editType: 'plot',
        description: 'Aralık seçicinin y konumunu (normalize edilmiş koordinatlarda) ayarlar.'
    },
    yanchor: {
        valType: 'enumerated',
        values: ['auto', 'top', 'middle', 'bottom'],
        dflt: 'bottom',
        editType: 'plot',
        description: [
            'Aralık seçicinin dikey konum çapasını ayarlar.',
            'Bu çapa, `y` konumunu aralık seçicinin *top*, *middle*',
            'veya *bottom* kısmına bağlar.'
        ].join(' ')
    },

    font: fontAttrs({
        editType: 'plot',
        description: 'Aralık seçici düğme metninin yazı tipini ayarlar.'
    }),

    bgcolor: {
        valType: 'color',
        dflt: colorAttrs.lightLine,
        editType: 'plot',
        description: 'Aralık seçici düğmelerinin arka plan rengini ayarlar.'
    },
    activecolor: {
        valType: 'color',
        editType: 'plot',
        description: 'Aktif aralık seçici düğmesinin arka plan rengini ayarlar.'
    },
    bordercolor: {
        valType: 'color',
        dflt: colorAttrs.defaultLine,
        editType: 'plot',
        description: 'Aralık seçiciyi çevreleyen kenarlığın rengini ayarlar.'
    },
    borderwidth: {
        valType: 'number',
        min: 0,
        dflt: 0,
        editType: 'plot',
        description: 'Aralık seçiciyi çevreleyen kenarlığın genişliğini (px cinsinden) ayarlar.'
    },
    editType: 'plot'
};
