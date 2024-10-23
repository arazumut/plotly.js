'use strict';

// Gerekli modülleri dahil et
var cizimModulu = require('./draw');
var secim = require('./select');

// Modülü dışa aktar
module.exports = {
    moduleType: 'component', // Modül tipi: bileşen
    name: 'selections', // Adı: seçimler

    layoutAttributes: require('./attributes'), // Düzen öznitelikleri
    supplyLayoutDefaults: require('./defaults'), // Düzen varsayılanlarını sağla
    supplyDrawNewSelectionDefaults: require('./draw_newselection/defaults'), // Yeni seçim çizim varsayılanlarını sağla
    includeBasePlot: require('../../plots/cartesian/include_components')('selections'), // Temel grafiği dahil et

    draw: cizimModulu.draw, // Çizim fonksiyonu
    drawOne: cizimModulu.drawOne, // Tek bir öğe çizim fonksiyonu

    reselect: secim.reselect, // Yeniden seçme fonksiyonu
    prepSelect: secim.prepSelect, // Seçim hazırlık fonksiyonu
    clearOutline: secim.clearOutline, // Çerçeveyi temizleme fonksiyonu
    clearSelectionsCache: secim.clearSelectionsCache, // Seçim önbelleğini temizleme fonksiyonu
    selectOnClick: secim.selectOnClick // Tıklama ile seçim fonksiyonu
};
