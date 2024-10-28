'use strict';

// Gerekli modülleri içe aktarıyoruz
module.exports = {
    attributes: require('./attributes'), // Özellikler
    supplyDefaults: require('./defaults'), // Varsayılan değerleri sağla
    calc: require('./calc'), // Hesaplama fonksiyonu
    plot: require('./plot').plot, // Çizim fonksiyonu
    style: require('./style'), // Stil fonksiyonu
    colorbar: require('./colorbar'), // Renk çubuğu
    hoverPoints: require('./hover'), // Üzerine gelindiğinde gösterilecek noktalar

    moduleType: 'trace', // Modül tipi
    name: 'contour', // Modül adı
    basePlotModule: require('../../plots/cartesian'), // Temel çizim modülü
    categories: ['cartesian', 'svg', '2dMap', 'contour', 'showLegend'], // Kategoriler
    meta: {
        description: [
            'Kontur çizgilerinin hesaplandığı veri `z` içinde ayarlanır.',
            '`z` içindeki veri {2D array} (2 boyutlu dizi) olmalıdır.',

            '`z` N satır ve M sütun içeriyorsa, varsayılan olarak,',
            'bu N satır N y koordinatına karşılık gelir',
            '(`y` içinde ayarlanır veya otomatik olarak oluşturulur) ve M sütun',
            'M x koordinatına karşılık gelir (`x` içinde ayarlanır veya otomatik olarak oluşturulur).',
            '`transpose` *true* olarak ayarlandığında, yukarıdaki davranış tersine çevrilir.'
        ].join(' ')
    }
};
