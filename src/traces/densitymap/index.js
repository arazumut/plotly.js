'use strict';

// Modül dışa aktarımı
module.exports = {
    // Özellikler
    attributes: require('./attributes'),
    // Varsayılan değerleri sağlama
    supplyDefaults: require('./defaults'),
    // Renk çubuğu
    colorbar: require('../heatmap/colorbar'),
    // Etiket formatlama
    formatLabels: require('../scattermap/format_labels'),
    // Hesaplama
    calc: require('./calc'),
    // Çizim
    plot: require('./plot'),
    // Hover noktaları
    hoverPoints: require('./hover'),
    // Olay verisi
    eventData: require('./event_data'),

    // Altında bulunacak katmanı getirme fonksiyonu
    getBelow: function(trace, subplot) {
        var mapLayers = subplot.getMapLayers();

        // `type: 'symbol'` olan ve plotly katmanı olmayan ilk katmanı bul
        for(var i = 0; i < mapLayers.length; i++) {
            var layer = mapLayers[i];
            var layerId = layer.id;
            if(layer.type === 'symbol' &&
                typeof layerId === 'string' && layerId.indexOf('plotly-') === -1
            ) {
                return layerId;
            }
        }
    },

    // Modül tipi
    moduleType: 'trace',
    // Modül adı
    name: 'densitymap',
    // Temel çizim modülü
    basePlotModule: require('../../plots/map'),
    // Kategoriler
    categories: ['map', 'gl', 'showLegend'],
    // Meta veriler
    meta: {
        hr_name: 'density_map',
        description: [
            'Gauss çekirdeği ile iki değişkenli bir yoğunluk tahmini çizer',
            '`lon` ve `lat` koordinatlarından ve isteğe bağlı `z` değerlerinden bir renk skalası kullanarak.'
        ].join(' ')
    }
};
