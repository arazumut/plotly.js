'use strict';

// colorscaleCalc modülünü içe aktar
var colorscaleCalc = require('../../components/colorscale/calc');

// calc fonksiyonunu dışa aktar
module.exports = function calc(gd, trace) {
    // u, v ve w vektörlerini al
    var u = trace.u;
    var v = trace.v;
    var w = trace.w;
    
    // x, y, z ve u, v, w vektörlerinin en küçük uzunluğunu hesapla
    var len = Math.min(
        trace.x.length, trace.y.length, trace.z.length,
        u.length, v.length, w.length
    );
    
    // normMax ve normMin değişkenlerini başlat
    var normMax = -Infinity;
    var normMin = Infinity;

    // Her bir vektör bileşeni için norm hesapla ve normMax ile normMin'i güncelle
    for(var i = 0; i < len; i++) {
        var uu = u[i];
        var vv = v[i];
        var ww = w[i];
        var norm = Math.sqrt(uu * uu + vv * vv + ww * ww);

        normMax = Math.max(normMax, norm);
        normMin = Math.min(normMin, norm);
    }

    // Hesaplanan uzunluğu ve maksimum normu izleme nesnesine ekle
    trace._len = len;
    trace._normMax = normMax;

    // colorscaleCalc fonksiyonunu çağır ve renk skalasını hesapla
    colorscaleCalc(gd, trace, {
        vals: [normMin, normMax],
        containerStr: '',
        cLetter: 'c'
    });
};
