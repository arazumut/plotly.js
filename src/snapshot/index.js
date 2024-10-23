'use strict';

var yardımcılar = require('./helpers');

var AnlıkGörüntü = {
    gecikmeAl: yardımcılar.getDelay,
    yenidenÇizimFonksiyonuAl: yardımcılar.getRedrawFunc,
    klonla: require('./cloneplot'),
    SVGyeDönüştür: require('./tosvg'),
    SVGyiResmeDönüştür: require('./svgtoimg'),
    resmeDönüştür: require('./toimage'),
    resmiİndir: require('./download')
};

module.exports = AnlıkGörüntü;
