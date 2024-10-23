'use strict';

module.exports = {
    // Birden fazla yatay çubuk için hover etiketleri bu açıyla eğilir
    YANGLE: 60,

    // Hover metni için boyut ve görüntüleme sabitleri

    // Hover oklarının piksel boyutu
    HOVERARROWSIZE: 6,
    // Metin etrafındaki piksel boşluk
    HOVERTEXTPAD: 3,
    // Hover yazı tipi boyutu
    HOVERFONTSIZE: 13,
    // Hover yazı tipi
    HOVERFONT: 'Arial, sans-serif',

    // Hover çağrıları arasındaki minimum süre (milisaniye)
    HOVERMINTIME: 50,

    // Throttle önbelleğinde hover olayları için ID son eki (fullLayout._uid ile birlikte)
    HOVERID: '-hover'
};
