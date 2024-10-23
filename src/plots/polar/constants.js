'use strict';

module.exports = {
    attr: 'altgrafik', // subplot
    name: 'kutupsal', // polar

    eksenIsimleri: ['açısalEksen', 'radyalEksen'], // axisNames
    eksenIsmi2veriDizisi: {açısalEksen: 'theta', radyalEksen: 'r'}, // axisName2dataArray

    katmanIsimleri: [ // layerNames
        'sürüklemeKatmanı', // draglayer
        'grafikArkaplanı', // plotbg
        'arkaGrafik', // backplot
        'açısal-ızgara', // angular-grid
        'radyal-ızgara', // radial-grid
        'önGrafik', // frontplot
        'açısal-çizgi', // angular-line
        'radyal-çizgi', // radial-line
        'açısal-eksen', // angular-axis
        'radyal-eksen' // radial-axis
    ],

    radyalSürüklemeKutusuBoyutu: 50, // radialDragBoxSize
    açısalSürüklemeKutusuBoyutu: 30, // angularDragBoxSize
    köşeUzunluğu: 25, // cornerLen
    köşeYarıGenişliği: 2, // cornerHalfWidth

    // Fareyi başlangıç noktasına sabitlemeyi bırakmadan önce hareket ettirmeniz gereken piksel sayısı
    MIN_SÜRÜKLEME: 8, // MINDRAG
    // Bir yakınlaştırma kutusu için izin verilen en küçük radyal mesafe [px]
    MIN_YAKINLAŞTIRMA: 20, // MINZOOM
    // Tek taraflı radyal yakınlaştırmadan iki taraflı radyal yakınlaştırmaya geçiş yaptığımız mesafe [px]
    KENAR_DIŞI: 20 // OFFEDGE
};
