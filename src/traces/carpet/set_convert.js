'use strict';

var sabitler = require('./constants');
var ara = require('../../lib/search').findBin;
var kontrolNoktalarınıHesapla = require('./compute_control_points');
var splineDeğerlendiriciOluştur = require('./create_spline_evaluator');
var IDerivatifDeğerlendiriciOluştur = require('./create_i_derivative_evaluator');
var JDerivatifDeğerlendiriciOluştur = require('./create_j_derivative_evaluator');

/*
 * Bir temelden diğerine geçiş yapmak için dönüşüm fonksiyonları oluşturun. Özellikle harf
 * kısaltmaları şunlardır:
 *
 *   i: ızgara boyunca i/j koordinatları. Tam sayı değerleri veri noktalarına karşılık gelir
 *   a: a/b eksenleri boyunca gerçek değerli koordinatlar
 *   c: kartezyen x-y koordinatları
 *   p: ekran alanı piksel koordinatları
 */
module.exports = function dönüşümAyarla(iz) {
    var a = iz._a;
    var b = iz._b;
    var na = a.length;
    var nb = b.length;
    var aEkseni = iz.aaxis;
    var bEkseni = iz.baxis;

    // Sınırları bir kez alın, her nokta için bağımsız olarak sınırları yeniden hesaplamayın:
    var amin = a[0];
    var amax = a[na - 1];
    var bmin = b[0];
    var bmax = b[nb - 1];
    var aralık = a[a.length - 1] - a[0];
    var bralık = b[b.length - 1] - b[0];

    // Toleransı hesaplayın, böylece noktalar halı ekseninin biraz dışında görünür:
    var atol = aralık * sabitler.GÖRELİ_CULL_TOLERANSI;
    var btol = bralık * sabitler.GÖRELİ_CULL_TOLERANSI;

    // Sınırları göreli toleransı içerecek şekilde genişletin:
    amin -= atol;
    amax += atol;
    bmin -= btol;
    bmax += btol;

    iz.görünürMü = function(a, b) {
        return a > amin && a < amax && b > bmin && b < bmax;
    };

    iz.gizliMi = function(a, b) {
        return a < amin || a > amax || b < bmin || b > bmax;
    };

    iz.ölçekAyarla = function() {
        var x = iz._x;
        var y = iz._y;

        // Bu potansiyel olarak çok pahalı bir adımdır! Kontrol noktalarının genişletilmiş bir temelini oluşturma işinin çoğunu yapar.
        // Özellikle, yeni bir dizi oluşturmak yerine mevcut temeli üzerine yazar, çünkü bu potansiyel olarak çöp toplayıcıyı zorlayabilir.
        var sonuç = kontrolNoktalarınıHesapla(iz._xctrl, iz._yctrl, x, y, aEkseni.düzgünleştirme, bEkseni.düzgünleştirme);
        iz._xctrl = sonuç[0];
        iz._yctrl = sonuç[1];

        // Bu adım sürecin ikinci adımıdır, ancak biraz daha basittir. Sadece bazı mantıkları açar çünkü her çağrıda neredeyse aynı şekilde
        // hem interpolasyonları ayrı ayrı hesaplamak hem de doğrusal vs. bikübik mantığı dahil etmek gereksiz pahalı olurdu.
        iz.xyDeğerlendir = splineDeğerlendiriciOluştur([iz._xctrl, iz._yctrl], na, nb, aEkseni.düzgünleştirme, bEkseni.düzgünleştirme);

        iz.dxydi = IDerivatifDeğerlendiriciOluştur([iz._xctrl, iz._yctrl], aEkseni.düzgünleştirme, bEkseni.düzgünleştirme);
        iz.dxydj = JDerivatifDeğerlendiriciOluştur([iz._xctrl, iz._yctrl], aEkseni.düzgünleştirme, bEkseni.düzgünleştirme);
    };

    /*
     * i/j veri ızgarası koordinatlarından a/b değerlerine dönüştürün. Özellikle, bu
     * *doğrusal* interpolasyondur, veriler bikübik olarak interpolasyon yapılsa bile.
     */
    iz.i2a = function(i) {
        var i0 = Math.max(0, Math.floor(i[0]), na - 2);
        var ti = i[0] - i0;
        return (1 - ti) * a[i0] + ti * a[i0 + 1];
    };

    iz.j2b = function(j) {
        var j0 = Math.max(0, Math.floor(j[1]), na - 2);
        var tj = j[1] - j0;
        return (1 - tj) * b[j0] + tj * b[j0 + 1];
    };

    iz.ij2ab = function(ij) {
        return [iz.i2a(ij[0]), iz.j2b(ij[1])];
    };

    /*
     * a/b koordinatlarından i/j ızgara numaralı koordinatlarına dönüştürün. Bu, a/b veri dizilerini aramayı gerektirir ve
     * bunların monoton olduğunu varsayar, bu zaten zorunlu kılınmış olmalıdır.
     */
    iz.a2i = function(aval) {
        var i0 = Math.max(0, Math.min(ara(aval, a), na - 2));
        var a0 = a[i0];
        var a1 = a[i0 + 1];
        return Math.max(0, Math.min(na - 1, i0 + (aval - a0) / (a1 - a0)));
    };

    iz.b2j = function(bval) {
        var j0 = Math.max(0, Math.min(ara(bval, b), nb - 2));
        var b0 = b[j0];
        var b1 = b[j0 + 1];
        return Math.max(0, Math.min(nb - 1, j0 + (bval - b0) / (b1 - b0)));
    };

    iz.ab2ij = function(ab) {
        return [iz.a2i(ab[0]), iz.b2j(ab[1])];
    };

    /*
     * i/j koordinatlarından x/y kartezyen koordinatlarına dönüştürün. Bu, ya bilinear ya da bikübik spline değerlendirmesi anlamına gelir,
     * ancak zor kısım bu noktada zaten yapılmıştır.
     */
    iz.i2c = function(i, j) {
        return iz.xyDeğerlendir([], i, j);
    };

    iz.ab2xy = function(aval, bval, ekstrapoleEt) {
        if(!ekstrapoleEt && (aval < a[0] || aval > a[na - 1] || bval < b[0] || bval > b[nb - 1])) {
            return [false, false];
        }
        var i = iz.a2i(aval);
        var j = iz.b2j(bval);

        var nokta = iz.xyDeğerlendir([], i, j);

        if(ekstrapoleEt) {
            // Bu bölüm, tanımlanmış aralığın dışına doğrusal olarak ekstrapole etmek için sınır türevlerini kullanır.
            // Halı ekseninin içinde bir nokta ve dışında bir nokta olan bir saçılma çizgisini düşünün. Ekstrapole etmezsek,
            // çizgiyi hiç çizemeyiz.
            var iex = 0;
            var jex = 0;
            var türev = [];

            var i0, ti, j0, tj;
            if(aval < a[0]) {
                i0 = 0;
                ti = 0;
                iex = (aval - a[0]) / (a[1] - a[0]);
            } else if(aval > a[na - 1]) {
                i0 = na - 2;
                ti = 1;
                iex = (aval - a[na - 1]) / (a[na - 1] - a[na - 2]);
            } else {
                i0 = Math.max(0, Math.min(na - 2, Math.floor(i)));
                ti = i - i0;
            }

            if(bval < b[0]) {
                j0 = 0;
                tj = 0;
                jex = (bval - b[0]) / (b[1] - b[0]);
            } else if(bval > b[nb - 1]) {
                j0 = nb - 2;
                tj = 1;
                jex = (bval - b[nb - 1]) / (b[nb - 1] - b[nb - 2]);
            } else {
                j0 = Math.max(0, Math.min(nb - 2, Math.floor(j)));
                tj = j - j0;
            }

            if(iex) {
                iz.dxydi(türev, i0, j0, ti, tj);
                nokta[0] += türev[0] * iex;
                nokta[1] += türev[1] * iex;
            }

            if(jex) {
                iz.dxydj(türev, i0, j0, ti, tj);
                nokta[0] += türev[0] * jex;
                nokta[1] += türev[1] * jex;
            }
        }

        return nokta;
    };

    iz.c2p = function(xy, xa, ya) {
        return [xa.c2p(xy[0]), ya.c2p(xy[1])];
    };

    iz.p2x = function(p, xa, ya) {
        return [xa.p2c(p[0]), ya.p2c(p[1])];
    };

    iz.dadi = function(i /* , u*/) {
        // Şu anda yalnızca parça parça doğrusal bir a veya b temeli izin verilir çünkü daha düzgün interpolasyon
        // monotonluk sorunlarına neden olur. Sonuç olarak, bu hesaplamada u tamamen göz ardı edilir, ancak
        // tamlık ve geleceğe yönelik olarak bir parametre olarak belirteceğiz. Örneğin, monoton kübik interpolasyon kullanmak mümkün olurdu.
        //
        // Bkz: https://en.wikipedia.org/wiki/Monotone_cubic_interpolation

        // u = u || 0;

        var i0 = Math.max(0, Math.min(a.length - 2, i));

        // Adım (payda) örtük olarak 1'dir çünkü bu ızgara aralığıdır.
        return a[i0 + 1] - a[i0];
    };

    iz.dbdj = function(j /* , v*/) {
        // Yukarıdaki dadi için geçerli olan uyarılar burada da geçerlidir
        var j0 = Math.max(0, Math.min(b.length - 2, j));

        // Adım (payda) örtük olarak 1'dir çünkü bu ızgara aralığıdır.
        return b[j0 + 1] - b[j0];
    };

    // Alır: ızgara hücresi koordinatı (i, j) ve kesirli ızgara hücresi koordinatları (u, v)
    // Döndürür: (dx/da, dy/db)
    //
    // NB: Ayrı ızgara hücresi + kesirli ızgara hücresi koordinat formatı, create_i_derivative_evaluator.js'de daha iyi açıklanan
    // kesintili türev nedeniyle.
    iz.dxyda = function(i0, j0, u, v) {
        var dxydi = iz.dxydi(null, i0, j0, u, v);
        var dadi = iz.dadi(i0, u);

        return [dxydi[0] / dadi, dxydi[1] / dadi];
    };

    iz.dxydb = function(i0, j0, u, v) {
        var dxydj = iz.dxydj(null, i0, j0, u, v);
        var dbdj = iz.dbdj(j0, v);

        return [dxydj[0] / dbdj, dxydj[1] / dbdj];
    };

    // Bazen hassasiyet umurumuzda olmaz ve tek istediğimiz kabaca yönlerdir (etiketlerde olduğu gibi). Bu durumda, çok kaba bir sonlu
    // fark yapabiliriz ve kesin ızgara koordinatlarıyla uğraşmak zorunda kalmayız:
    iz.dxyda_kaba = function(a, b, göreliFark) {
        var h = aralık * (göreliFark || 0.1);
        var artı = iz.ab2xy(a + h, b, true);
        var eksi = iz.ab2xy(a - h, b, true);

        return [
            (artı[0] - eksi[0]) * 0.5 / h,
            (artı[1] - eksi[1]) * 0.5 / h
        ];
    };

    iz.dxydb_kaba = function(a, b, göreliFark) {
        var h = bralık * (göreliFark || 0.1);
        var artı = iz.ab2xy(a, b + h, true);
        var eksi = iz.ab2xy(a, b - h, true);

        return [
            (artı[0] - eksi[0]) * 0.5 / h,
            (artı[1] - eksi[1]) * 0.5 / h
        ];
    };

    iz.dpdx = function(xa) {
        return xa._m;
    };

    iz.dpdy = function(ya) {
        return ya._m;
    };
};
