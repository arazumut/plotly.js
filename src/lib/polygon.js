'use strict';

var dot = require('./matrix').dot;
var BADNUM = require('../constants/numerical').BADNUM;

var polygon = module.exports = {};

/**
 * Bir [x, y] çiftleri dizisini, noktaların içinde olup olmadığını test edebilen
 * bir çokgen nesnesine dönüştür
 *
 * @param ptsIn [x, y] çiftleri dizisi
 *
 * @returns polygon Nesnesi {xmin, xmax, ymin, ymax, pts, contains}
 *      (x|y)(min|max) çokgenin sınır dikdörtgenidir
 *      pts orijinal dizidir, ilk çift tekrar edilmiştir
 *      contains bir fonksiyondur: (pt, omitFirstEdge)
 *          pt test edilecek [x, y] çifti
 *          omitFirstEdge doğruysa, tam olarak ilk kenarda olan noktalar
 *              sayılmaz. Bu, bir çokgeni diğerine eklerken, birleşim yerindeki
 *              kenarı iki kez saymamak içindir.
 *          boolean döner: pt çokgenin içinde mi (kenarları dahil)
 */
polygon.tester = function tester(ptsIn) {
    var pts = ptsIn.slice();
    var xmin = pts[0][0];
    var xmax = xmin;
    var ymin = pts[0][1];
    var ymax = ymin;
    var i;

    if(
        pts[pts.length - 1][0] !== pts[0][0] ||
        pts[pts.length - 1][1] !== pts[0][1]
    ) {
        // çokgeni kapat
        pts.push(pts[0]);
    }

    for(i = 1; i < pts.length; i++) {
        xmin = Math.min(xmin, pts[i][0]);
        xmax = Math.max(xmax, pts[i][0]);
        ymin = Math.min(ymin, pts[i][1]);
        ymax = Math.max(ymax, pts[i][1]);
    }

    // bir dikdörtgenimiz var mı? Bunu burada ele alalım, böylece aynı
    // test cihazını dikdörtgen durumunda hızdan ödün vermeden kullanabiliriz

    var isRect = false;
    var rectFirstEdgeTest;

    if(pts.length === 5) {
        if(pts[0][0] === pts[1][0]) { // dikey, yatay, dikey, yatay
            if(pts[2][0] === pts[3][0] &&
                    pts[0][1] === pts[3][1] &&
                    pts[1][1] === pts[2][1]) {
                isRect = true;
                rectFirstEdgeTest = function(pt) { return pt[0] === pts[0][0]; };
            }
        } else if(pts[0][1] === pts[1][1]) { // yatay, dikey, yatay, dikey
            if(pts[2][1] === pts[3][1] &&
                    pts[0][0] === pts[3][0] &&
                    pts[1][0] === pts[2][0]) {
                isRect = true;
                rectFirstEdgeTest = function(pt) { return pt[1] === pts[0][1]; };
            }
        }
    }

    function rectContains(pt, omitFirstEdge) {
        var x = pt[0];
        var y = pt[1];

        if(x === BADNUM || x < xmin || x > xmax || y === BADNUM || y < ymin || y > ymax) {
            // pt çokgenin sınır kutusunun dışında
            return false;
        }
        if(omitFirstEdge && rectFirstEdgeTest(pt)) return false;

        return true;
    }

    function contains(pt, omitFirstEdge) {
        var x = pt[0];
        var y = pt[1];

        if(x === BADNUM || x < xmin || x > xmax || y === BADNUM || y < ymin || y > ymax) {
            // pt çokgenin sınır kutusunun dışında
            return false;
        }

        var imax = pts.length;
        var x1 = pts[0][0];
        var y1 = pts[0][1];
        var crossings = 0;
        var i;
        var x0;
        var y0;
        var xmini;
        var ycross;

        for(i = 1; i < imax; i++) {
            // pt'den yukarı doğru bir dikey çizginin
            // çokgen segmentleriyle tüm kesişimlerini bulun
            // xmax'teki kesişimler sayılmaz, nokta
            // segmentin tam üzerindeyse, içeride sayılır.
            x0 = x1;
            y0 = y1;
            x1 = pts[i][0];
            y1 = pts[i][1];
            xmini = Math.min(x0, x1);

            if(x < xmini || x > Math.max(x0, x1) || y > Math.max(y0, y1)) {
                // bu segmentin sınır kutusunun dışında, sadece bir kesişimdir
                // kutunun altındaysa.

                continue;
            } else if(y < Math.min(y0, y1)) {
                // segmentin en sol noktasını kesişim olarak sayma
                // çünkü bitişik kesişimleri iki kez saymak istemiyoruz
                // ÇOKGEN tam olarak bu x'te dikeyin ötesine geçmedikçe
                // Bu aşağıda tekrarlanır, ancak dışarıda faktörize edemeyiz
                // çünkü
                if(x !== xmini) crossings++;
            } else {
                // sınır kutusunun içinde, gerçek çizgi kesişimini kontrol edin

                // dikey segment - noktanın tam olarak
                // segmentin üzerinde olduğunu zaten biliyoruz, bu yüzden kesişimi tam olarak noktada işaretleyin.
                if(x1 === x0) ycross = y;
                // başka bir açı
                else ycross = y0 + (x - x0) * (y1 - y0) / (x1 - x0);

                // tam olarak kenarda: çokgenin içinde sayılır, ilk kenar
                // ve onu atlıyorsak hariç.
                if(y === ycross) {
                    if(i === 1 && omitFirstEdge) return false;
                    return true;
                }

                if(y <= ycross && x !== xmini) crossings++;
            }
        }

        // buraya kadar geldiysek, tek kesişimler içeride, çiftler dışarıda demektir
        return crossings % 2 === 1;
    }

    // çokgenin dejenere olup olmadığını tespit et
    var degenerate = true;
    var lastPt = pts[0];
    for(i = 1; i < pts.length; i++) {
        if(lastPt[0] !== pts[i][0] || lastPt[1] !== pts[i][1]) {
            degenerate = false;
            break;
        }
    }

    return {
        xmin: xmin,
        xmax: xmax,
        ymin: ymin,
        ymax: ymax,
        pts: pts,
        contains: isRect ? rectContains : contains,
        isRect: isRect,
        degenerate: degenerate
    };
};

