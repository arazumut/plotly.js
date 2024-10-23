'use strict';

// Gerekli modülleri dahil et
var handleAxisDefaults = require('./axis_defaults');
var Template = require('../../plot_api/plot_template');

// AB varsayılanlarını işleyen fonksiyon
module.exports = function handleABDefaults(traceIn, traceOut, fullLayout, coerce, dfltColor) {
    var a = coerce('a');

    if (!a) {
        coerce('da');
        coerce('a0');
    }

    var b = coerce('b');

    if (!b) {
        coerce('db');
        coerce('b0');
    }

    eksenVarsayilanlariniIsle(traceIn, traceOut, fullLayout, dfltColor);
};

// Eksen varsayılanlarını işleyen fonksiyon
function eksenVarsayilanlariniIsle(traceIn, traceOut, fullLayout, dfltColor) {
    var eksenListesi = ['aaxis', 'baxis'];

    eksenListesi.forEach(function (eksenAdi) {
        var eksenHarf = eksenAdi.charAt(0);
        var eksenIn = traceIn[eksenAdi] || {};
        var eksenOut = Template.newContainer(traceOut, eksenAdi);

        var varsayilanSeçenekler = {
            noAutotickangles: true,
            noTicklabelshift: true,
            noTicklabelstandoff: true,
            noTicklabelstep: true,
            tickfont: 'x',
            id: eksenHarf + 'axis',
            letter: eksenHarf,
            font: traceOut.font,
            name: eksenAdi,
            data: traceIn[eksenHarf],
            calendar: traceOut.calendar,
            dfltColor: dfltColor,
            bgColor: fullLayout.paper_bgcolor,
            autotypenumbersDflt: fullLayout.autotypenumbers,
            fullLayout: fullLayout
        };

        handleAxisDefaults(eksenIn, eksenOut, varsayilanSeçenekler);
        eksenOut._categories = eksenOut._categories || [];

        // Autotype'ı gereksiz yere tekrar etmemek için,
        // bir autotype'ı traceIn'e geri kopyala
        if (!traceIn[eksenAdi] && eksenIn.type !== '-') {
            traceIn[eksenAdi] = { type: eksenIn.type };
        }
    });
}
