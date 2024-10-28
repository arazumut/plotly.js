'use strict';

// Modül dışa aktarımı
module.exports = {
    attributes: require('./attributes'), // Özellikler
    supplyDefaults: require('./defaults'), // Varsayılanları sağla
    colorbar: require('../heatmap/colorbar'), // Renk çubuğu
    calc: require('../choropleth/calc'), // Hesaplama
    plot: require('./plot'), // Çizim
    hoverPoints: require('../choropleth/hover'), // Üzerine gelme noktaları
    eventData: require('../choropleth/event_data'), // Olay verisi
    selectPoints: require('../choropleth/select'), // Noktaları seç

    // Seçim sırasında stil uygulama
    styleOnSelect: function(_, cd) {
        if(cd) {
            var trace = cd[0].trace;
            trace._glTrace.updateOnSelect(cd);
        }
    },

    // Altında bulunan katmanı al
    getBelow: function(trace, subplot) {
        var mapLayers = subplot.getMapLayers();

        // En üstteki "su" katmanının hemen üstünde bulunan
        // ve plotly katmanı olmayan katmanı bul
        for(var i = mapLayers.length - 2; i >= 0; i--) {
            var layerId = mapLayers[i].id;

            if(typeof layerId === 'string' &&
                layerId.indexOf('water') === 0
             ) {
                for(var j = i + 1; j < mapLayers.length; j++) {
                    layerId = mapLayers[j].id;

                    if(typeof layerId === 'string' &&
                        layerId.indexOf('plotly-') === -1
                    ) {
                        return layerId;
                    }
                }
            }
        }
    },

    moduleType: 'trace', // Modül türü
    name: 'choroplethmap', // Modül adı
    basePlotModule: require('../../plots/map'), // Temel çizim modülü
    categories: ['map', 'gl', 'noOpacity', 'showLegend'], // Kategoriler
    meta: {
        hr_name: 'choropleth_map', // İnsan tarafından okunabilir adı
        description: [
            'GeoJSON özellikleri `geojson` içinde ayarlanır',
            'Choropleth değer-renk eşlemesini tanımlayan veri',
            '`locations` ve `z` içinde ayarlanır.'
        ].join(' ') // Açıklama
    }
};
