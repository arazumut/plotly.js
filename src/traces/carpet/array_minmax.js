'use strict';

var isArrayOrTypedArray = require('../../lib').isArrayOrTypedArray;

module.exports = function(a) {
    return minMax(a, 0);
};

function minMax(a, derinlik) {
    // On boyutlu veri kümeleriyle sınırlayın. Bu, sorunlara neden olma olasılığı
    // veya endişe kaynağı olma olasılığı *son derece* düşük görünüyor. Bu, yalnızca
    // döngüsel dizilerin bu döngüye neden olamayacağı için dahil edilmiştir.
    if(!isArrayOrTypedArray(a) || derinlik >= 10) {
        return null;
    }

    var min = Infinity;
    var max = -Infinity;
    var n = a.length;
    for(var i = 0; i < n; i++) {
        var veri = a[i];

        if(isArrayOrTypedArray(veri)) {
            var sonuc = minMax(veri, derinlik + 1);

            if(sonuc) {
                min = Math.min(sonuc[0], min);
                max = Math.max(sonuc[1], max);
            }
        } else {
            min = Math.min(veri, min);
            max = Math.max(veri, max);
        }
    }

    return [min, max];
}
