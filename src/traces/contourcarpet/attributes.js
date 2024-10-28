'use strict';

// Gerekli modülleri dahil et
var heatmapAttrs = require('../heatmap/attributes');
var contourAttrs = require('../contour/attributes');
var colorScaleAttrs = require('../../components/colorscale/attributes');

var extendFlat = require('../../lib/extend').extendFlat;

var contourContourAttrs = contourAttrs.contours;

// Modülü dışa aktar
module.exports = extendFlat({
    carpet: {
        valType: 'string',
        editType: 'calc',
        description: [
            'Bu kontur izinin bulunduğu halı eksenlerinin `carpet` değeri'
        ].join(' ')
    },
    z: heatmapAttrs.z,
    a: heatmapAttrs.x,
    a0: heatmapAttrs.x0,
    da: heatmapAttrs.dx,
    b: heatmapAttrs.y,
    b0: heatmapAttrs.y0,
    db: heatmapAttrs.dy,
    text: heatmapAttrs.text,
    hovertext: heatmapAttrs.hovertext,
    transpose: heatmapAttrs.transpose,
    atype: heatmapAttrs.xtype,
    btype: heatmapAttrs.ytype,

    fillcolor: contourAttrs.fillcolor,

    autocontour: contourAttrs.autocontour,
    ncontours: contourAttrs.ncontours,

    contours: {
        type: contourContourAttrs.type,
        start: contourContourAttrs.start,
        end: contourContourAttrs.end,
        size: contourContourAttrs.size,
        coloring: {
            // contourAttrs.contours.coloring'den ama 'heatmap' seçeneği yok
            valType: 'enumerated',
            values: ['fill', 'lines', 'none'],
            dflt: 'fill',
            editType: 'calc',
            description: [
                'Kontur değerlerini gösteren renklendirme yöntemini belirler.',
                '*fill* ise, her kontur seviyesi arasında eşit renklendirme yapılır.',
                '*lines* ise, renklendirme kontur çizgilerinde yapılır.',
                '*none* ise, bu izde renklendirme uygulanmaz.'
            ].join(' ')
        },
        showlines: contourContourAttrs.showlines,
        showlabels: contourContourAttrs.showlabels,
        labelfont: contourContourAttrs.labelfont,
        labelformat: contourContourAttrs.labelformat,
        operation: contourContourAttrs.operation,
        value: contourContourAttrs.value,
        editType: 'calc',
        impliedEdits: {autocontour: false}
    },

    line: {
        color: contourAttrs.line.color,
        width: contourAttrs.line.width,
        dash: contourAttrs.line.dash,
        smoothing: contourAttrs.line.smoothing,
        editType: 'plot'
    },

    zorder: contourAttrs.zorder,
    transforms: undefined
},

    colorScaleAttrs('', {
        cLetter: 'z',
        autoColorDflt: false
    })
);
