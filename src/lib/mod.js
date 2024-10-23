'use strict';

/**
 * Her zaman [0, d) aralığında dönen, negatifse (-d, 0] yerine
 * sanitize edilmiş modül fonksiyonu
 */
function mod(v, d) {
    var out = v % d;
    return out < 0 ? out + d : out;
}

/**
 * Her zaman [-d/2, d/2] aralığında dönen, negatifse (-d, 0] yerine
 * sanitize edilmiş modül fonksiyonu
 */
function modHalf(v, d) {
    return Math.abs(v) > (d / 2) ?
        v - Math.round(v / d) * d :
        v;
}

module.exports = {
    mod: mod,
    modHalf: modHalf
};
