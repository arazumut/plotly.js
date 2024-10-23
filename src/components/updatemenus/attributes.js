'use strict';

var fontAttrs = require('../../plots/font_attributes');
var colorAttrs = require('../color/attributes');
var extendFlat = require('../../lib/extend').extendFlat;
var overrideAll = require('../../plot_api/edit_types').overrideAll;
var padAttrs = require('../../plots/pad_attributes');
var templatedArray = require('../../plot_api/plot_template').templatedArray;

var buttonsAttrs = templatedArray('button', {
    visible: {
        valType: 'boolean',
        description: 'Bu düğmenin görünür olup olmadığını belirler.'
    },
    method: {
        valType: 'enumerated',
        values: ['restyle', 'relayout', 'animate', 'update', 'skip'],
        dflt: 'restyle',
        description: [
            'Tıklama üzerine çağrılacak Plotly yöntemini ayarlar.',
            '`skip` yöntemi kullanılırsa, API güncelleme menüsü normal çalışır',
            'ancak hiçbir API çağrısı yapmaz ve otomatik olarak duruma bağlanmaz.',
            'Bu, bir bileşen arayüzü oluşturmak ve güncelleme menüsü olaylarına',
            'JavaScript aracılığıyla manuel olarak bağlanmak için kullanılabilir.'
        ].join(' ')
    },
    args: {
        valType: 'info_array',
        freeLength: true,
        items: [
            {valType: 'any'},
            {valType: 'any'},
            {valType: 'any'}
        ],
        description: [
            'Tıklama üzerine `method` içinde ayarlanan Plotly yöntemine',
            'geçilecek argüman değerlerini ayarlar.'
        ].join(' ')
    },
    args2: {
        valType: 'info_array',
        freeLength: true,
        items: [
            {valType: 'any'},
            {valType: 'any'},
            {valType: 'any'}
        ],
        description: [
            'İkinci bir `args` seti ayarlar,',
            'bu argüman değerleri, bu düğmeye aktif durumda tıklanırken',
            '`method` içinde ayarlanan Plotly yöntemine geçirilir.',
            'Bu, geçiş düğmeleri oluşturmak için kullanılabilir.'
        ].join(' ')
    },
    label: {
        valType: 'string',
        dflt: '',
        description: 'Düğmede görünecek metin etiketini ayarlar.'
    },
    execute: {
        valType: 'boolean',
        dflt: true,
        description: [
            'True olduğunda, API yöntemi yürütülür. False olduğunda, diğer tüm davranışlar aynı kalır',
            've komut yürütme atlanır. Bu, örneğin, `plotly_buttonclicked` yöntemine bağlanırken',
            've API komutunu manuel olarak yürütürken, `method` ve `args` belirtimi aracılığıyla',
            'grafiğin durumuna otomatik olarak bağlanmanın avantajını kaybetmeden faydalı olabilir.'
        ].join(' ')
    }
});

module.exports = overrideAll(templatedArray('updatemenu', {
    _arrayAttrRegexps: [/^updatemenus\[(0|[1-9][0-9]+)\]\.buttons/],

    visible: {
        valType: 'boolean',
        description: [
            'Güncelleme menüsünün görünür olup olmadığını belirler.'
        ].join(' ')
    },

    type: {
        valType: 'enumerated',
        values: ['dropdown', 'buttons'],
        dflt: 'dropdown',
        description: [
            'Düğmelerin bir açılır menü aracılığıyla mı erişilebilir olduğunu',
            'yoksa düğmelerin yatay veya dikey olarak mı yığıldığını belirler.'
        ].join(' ')
    },

    direction: {
        valType: 'enumerated',
        values: ['left', 'right', 'up', 'down'],
        dflt: 'down',
        description: [
            'Düğmelerin bir açılır menüde veya bir düğme satırında/sütununda',
            'hangi yönde yerleştirileceğini belirler. `left` ve `up` için,',
            'düğmeler yine de sırasıyla soldan sağa veya yukarıdan aşağıya',
            'doğru görünür.'
        ].join(' ')
    },

    active: {
        valType: 'integer',
        min: -1,
        dflt: 0,
        description: [
            'Hangi düğmenin (0\'dan başlayarak indeks ile) aktif olarak',
            'kabul edildiğini belirler.'
        ].join(' ')
    },

    showactive: {
        valType: 'boolean',
        dflt: true,
        description: 'True ise aktif açılır menü öğesini veya aktif düğmeyi vurgular.'
    },

    buttons: buttonsAttrs,

    x: {
        valType: 'number',
        min: -2,
        max: 3,
        dflt: -0.05,
        description: 'Güncelleme menüsünün x konumunu (normalize edilmiş koordinatlarda) ayarlar.'
    },
    xanchor: {
        valType: 'enumerated',
        values: ['auto', 'left', 'center', 'right'],
        dflt: 'right',
        description: [
            'Güncelleme menüsünün yatay konum çapasını ayarlar.',
            'Bu çapa, `x` konumunu *sol*, *orta* veya *sağ*',
            'aralık seçicisine bağlar.'
        ].join(' ')
    },
    y: {
        valType: 'number',
        min: -2,
        max: 3,
        dflt: 1,
        description: 'Güncelleme menüsünün y konumunu (normalize edilmiş koordinatlarda) ayarlar.'
    },
    yanchor: {
        valType: 'enumerated',
        values: ['auto', 'top', 'middle', 'bottom'],
        dflt: 'top',
        description: [
            'Güncelleme menüsünün dikey konum çapasını ayarlar.',
            'Bu çapa, `y` konumunu *üst*, *orta* veya *alt*',
            'aralık seçicisine bağlar.'
        ].join(' ')
    },

    pad: extendFlat(padAttrs({editType: 'arraydraw'}), {
        description: 'Düğmelerin veya açılır menünün etrafındaki dolguyu ayarlar.'
    }),

    font: fontAttrs({
        description: 'Güncelleme menüsü düğme metninin yazı tipini ayarlar.'
    }),

    bgcolor: {
        valType: 'color',
        description: 'Güncelleme menüsü düğmelerinin arka plan rengini ayarlar.'
    },
    bordercolor: {
        valType: 'color',
        dflt: colorAttrs.borderLine,
        description: 'Güncelleme menüsünü çevreleyen sınırın rengini ayarlar.'
    },
    borderwidth: {
        valType: 'number',
        min: 0,
        dflt: 1,
        editType: 'arraydraw',
        description: 'Güncelleme menüsünü çevreleyen sınırın genişliğini (px cinsinden) ayarlar.'
    }
}), 'arraydraw', 'from-root');
