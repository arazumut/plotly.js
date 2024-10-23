'use strict';

var mod = require('./mod').mod;

/*
 * İki doğru parçasının kesişim noktasını bul
 *   (1->2 ve 3->4) - kesişiyorlarsa [x,y] dizisini döndürür, kesişmiyorlarsa null döndürür
 */
exports.dogruParcalariKesisiyorMu = dogruParcalariKesisiyorMu;
function dogruParcalariKesisiyorMu(x1, y1, x2, y2, x3, y3, x4, y4) {
    var a = x2 - x1;
    var b = x3 - x1;
    var c = x4 - x3;
    var d = y2 - y1;
    var e = y3 - y1;
    var f = y4 - y3;
    var det = a * f - c * d;
    // paralel doğrular? kesişim tanımsız
    // kolinear oldukları durumu göz ardı et
    if(det === 0) return null;
    var t = (b * f - c * e) / det;
    var u = (b * d - a * e) / det;
    // doğrular kesişmiyor mu?
    if(u < 0 || u > 1 || t < 0 || t > 1) return null;

    return {x: x1 + a * t, y: y1 + d * t};
}

/*
 * İki doğru parçası arasındaki minimum mesafeyi bul (1->2 ve 3->4)
 */
exports.dogruParcasiMesafesi = function dogruParcasiMesafesi(x1, y1, x2, y2, x3, y3, x4, y4) {
    if(dogruParcalariKesisiyorMu(x1, y1, x2, y2, x3, y3, x4, y4)) return 0;

    // iki doğru parçası ve bunların kare uzunlukları
    var x12 = x2 - x1;
    var y12 = y2 - y1;
    var x34 = x4 - x3;
    var y34 = y4 - y3;
    var ll12 = x12 * x12 + y12 * y12;
    var ll34 = x34 * x34 + y34 * y34;

    // mesafeyi kare olarak hesapla, sonra en sonunda karekök al
    var dist2 = Math.min(
        dikMesafe2(x12, y12, ll12, x3 - x1, y3 - y1),
        dikMesafe2(x12, y12, ll12, x4 - x1, y4 - y1),
        dikMesafe2(x34, y34, ll34, x1 - x3, y1 - y3),
        dikMesafe2(x34, y34, ll34, x2 - x3, y2 - y3)
    );

    return Math.sqrt(dist2);
};

/*
 * Doğru parçası ab'den noktaya c olan mesafenin karesi
 * [xab, yab] vektörü b-a
 * [xac, yac] vektörü c-a
 * llab (b-a)'nın kare uzunluğu, sadece hesaplamayı basitleştirmek için
 */
function dikMesafe2(xab, yab, llab, xac, yac) {
    var fcAB = (xac * xab + yac * yab);
    if(fcAB < 0) {
        // nokta c, nokta a'ya daha yakın
        return xac * xac + yac * yac;
    } else if(fcAB > llab) {
        // nokta c, nokta b'ye daha yakın
        var xbc = xac - xab;
        var ybc = yac - yab;
        return xbc * xbc + ybc * ybc;
    } else {
        // dik mesafe en kısa olan
        var carpim = xac * yab - yac * xab;
        return carpim * carpim / llab;
    }
}

// getTextLocation için çok kısa süreli bir önbellek, sadece
// aynı konumları birden çok kez dönerken kullanıyoruz
// farklı bir yola baktığımızda geçersiz kılınır
var konumCache, calismaYolu, calismaMetinGenisligi;

// bir yol ve üzerindeki konumu verilen metin için x, y ve açıyı döndür
exports.getTextKonumu = function getTextKonumu(path, totalPathLen, positionOnPath, textWidth) {
    if(path !== calismaYolu || textWidth !== calismaMetinGenisligi) {
        konumCache = {};
        calismaYolu = path;
        calismaMetinGenisligi = textWidth;
    }
    if(konumCache[positionOnPath]) {
        return konumCache[positionOnPath];
    }

    // açı için, yol üzerindeki noktaları metin genişliği ile ayrılmış olarak kullan
    // eğrilik nedeniyle, metin bundan biraz daha fazla kaplayacak olsa da
    var p0 = path.getPointAtLength(mod(positionOnPath - textWidth / 2, totalPathLen));
    var p1 = path.getPointAtLength(mod(positionOnPath + textWidth / 2, totalPathLen));
    // not: atan 1/0'ı güzelce işler
    var theta = Math.atan((p1.y - p0.y) / (p1.x - p0.x));
    // metni, merkez konumunun 2/3'ü ve p0/p1 orta noktasının 1/3'ü ile ortala
    // bu segmentin ortalama konumu, yaklaşık olarak kuadratik olduğunu varsayarak
    var pCenter = path.getPointAtLength(mod(positionOnPath, totalPathLen));
    var x = (pCenter.x * 4 + p0.x + p1.x) / 6;
    var y = (pCenter.y * 4 + p0.y + p1.y) / 6;

    var out = {x: x, y: y, theta: theta};
    konumCache[positionOnPath] = out;
    return out;
};

