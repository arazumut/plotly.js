'use strict';

// Gerekli modülleri dahil et
var extendFlat = require('../../lib').extendFlat;
var axisHoverFormat = require('../../plots/cartesian/axis_format_attributes').axisHoverFormat;
var OHLCattrs = require('../ohlc/attributes');
var boxAttrs = require('../box/attributes');

// Yön özelliklerini tanımlayan fonksiyon
function yonOzellikleri(cizgiRengiVarsayilan) {
    return {
        cizgi: {
            renk: extendFlat({}, boxAttrs.line.color, {dflt: cizgiRengiVarsayilan}),
            genislik: boxAttrs.line.width,
            duzenlemeTuru: 'stil'
        },

        dolguRengi: boxAttrs.fillcolor,
        duzenlemeTuru: 'stil'
    };
}

// Modülü dışa aktar
module.exports = {
    xperiod: OHLCattrs.xperiod,
    xperiod0: OHLCattrs.xperiod0,
    xperiodalignment: OHLCattrs.xperiodalignment,
    xhoverformat: axisHoverFormat('x'),
    yhoverformat: axisHoverFormat('y'),

    x: OHLCattrs.x,
    acilis: OHLCattrs.open,
    yuksek: OHLCattrs.high,
    dusuk: OHLCattrs.low,
    kapanis: OHLCattrs.close,

    cizgi: {
        genislik: extendFlat({}, boxAttrs.line.width, {
            aciklama: [
                boxAttrs.line.width.description,
                'Bu stil ayarının ayrıca',
                '`artis.cizgi.genislik` ve',
                '`azalis.cizgi.genislik` ile de ayarlanabileceğini unutmayın.'
            ].join(' ')
        }),
        duzenlemeTuru: 'stil'
    },

    artis: yonOzellikleri(OHLCattrs.increasing.line.color.dflt),

    azalis: yonOzellikleri(OHLCattrs.decreasing.line.color.dflt),

    metin: OHLCattrs.text,
    hoverMetin: OHLCattrs.hovertext,

    bıyıkGenisligi: extendFlat({}, boxAttrs.whiskerwidth, { dflt: 0 }),

    hoverEtiketi: OHLCattrs.hoverlabel,
    zSirasi: boxAttrs.zorder
};
