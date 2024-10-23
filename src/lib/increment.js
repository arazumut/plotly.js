'use strict';

module.exports = function sayiyiArttir(x, delta) {
    if(!delta) return x;

    // Not 1:
    // 0.3 != 0.1 + 0.2 == 0.30000000000000004
    // fakat 0.3 == (10 * 0.1 + 10 * 0.2) / 10
    // Sayıyı arttırmak için tam sayı adımlarını kullanmaya çalış
    var ölçek = 1 / Math.abs(delta);
    var yeniX = (ölçek > 1) ? (
        ölçek * x +
        ölçek * delta
    ) / ölçek : x + delta;

    // Not 2:
    // şimdi birkaç kenar durumunu daha kapsamak için yuvarlamayı da düşünebiliriz
    // örn. 0.3 * 3 = 0.8999999999999999
    var uzunlukX1 = String(yeniX).length;
    if(uzunlukX1 > 16) {
        var uzunlukDelta = String(delta).length;
        var uzunlukX0 = String(x).length;

        if(uzunlukX1 >= uzunlukX0 + uzunlukDelta) { // muhtemelen bir yuvarlama hatası!
            var s = parseFloat(yeniX).toPrecision(12);
            if(s.indexOf('e+') === -1) yeniX = +s;
        }
    }

    return yeniX;
};
