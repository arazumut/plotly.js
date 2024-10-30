'use strict';

// Uyarı mesajı: densitymapbox izleme türü artık kullanılmıyor
var deprecationWarning = [
    '*densitymapbox* izleme türü artık kullanılmıyor!',
    '*densitymap* izleme türüne ve `map` alt grafiklerine geçmeyi düşünün.',
    'Daha fazla bilgi için: https://plotly.com/javascript/maplibre-migration/'
].join(' ');

module.exports = {
    özellikler: require('./attributes'), // Özellikler
    varsayılanlarıSağla: require('./defaults'), // Varsayılanları sağla
    renkÇubuğu: require('../heatmap/colorbar'), // Renk çubuğu
    etiketleriFormatla: require('../scattermapbox/format_labels'), // Etiketleri formatla
    hesapla: require('./calc'), // Hesapla
    çiz: require('./plot'), // Çiz
    üzerineGelinenNoktalar: require('./hover'), // Üzerine gelinen noktalar
    olayVerisi: require('./event_data'), // Olay verisi

    altKatmanAl: function(izleme, altGrafik) {
        var haritaKatmanları = altGrafik.getMapLayers();

        // `type: 'symbol'` olan ve plotly katmanı olmayan ilk katmanı bul
        for(var i = 0; i < haritaKatmanları.length; i++) {
            var katman = haritaKatmanları[i];
            var katmanId = katman.id;
            if(katman.type === 'symbol' &&
                typeof katmanId === 'string' && katmanId.indexOf('plotly-') === -1
            ) {
                return katmanId;
            }
        }
    },

    modülTürü: 'izleme', // Modül türü: izleme
    adı: 'densitymapbox', // Adı: densitymapbox
    temelÇizimModülü: require('../../plots/mapbox'), // Temel çizim modülü
    kategoriler: ['mapbox', 'gl', 'showLegend'], // Kategoriler
    meta: {
        insanOkunabilirAdı: 'density_mapbox', // İnsan tarafından okunabilir adı
        açıklama: [
            deprecationWarning,
            '`lon` ve `lat` koordinatlarından ve isteğe bağlı `z` değerlerinden',
            'bir renk ölçeği oluşturur.'
        ].join(' ')
    }
};
