'use strict';

var isArrayOrTypedArray = require('../../lib').isArrayOrTypedArray;

/*
 * Bir x veya y koordinatları dizisini (c) ekran alanı piksel koordinatlarına (p) eşleyin.
 * Çıktı dizisi isteğe bağlıdır, ancak sağlanırsa, mümkün olduğunca yeniden tahsis edilmeden yeniden kullanılacaktır.
 */
module.exports = function diziEşle(out, data, func) {
    var i;

    if(!isArrayOrTypedArray(out)) {
        // Eğer bir dizi değilse, bir dizi yap:
        out = [];
    } else if(out.length > data.length) {
        // Eğer çok uzunsa, kısalt. (Eğer çok kısa ise, otomatik olarak büyüyeceği için bu durumu önemsemiyoruz)
        out = out.slice(0, data.length);
    }

    for(i = 0; i < data.length; i++) {
        out[i] = func(data[i]);
    }

    return out;
};
