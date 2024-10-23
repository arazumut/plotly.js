'use strict';

// Renk özelliklerini içe aktar
var colorAttrs = require('../../components/color/attributes');
// Alan özelliklerini içe aktar
var domainAttrs = require('../domain').attributes;
// Eksen özelliklerini içe aktar
var axesAttrs = require('../cartesian/layout_attributes');

// Tüm düzenleme türlerini geçersiz kıl
var overrideAll = require('../../plot_api/edit_types').overrideAll;
// Düz genişletme fonksiyonunu içe aktar
var extendFlat = require('../../lib/extend').extendFlat;

// Üçgen eksen özellikleri
var ternaryAxesAttrs = {
    title: {
        text: axesAttrs.title.text,
        font: axesAttrs.title.font
        // TODO burada standoff mantıklı mı?
    },
    color: axesAttrs.color,
    // işaretler
    tickmode: axesAttrs.minor.tickmode,
    nticks: extendFlat({}, axesAttrs.nticks, {dflt: 6, min: 1}),
    tick0: axesAttrs.tick0,
    dtick: axesAttrs.dtick,
    tickvals: axesAttrs.tickvals,
    ticktext: axesAttrs.ticktext,
    ticks: axesAttrs.ticks,
    ticklen: axesAttrs.ticklen,
    tickwidth: axesAttrs.tickwidth,
    tickcolor: axesAttrs.tickcolor,
    ticklabelstep: axesAttrs.ticklabelstep,
    showticklabels: axesAttrs.showticklabels,
    labelalias: axesAttrs.labelalias,
    showtickprefix: axesAttrs.showtickprefix,
    tickprefix: axesAttrs.tickprefix,
    showticksuffix: axesAttrs.showticksuffix,
    ticksuffix: axesAttrs.ticksuffix,
    showexponent: axesAttrs.showexponent,
    exponentformat: axesAttrs.exponentformat,
    minexponent: axesAttrs.minexponent,
    separatethousands: axesAttrs.separatethousands,
    tickfont: axesAttrs.tickfont,
    tickangle: axesAttrs.tickangle,
    tickformat: axesAttrs.tickformat,
    tickformatstops: axesAttrs.tickformatstops,
    hoverformat: axesAttrs.hoverformat,
    // çizgiler ve ızgaralar
    showline: extendFlat({}, axesAttrs.showline, {dflt: true}),
    linecolor: axesAttrs.linecolor,
    linewidth: axesAttrs.linewidth,
    showgrid: extendFlat({}, axesAttrs.showgrid, {dflt: true}),
    gridcolor: axesAttrs.gridcolor,
    gridwidth: axesAttrs.gridwidth,
    griddash: axesAttrs.griddash,
    layer: axesAttrs.layer,
    // aralık
    min: {
        valType: 'number',
        dflt: 0,
        min: 0,
        description: [
            'Bu eksende görünen minimum değer.',
            'Maksimum, diğer iki eksenin minimum değerlerinin toplamı ile belirlenir.',
            'Tam görünüm, tüm minimumların sıfıra ayarlandığı duruma karşılık gelir.'
        ].join(' ')
    },
};

// Özellikleri geçersiz kıl ve dışa aktar
var attrs = module.exports = overrideAll({
    domain: domainAttrs({name: 'ternary'}),

    bgcolor: {
        valType: 'color',
        dflt: colorAttrs.background,
        description: 'Alt grafik alanının arka plan rengini ayarlayın'
    },
    sum: {
        valType: 'number',
        dflt: 1,
        min: 0,
        description: [
            'Her üçlünün toplamı olması gereken sayı,',
            've her eksenin maksimum aralığı'
        ].join(' ')
    },
    aaxis: ternaryAxesAttrs,
    baxis: ternaryAxesAttrs,
    caxis: ternaryAxesAttrs
}, 'plot', 'from-root');

// `overrideAll` dışında uirevisions ayarla, böylece `editType: none` olabilir
attrs.uirevision = {
    valType: 'any',
    editType: 'none',
    description: [
        'Kullanıcı tarafından yapılan eksen `min` ve `title` değişikliklerinin kalıcılığını kontrol eder,',
        'bireysel eksenlerde geçersiz kılınmadıkça.',
        'Varsayılan olarak `layout.uirevision`.'
    ].join(' ')
};

attrs.aaxis.uirevision = attrs.baxis.uirevision = attrs.caxis.uirevision = {
    valType: 'any',
    editType: 'none',
    description: [
        'Kullanıcı tarafından yapılan eksen `min` ve `title` değişikliklerinin kalıcılığını kontrol eder,',
        '`editable: true` yapılandırmasında.',
        'Varsayılan olarak `ternary<N>.uirevision`.'
    ].join(' ')
};
