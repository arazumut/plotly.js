'use strict'; // 'use strict' modu, daha sıkı bir JavaScript yazım kuralları sağlar.

module.exports = {
    attributes: require('./attributes'), // Özellikleri içe aktarır.
    supplyDefaults: require('./defaults'), // Varsayılan değerleri sağlar.
    colorbar: require('../contour/colorbar'), // Renk çubuğunu içe aktarır.
    calc: require('./calc'), // Hesaplama fonksiyonlarını içe aktarır.
    plot: require('./plot'), // Çizim fonksiyonlarını içe aktarır.
    style: require('../contour/style'), // Stil fonksiyonlarını içe aktarır.

    moduleType: 'trace', // Modül tipi 'trace' olarak belirlenir.
    name: 'contourcarpet', // Modül adı 'contourcarpet' olarak belirlenir.
    basePlotModule: require('../../plots/cartesian'), // Temel çizim modülü içe aktarılır.
    categories: ['cartesian', 'svg', 'carpet', 'contour', 'symbols', 'showLegend', 'hasLines', 'carpetDependent', 'noHover', 'noSortingByValue'], // Kategoriler belirlenir.
    meta: {
        hrName: 'contour_carpet', // İnsan tarafından okunabilir adı belirlenir.
        description: [
            'İlk halı ekseninde veya',
            'eşleşen `carpet` özelliğine sahip halı ekseninde konturlar çizer. Veri `z`',
            'ilgili halı eksenine karşılık gelen veri olarak yorumlanır.'
        ].join(' ') // Açıklama metni birleştirilir.
    }
};
