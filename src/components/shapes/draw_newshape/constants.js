'use strict';

// 4'e bölünebilir olmalı
var DAIRE_KENAR_SAYISI = 32;

module.exports = {
    DAIRE_KENAR_SAYISI: DAIRE_KENAR_SAYISI,
    i000: 0,
    i090: DAIRE_KENAR_SAYISI / 4,
    i180: DAIRE_KENAR_SAYISI / 2,
    i270: DAIRE_KENAR_SAYISI / 4 * 3,
    cos45: Math.cos(Math.PI / 4),
    sin45: Math.sin(Math.PI / 4),
    KAREKOK2: Math.sqrt(2)
};
