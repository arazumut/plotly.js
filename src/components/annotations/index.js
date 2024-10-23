'use strict';

// Gerekli modülleri dahil et
var cizimModulu = require('./draw');
var tiklamaModulu = require('./click');

module.exports = {
    moduleType: 'component', // Modül tipi: bileşen
    name: 'annotations', // Adı: açıklamalar

    layoutAttributes: require('./attributes'), // Düzen öznitelikleri
    supplyLayoutDefaults: require('./defaults'), // Düzen varsayılanlarını sağla
    includeBasePlot: require('../../plots/cartesian/include_components')('annotations'), // Temel grafiği dahil et

    calcAutorange: require('./calc_autorange'), // Otomatik aralığı hesapla
    draw: cizimModulu.draw, // Çizim fonksiyonu
    drawOne: cizimModulu.drawOne, // Tek bir öğeyi çiz
    drawRaw: cizimModulu.drawRaw, // Ham çizim fonksiyonu

    hasClickToShow: tiklamaModulu.hasClickToShow, // Gösterilecek tıklama var mı
    onClick: tiklamaModulu.onClick, // Tıklama olayında yapılacaklar

    convertCoords: require('./convert_coords') // Koordinatları dönüştür
};
