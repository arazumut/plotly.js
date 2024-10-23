'use strict';

// Gerekli modülleri dahil et
var annAttrs = require('../annotations/attributes');
var overrideAll = require('../../plot_api/edit_types').overrideAll;
var templatedArray = require('../../plot_api/plot_template').templatedArray;

// Modülü dışa aktar
module.exports = overrideAll(templatedArray('annotation', {
    visible: annAttrs.visible,
    x: {
        valType: 'any',
        description: 'Annotasyonun x pozisyonunu ayarlar.'
    },
    y: {
        valType: 'any',
        description: 'Annotasyonun y pozisyonunu ayarlar.'
    },
    z: {
        valType: 'any',
        description: 'Annotasyonun z pozisyonunu ayarlar.'
    },
    ax: {
        valType: 'number',
        description: 'Ok başı etrafındaki ok kuyruğunun x bileşenini ayarlar (piksel cinsinden).'
    },
    ay: {
        valType: 'number',
        description: 'Ok başı etrafındaki ok kuyruğunun y bileşenini ayarlar (piksel cinsinden).'
    },

    xanchor: annAttrs.xanchor,
    xshift: annAttrs.xshift,
    yanchor: annAttrs.yanchor,
    yshift: annAttrs.yshift,

    text: annAttrs.text,
    textangle: annAttrs.textangle,
    font: annAttrs.font,
    width: annAttrs.width,
    height: annAttrs.height,
    opacity: annAttrs.opacity,
    align: annAttrs.align,
    valign: annAttrs.valign,
    bgcolor: annAttrs.bgcolor,
    bordercolor: annAttrs.bordercolor,
    borderpad: annAttrs.borderpad,
    borderwidth: annAttrs.borderwidth,
    showarrow: annAttrs.showarrow,
    arrowcolor: annAttrs.arrowcolor,
    arrowhead: annAttrs.arrowhead,
    startarrowhead: annAttrs.startarrowhead,
    arrowside: annAttrs.arrowside,
    arrowsize: annAttrs.arrowsize,
    startarrowsize: annAttrs.startarrowsize,
    arrowwidth: annAttrs.arrowwidth,
    standoff: annAttrs.standoff,
    startstandoff: annAttrs.startstandoff,
    hovertext: annAttrs.hovertext,
    hoverlabel: annAttrs.hoverlabel,
    captureevents: annAttrs.captureevents,

    // Belki daha sonra?
    // clicktoshow: annAttrs.clicktoshow,
    // xclick: annAttrs.xclick,
    // yclick: annAttrs.yclick,

    // Gerekli değil!
    // axref: 'pixel'
    // ayref: 'pixel'
    // xref: 'x'
    // yref: 'y'
    // zref: 'z'
}), 'calc', 'from-root');
