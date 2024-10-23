'use strict';

// Gerekli modülleri dahil et
var annAttrs = require('../annotations/attributes');
var scatterLineAttrs = require('../../traces/scatter/attributes').line;
var dash = require('../drawing/attributes').dash;
var extendFlat = require('../../lib/extend').extendFlat;
var overrideAll = require('../../plot_api/edit_types').overrideAll;
var templatedArray = require('../../plot_api/plot_template').templatedArray;
var axisPlaceableObjs = require('../../constants/axis_placeable_objects');

// Seçim özelliklerini tanımla ve dışa aktar
module.exports = overrideAll(templatedArray('selection', {
    type: {
        valType: 'enumerated',
        values: ['rect', 'path'],
        description: [
            'Çizilecek seçim türünü belirtir.',
            'Eğer *rect* ise, bir dikdörtgen çizilir ve',
            '(`x0`,`y0`), (`x1`,`y0`), (`x1`,`y1`) ve (`x0`,`y1`) noktalarını birleştirir.',
            'Eğer *path* ise, `path` kullanarak özel bir SVG yolu çizer.'
        ].join(' ')
    },

    xref: extendFlat({}, annAttrs.xref, {
        description: [
            'Seçimin x koordinat eksenini ayarlar.',
            axisPlaceableObjs.axisRefDescription('x', 'sol', 'sağ')
        ].join(' ')
    }),

    yref: extendFlat({}, annAttrs.yref, {
        description: [
            'Seçimin y koordinat eksenini ayarlar.',
            axisPlaceableObjs.axisRefDescription('y', 'alt', 'üst')
        ].join(' ')
    }),

    x0: {
        valType: 'any',
        description: 'Seçimin başlangıç x pozisyonunu ayarlar.'
    },
    x1: {
        valType: 'any',
        description: 'Seçimin bitiş x pozisyonunu ayarlar.'
    },

    y0: {
        valType: 'any',
        description: 'Seçimin başlangıç y pozisyonunu ayarlar.'
    },
    y1: {
        valType: 'any',
        description: 'Seçimin bitiş y pozisyonunu ayarlar.'
    },

    path: {
        valType: 'string',
        editType: 'arraydraw',
        description: [
            'Eğer `type` *path* ise - veri koordinatlarında `shapes.path` benzeri geçerli bir SVG yolu.',
            'İzin verilen segmentler: M, L ve Z.'
        ].join(' ')
    },

    opacity: {
        valType: 'number',
        min: 0,
        max: 1,
        dflt: 0.7,
        editType: 'arraydraw',
        description: 'Seçimin opaklığını ayarlar.'
    },

    line: {
        color: scatterLineAttrs.color,
        width: extendFlat({}, scatterLineAttrs.width, {
            min: 1,
            dflt: 1
        }),
        dash: extendFlat({}, dash, {
            dflt: 'dot'
        })
    },
}), 'arraydraw', 'from-root');
