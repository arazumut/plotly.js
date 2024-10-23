'use strict';

/*
 * Catmull-Rom kübik splinelere (merkezcil, sanırım) göre teğet vektörünü hesapla.
 * Bu, kontrol noktasından iki şekilde farklıdır:
 *   1. Bu bir vektördür, noktaya göre bir konum değil
 *   2. vektör, p1'e göre konumdan 3 kat daha uzundur
 *
 * Sınırların yakınında, bunları *kuadratik kontrol noktaları olarak kullanacağız,
 * böylece güzel bir ızgara yapmak için teğeti 3 yerine 2'ye bölmemiz gerekecek.
 * (Matematik, bezier türevlerini çalışırsanız bu şekilde işler)
 */
var CatmullRomExp = 0.5;
module.exports = function kontrolNoktalariOlustur(p0, p1, p2, yumusaklik) {
    var d1x = p0[0] - p1[0];
    var d1y = p0[1] - p1[1];
    var d2x = p2[0] - p1[0];
    var d2y = p2[1] - p1[1];
    var d1a = Math.pow(d1x * d1x + d1y * d1y, CatmullRomExp / 2);
    var d2a = Math.pow(d2x * d2x + d2y * d2y, CatmullRomExp / 2);
    var numx = (d2a * d2a * d1x - d1a * d1a * d2x) * yumusaklik;
    var numy = (d2a * d2a * d1y - d1a * d1a * d2y) * yumusaklik;
    var payda1 = d2a * (d1a + d2a) * 3;
    var payda2 = d1a * (d1a + d2a) * 3;

    return [[
        p1[0] + (payda1 && numx / payda1),
        p1[1] + (payda1 && numy / payda1)
    ], [
        p1[0] - (payda2 && numx / payda2),
        p1[1] - (payda2 && numy / payda2)
    ]];
};
