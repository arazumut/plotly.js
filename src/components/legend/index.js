'use strict'; // 'use strict' ifadesi, JavaScript'in katı modda çalışmasını sağlar.

module.exports = {
    moduleType: 'component', // Modül tipi: 'bileşen'
    name: 'legend', // Modül adı: 'legend' (açıklama)

    layoutAttributes: require('./attributes'), // Düzen öznitelikleri: './attributes' dosyasından alınır
    supplyLayoutDefaults: require('./defaults'), // Düzen varsayılanları: './defaults' dosyasından alınır

    draw: require('./draw'), // Çizim fonksiyonu: './draw' dosyasından alınır
    style: require('./style') // Stil fonksiyonu: './style' dosyasından alınır
};
