'use strict';

// Uyarı mesajı
var deprecationWarning = [
    '*choroplethmapbox* izi kullanımdan kaldırıldı!',
    '*choroplethmap* iz türüne ve `map` alt grafiklerine geçmeyi düşünün.',
    'Daha fazla bilgi için: https://plotly.com/javascript/maplibre-migration/'
].join(' ');

module.exports = {
    attributes: require('./attributes'), // Özellikler
    supplyDefaults: require('./defaults'), // Varsayılanları sağla
    colorbar: require('../heatmap/colorbar'), // Renk çubuğu
    calc: require('../choropleth/calc'), // Hesaplama
    plot: require('./plot'), // Grafik çizimi
    hoverPoints: require('../choropleth/hover'), // Üzerine gelme noktaları
    eventData: require('../choropleth/event_data'), // Olay verisi
    selectPoints: require('../choropleth/select'), // Nokta seçimi

    styleOnSelect: function(_, cd) { // Seçim üzerine stil
        if(cd) {
            var trace = cd[0].trace;
            trace._glTrace.updateOnSelect(cd);
        }
    },

    getBelow: function(trace, subplot) { // Altındaki katmanı al
        var mapLayers = subplot.getMapLayers();

        // En üstteki "su" katmanının hemen üstünde olan
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
    name: 'choroplethmapbox', // İsim
    basePlotModule: require('../../plots/mapbox'), // Temel grafik modülü
    categories: ['mapbox', 'gl', 'noOpacity', 'showLegend'], // Kategoriler
    meta: {
        hr_name: 'choropleth_mapbox', // İnsan tarafından okunabilir isim
        description: [
            deprecationWarning,
            'Doldurulacak GeoJSON özellikleri `geojson` içinde ayarlanır.',
            'Choropleth değer-renk eşlemesini tanımlayan veri',
            '`locations` ve `z` içinde ayarlanır.'
        ].join(' ')
    }
};
