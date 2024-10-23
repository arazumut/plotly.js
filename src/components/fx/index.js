'use strict';

// Gerekli modülleri dahil et
var d3 = require('@plotly/d3');
var Lib = require('../../lib');
var dragElement = require('../dragelement');
var helpers = require('./helpers');
var layoutAttributes = require('./layout_attributes');
var hoverModule = require('./hover');

// Modülü dışa aktar
module.exports = {
    moduleType: 'component', // Modül tipi: bileşen
    name: 'fx', // Modül adı: fx

    constants: require('./constants'), // Sabitler
    schema: {
        layout: layoutAttributes // Şema: yerleşim özellikleri
    },

    attributes: require('./attributes'), // Özellikler
    layoutAttributes: layoutAttributes, // Yerleşim özellikleri

    supplyLayoutGlobalDefaults: require('./layout_global_defaults'), // Küresel yerleşim varsayılanlarını sağla
    supplyDefaults: require('./defaults'), // Varsayılanları sağla
    supplyLayoutDefaults: require('./layout_defaults'), // Yerleşim varsayılanlarını sağla

    calc: require('./calc'), // Hesaplama

    getDistanceFunction: helpers.getDistanceFunction, // Mesafe fonksiyonunu al
    getClosest: helpers.getClosest, // En yakın olanı al
    inbox: helpers.inbox, // Gelen kutusu
    quadrature: helpers.quadrature, // Dörtleme
    appendArrayPointValue: helpers.appendArrayPointValue, // Dizi nokta değerini ekle

    castHoverOption: castHoverOption, // Hover seçeneğini dönüştür
    castHoverinfo: castHoverinfo, // Hover bilgisini dönüştür

    hover: hoverModule.hover, // Hover
    unhover: dragElement.unhover, // Hover'ı kaldır

    loneHover: hoverModule.loneHover, // Tek hover
    loneUnhover: loneUnhover, // Tek hover'ı kaldır

    click: require('./click') // Tıklama
};

// Tek hover'ı kaldır fonksiyonu
function loneUnhover(containerOrSelection) {
    // Argümanın d3 seçimi olup olmadığını belirle çünkü ie9 modern tarayıcılar gibi instanceof'u işlemez.
    var selection = Lib.isD3Selection(containerOrSelection) ?
            containerOrSelection :
            d3.select(containerOrSelection);

    selection.selectAll('g.hovertext').remove(); // Tüm hover metinlerini kaldır
    selection.selectAll('.spikeline').remove(); // Tüm spike çizgilerini kaldır
}

// Fx.loneHover kullanan izler için yardımcı fonksiyonlar

// Hover seçeneğini dönüştür fonksiyonu
function castHoverOption(trace, ptNumber, attr) {
    return Lib.castOption(trace, ptNumber, 'hoverlabel.' + attr);
}

// Hover bilgisini dönüştür fonksiyonu
function castHoverinfo(trace, fullLayout, ptNumber) {
    function _coerce(val) {
        return Lib.coerceHoverinfo({hoverinfo: val}, {_module: trace._module}, fullLayout);
    }

    return Lib.castOption(trace, ptNumber, 'hoverinfo', _coerce);
}