exports.konumCacheTemizle = function() {
    calismaYolu = null;
};

/*
 * Görünür alan içinde olan `path` segmentini bul
 * `bounds` tarafından verilen {left, right, top, bottom} ile, `buffer` px hassasiyetinde
 *
 * döndürür: görünür bir şey yoksa undefined, aksi takdirde nesne:
 * {
 *   min: yolun sınırları ilk girdiği konum, veya sınırlar içinde başlıyorsa 0
 *   max: yolun sınırları son çıktığı konum, veya sınırlar içinde bitiyorsa yol uzunluğu
 *   len: max - min, yani görünür yol uzunluğu
 *   total: toplam yol uzunluğu - sadece çağıranın path.getTotalLength()'i tekrar çağırmasına gerek kalmaması için dahil edildi
 *   isClosed: yolun başlangıç ve bitiş noktaları her ikisi de görünür ve aynı noktada ise true
 * }
 *
 * Bir uçtan başlayarak ve bu noktadan plot alanına olan mesafeyi tekrar tekrar bularak çalışır,
 * ve eğer dışarıdaysa, bu mesafe boyunca yol boyunca hareket eder (çünkü plot en azından bu kadar uzakta olmalıdır).
 * Bir yolun plot alanına girip, çıkıp, tekrar girdiği durumları yakalamayacağız.
 */
exports.gorunurSegmentiAl = function gorunurSegmentiAl(path, bounds, buffer) {
    var left = bounds.left;
    var right = bounds.right;
    var top = bounds.top;
    var bottom = bounds.bottom;

    var pMin = 0;
    var pTotal = path.getTotalLength();
    var pMax = pTotal;

    var pt0, ptTotal;

    function plotMesafesiAl(len) {
        var pt = path.getPointAtLength(len);

        // başlangıç ve bitiş noktalarını `closed` için sakla
        if(len === 0) pt0 = pt;
        else if(len === pTotal) ptTotal = pt;

        var dx = (pt.x < left) ? left - pt.x : (pt.x > right ? pt.x - right : 0);
        var dy = (pt.y < top) ? top - pt.y : (pt.y > bottom ? pt.y - bottom : 0);
        return Math.sqrt(dx * dx + dy * dy);
    }

    var plotMesafesi = plotMesafesiAl(pMin);
    while(plotMesafesi) {
        pMin += plotMesafesi + buffer;
        if(pMin > pMax) return;
        plotMesafesi = plotMesafesiAl(pMin);
    }

    plotMesafesi = plotMesafesiAl(pMax);
    while(plotMesafesi) {
        pMax -= plotMesafesi + buffer;
        if(pMin > pMax) return;
        plotMesafesi = plotMesafesiAl(pMax);
    }

    return {
        min: pMin,
        max: pMax,
        len: pMax - pMin,
        total: pTotal,
        isClosed: pMin === 0 && pMax === pTotal &&
            Math.abs(pt0.x - ptTotal.x) < 0.1 &&
            Math.abs(pt0.y - ptTotal.y) < 0.1
    };
};

/**
 * Belirli bir kısıtlama koordinatına karşılık gelen SVG yolundaki noktayı bul
 *
 * @param {SVGPathElement} path
 * @param {Number} val : kısıtlama koordinat değeri
 * @param {String} coord : 'x' veya 'y' kısıtlama koordinatı
 * @param {Object} opts :
 *  - {Number} pathLength : toplam yol uzunluğunu önceden ver
 *  - {Number} tolerance
 *  - {Number} iterationLimit
 * @return {SVGPoint}
 */
exports.yolUzerindeNoktaBul = function yolUzerindeNoktaBul(path, val, coord, opts) {
    opts = opts || {};

    var pathLength = opts.pathLength || path.getTotalLength();
    var tolerance = opts.tolerance || 1e-3;
    var iterationLimit = opts.iterationLimit || 30;

    // yol, val'den daha büyük bir değerde başlıyorsa (dikey kemanlar gibi),
    // hesaplanan farkın işaretini tersine çevirmemiz gerekir.
    var mul = path.getPointAtLength(0)[coord] > path.getPointAtLength(pathLength)[coord] ? -1 : 1;

    var i = 0;
    var b0 = 0;
    var b1 = pathLength;
    var mid;
    var pt;
    var diff;

    while(i < iterationLimit) {
        mid = (b0 + b1) / 2;
        pt = path.getPointAtLength(mid);
        diff = pt[coord] - val;

        if(Math.abs(diff) < tolerance) {
            return pt;
        } else {
            if(mul * diff > 0) {
                b1 = mid;
            } else {
                b0 = mid;
            }
            i++;
        }
    }
    return pt;
};