/**
 * Bir nokta dizisinin bir segmentinin bükülmüş mü yoksa düz mü olduğunu test et
 *
 * @param pts [x, y] çiftleri dizisi
 * @param start düz bölümün önerilen başlangıç noktasının indeksi
 * @param end önerilen bitiş noktasının indeksi
 * @param tolerance başlangıç ve bitişi bağlayan çizgiden sapma toleransı
 *      çizginin bükülmüş sayılması için
 * @returns boolean: true bu segmentin bükülmüş olduğunu, false düz olduğunu belirtir
 */
polygon.isSegmentBent = function isSegmentBent(pts, start, end, tolerance) {
    var startPt = pts[start];
    var segment = [pts[end][0] - startPt[0], pts[end][1] - startPt[1]];
    var segmentSquared = dot(segment, segment);
    var segmentLen = Math.sqrt(segmentSquared);
    var unitPerp = [-segment[1] / segmentLen, segment[0] / segmentLen];
    var i;
    var part;
    var partParallel;

    for(i = start + 1; i < end; i++) {
        part = [pts[i][0] - startPt[0], pts[i][1] - startPt[1]];
        partParallel = dot(part, segment);

        if(partParallel < 0 || partParallel > segmentSquared ||
            Math.abs(dot(part, unitPerp)) > tolerance) return true;
    }
    return false;
};

/**
 * Bir filtreleme çokgeni oluştur, segment sayısını en aza indirmek için
 *
 * @param pts [x, y] çiftleri dizisi (en az 1 çiftle başlamalı)
 * @param tolerance düzleştirmek için izin verilen maksimum sapma
 *      noktaları kaldırarak çokgeni basitleştirmek için
 *
 * @returns Nesne {addPt, raw, filtered}
 *      addPt bir fonksiyondur (pt: [x, y] çifti) ham bir noktayı eklemek ve
 *          filtrelemeye devam etmek için
 *      raw tüm giriş noktalarıdır
 *      filtered sonuçta elde edilen filtrelenmiş [x, y] çiftleri dizisidir
 */
polygon.filter = function filter(pts, tolerance) {
    var ptsFiltered = [pts[0]];
    var doneRawIndex = 0;
    var doneFilteredIndex = 0;

    function addPt(pt) {
        pts.push(pt);
        var prevFilterLen = ptsFiltered.length;
        var iLast = doneRawIndex;
        ptsFiltered.splice(doneFilteredIndex + 1);

        for(var i = iLast + 1; i < pts.length; i++) {
            if(i === pts.length - 1 || polygon.isSegmentBent(pts, iLast, i + 1, tolerance)) {
                ptsFiltered.push(pts[i]);
                if(ptsFiltered.length < prevFilterLen - 2) {
                    doneRawIndex = i;
                    doneFilteredIndex = ptsFiltered.length - 1;
                }
                iLast = i;
            }
        }
    }

    if(pts.length > 1) {
        var lastPt = pts.pop();
        addPt(lastPt);
    }

    return {
        addPt: addPt,
        raw: pts,
        filtered: ptsFiltered
    };
};
