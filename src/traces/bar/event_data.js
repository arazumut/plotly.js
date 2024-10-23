'use strict';

// Bu fonksiyon olay verilerini işler ve çıktı olarak döner
module.exports = function olayVerisi(out, pt, iz) {
    // Standart kartezyen olay verileri
    out.x = 'xVal' in pt ? pt.xVal : pt.x;
    out.y = 'yVal' in pt ? pt.yVal : pt.y;
    if(pt.xa) out.xEkseni = pt.xa;
    if(pt.ya) out.yEkseni = pt.ya;

    if(iz.orientasyon === 'h') {
        out.etiket = out.y;
        out.deger = out.x;
    } else {
        out.etiket = out.x;
        out.deger = out.y;
    }

    return out;
};
