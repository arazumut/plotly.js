'use strict';

// Bu fonksiyon, verilen bir iz (trace), x ve y eksenleri, xy koordinatları, dxy vektörü ve referans dxy vektörü ile metni yönlendirir.
module.exports = function orientText(trace, xaxis, yaxis, xy, dxy, refDxy) {
    // dxy vektörünün x ve y bileşenlerini hesapla
    var dx = dxy[0] * trace.dpdx(xaxis);
    var dy = dxy[1] * trace.dpdy(yaxis);
    var flip = 1;

    // offsetMultiplier'ı başlangıçta 1.0 olarak ayarla
    var offsetMultiplier = 1.0;
    if(refDxy) {
        // dxy ve refDxy vektörlerinin uzunluklarını hesapla
        var l1 = Math.sqrt(dxy[0] * dxy[0] + dxy[1] * dxy[1]);
        var l2 = Math.sqrt(refDxy[0] * refDxy[0] + refDxy[1] * refDxy[1]);
        // dxy ve refDxy vektörlerinin nokta çarpımını hesapla
        var dot = (dxy[0] * refDxy[0] + dxy[1] * refDxy[1]) / l1 / l2;
        // offsetMultiplier'ı güncelle
        offsetMultiplier = Math.max(0.0, dot);
    }

    // dx ve dy kullanarak açıyı hesapla
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if(angle < -90) {
        angle += 180;
        flip = -flip;
    } else if(angle > 90) {
        angle -= 180;
        flip = -flip;
    }

    // Sonuçları döndür
    return {
        angle: angle,
        flip: flip,
        p: trace.c2p(xy, xaxis, yaxis),
        offsetMultiplier: offsetMultiplier // offsetMultplier yazım hatası düzeltildi
    };
};
