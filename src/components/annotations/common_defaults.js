'use strict';

// Gerekli kütüphaneleri dahil et
var Lib = require('../../lib');
var Color = require('../color');

// 'annotations' ve 'annotations3d' için ortak varsayılan ayarları ele al
module.exports = function handleAnnotationCommonDefaults(annIn, annOut, fullLayout, coerce) {
    // Opaklık değerini zorla
    coerce('opacity');
    var arkaPlanRengi = coerce('bgcolor');

    var kenarRengi = coerce('bordercolor');
    var kenarOpaklığı = Color.opacity(kenarRengi);

    coerce('borderpad');

    var kenarKalınlığı = coerce('borderwidth');
    var okGöster = coerce('showarrow');

    coerce('text', okGöster ? ' ' : fullLayout._dfltTitle.annotation);
    coerce('textangle');
    Lib.coerceFont(coerce, 'font', fullLayout.font);

    coerce('width');
    coerce('align');

    var yükseklik = coerce('height');
    if (yükseklik) coerce('valign');

    if (okGöster) {
        var okTarafı = coerce('arrowside');
        var okBaşı;
        var okBoyutu;

        if (okTarafı.indexOf('end') !== -1) {
            okBaşı = coerce('arrowhead');
            okBoyutu = coerce('arrowsize');
        }

        if (okTarafı.indexOf('start') !== -1) {
            coerce('startarrowhead', okBaşı);
            coerce('startarrowsize', okBoyutu);
        }
        coerce('arrowcolor', kenarOpaklığı ? annOut.bordercolor : Color.defaultLine);
        coerce('arrowwidth', ((kenarOpaklığı && kenarKalınlığı) || 1) * 2);
        coerce('standoff');
        coerce('startstandoff');
    }

    var hoverMetni = coerce('hovertext');
    var genelHoverEtiketi = fullLayout.hoverlabel || {};

    if (hoverMetni) {
        var hoverArkaPlan = coerce('hoverlabel.bgcolor', genelHoverEtiketi.bgcolor ||
            (Color.opacity(arkaPlanRengi) ? Color.rgb(arkaPlanRengi) : Color.defaultLine)
        );

        var hoverKenar = coerce('hoverlabel.bordercolor', genelHoverEtiketi.bordercolor ||
            Color.contrast(hoverArkaPlan)
        );

        var fontVarsayılan = Lib.extendFlat({}, genelHoverEtiketi.font);
        if (!fontVarsayılan.color) {
            fontVarsayılan.color = hoverKenar;
        }

        Lib.coerceFont(coerce, 'hoverlabel.font', fontVarsayılan);
    }

    coerce('captureevents', !!hoverMetni);
};
