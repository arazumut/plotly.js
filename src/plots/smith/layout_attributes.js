'use strict';

var renkOzellikleri = require('../../components/color/attributes');
var eksenOzellikleri = require('../cartesian/layout_attributes');
var alanOzellikleri = require('../domain').attributes;
var extendFlat = require('../../lib').extendFlat;
var overrideAll = require('../../plot_api/edit_types').overrideAll;

var eksenCizgiIzgaraOzellikleri = overrideAll({
    renk: eksenOzellikleri.color,
    cizgiGoster: extendFlat({}, eksenOzellikleri.showline, {dflt: true}),
    cizgiRenk: eksenOzellikleri.linecolor,
    cizgiGenislik: eksenOzellikleri.linewidth,
    izgaraGoster: extendFlat({}, eksenOzellikleri.showgrid, {dflt: true}),
    izgaraRenk: eksenOzellikleri.gridcolor,
    izgaraGenislik: eksenOzellikleri.gridwidth,
    izgaraCizgiTipi: eksenOzellikleri.griddash
}, 'plot', 'from-root');

var eksenTickOzellikleri = overrideAll({
    tickUzunluk: eksenOzellikleri.ticklen,
    tickGenislik: extendFlat({}, eksenOzellikleri.tickwidth, {dflt: 2}),
    tickRenk: eksenOzellikleri.tickcolor,
    tickEtiketGoster: eksenOzellikleri.showticklabels,
    etiketTakmaAd: eksenOzellikleri.labelalias,
    tickOnEkGoster: eksenOzellikleri.showtickprefix,
    tickOnEk: eksenOzellikleri.tickprefix,
    tickSonEkGoster: eksenOzellikleri.showticksuffix,
    tickSonEk: eksenOzellikleri.ticksuffix,
    tickYaziTipi: eksenOzellikleri.tickfont,
    tickFormat: eksenOzellikleri.tickformat,
    hoverFormat: eksenOzellikleri.hoverformat,
    katman: eksenOzellikleri.layer
}, 'plot', 'from-root');

var gercekEksenOzellikleri = extendFlat({
    gorunur: extendFlat({}, eksenOzellikleri.visible, {dflt: true}),

    tickDegerleri: {
        dflt: [0.2, 0.5, 1, 2, 5],
        valType: 'data_array',
        editType: 'plot',
        description: 'Bu eksendeki ticklerin görüneceği değerleri ayarlar.'
    },

    tickAci: extendFlat({}, eksenOzellikleri.tickangle, {dflt: 90}),

    tickler: {
        valType: 'enumerated',
        values: ['üst', 'alt', ''],
        editType: 'ticks',
        description: [
            'Ticklerin çizilip çizilmeyeceğini belirler.',
            'Eğer ** ise, bu eksenin tickleri çizilmez.',
            'Eğer *üst* (*alt*) ise, bu eksenin tickleri eksen çizgisinin',
            'üstünde (altında) çizilir.'
        ].join(' ')
    },

    taraf: {
        valType: 'enumerated',
        values: ['üst', 'alt'],
        dflt: 'üst',
        editType: 'plot',
        description: [
            'Gerçek eksen çizgisinin hangi tarafında',
            'tick ve tick etiketlerinin görüneceğini belirler.'
        ].join(' ')
    },

    editType: 'calc',
}, eksenCizgiIzgaraOzellikleri, eksenTickOzellikleri);

var sanalEksenOzellikleri = extendFlat({
    gorunur: extendFlat({}, eksenOzellikleri.visible, {dflt: true}),

    tickDegerleri: {
        valType: 'data_array',
        editType: 'plot',
        description: [
            'Bu eksendeki ticklerin görüneceği değerleri ayarlar.',
            'Varsayılan olarak `gercekEksen.tickDegerleri` ve aynı zamanda negatifler ve sıfır.'
        ].join(' ')
    },

    tickler: eksenOzellikleri.ticks,

    editType: 'calc'
}, eksenCizgiIzgaraOzellikleri, eksenTickOzellikleri);

module.exports = {
    alan: alanOzellikleri({name: 'smith', editType: 'plot'}),

    arkaPlanRenk: {
        valType: 'color',
        editType: 'plot',
        dflt: renkOzellikleri.background,
        description: 'Alt grafik alanının arka plan rengini ayarlar'
    },

    gercekEksen: gercekEksenOzellikleri,
    sanalEksen: sanalEksenOzellikleri,

    editType: 'calc'
};
