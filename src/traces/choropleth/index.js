'use strict';

// Modül dışa aktarımı
module.exports = {
    // Özellikler
    attributes: require('./attributes'),
    // Varsayılan değerleri sağlama
    supplyDefaults: require('./defaults'),
    // Renk çubuğu
    colorbar: require('../heatmap/colorbar'),
    // Hesaplama
    calc: require('./calc'),
    // GeoJSON hesaplama
    calcGeoJSON: require('./plot').calcGeoJSON,
    // Çizim
    plot: require('./plot').plot,
    // Stil
    style: require('./style').style,
    // Seçim sırasında stil
    styleOnSelect: require('./style').styleOnSelect,
    // Hover (üzerine gelme) noktaları
    hoverPoints: require('./hover'),
    // Olay verisi
    eventData: require('./event_data'),
    // Nokta seçimi
    selectPoints: require('./select'),

    // Modül türü
    moduleType: 'trace',
    // Modül adı
    name: 'choropleth',
    // Temel çizim modülü
    basePlotModule: require('../../plots/geo'),
    // Kategoriler
    categories: ['geo', 'noOpacity', 'showLegend'],
    // Meta veriler
    meta: {
        description: [
            'Choropleth değer-renk eşlemesini tanımlayan veri',
            '`z` içinde ayarlanır.',
            '`z` içindeki her değere karşılık gelen coğrafi konumlar',
            '`locations` içinde ayarlanır.'
        ].join(' ')
    }
};
