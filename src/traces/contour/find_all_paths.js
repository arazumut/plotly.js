'use strict';

var Lib = require('../../lib');
var constants = require('./constants');

module.exports = function findAllPaths(pathinfo, xtol, ytol) {
    var cnt,
        startLoc,
        i,
        pi,
        j;

    // Varsayılan olarak bu değerler olduğu gibi geçer:
    xtol = xtol || 0.01;
    ytol = ytol || 0.01;

    for(i = 0; i < pathinfo.length; i++) {
        pi = pathinfo[i];

        for(j = 0; j < pi.starts.length; j++) {
            startLoc = pi.starts[j];
            makePath(pi, startLoc, 'edge', xtol, ytol);
        }

        cnt = 0;
        while(Object.keys(pi.crossings).length && cnt < 10000) {
            cnt++;
            startLoc = Object.keys(pi.crossings)[0].split(',').map(Number);
            makePath(pi, startLoc, undefined, xtol, ytol);
        }
        if(cnt === 10000) Lib.log('Konturda sonsuz döngü mü?');
    }
};

function equalPts(pt1, pt2, xtol, ytol) {
    return Math.abs(pt1[0] - pt2[0]) < xtol &&
           Math.abs(pt1[1] - pt2[1]) < ytol;
}

// İndeks birimlerinde mesafe - noktaların 3. ve 4. öğelerini kullanır
function ptDist(pt1, pt2) {
    var dx = pt1[2] - pt2[2];
    var dy = pt1[3] - pt2[3];
    return Math.sqrt(dx * dx + dy * dy);
}

function makePath(pi, loc, edgeflag, xtol, ytol) {
    var locStr = loc.join(',');
    var mi = pi.crossings[locStr];
    var marchStep = getStartStep(mi, edgeflag, loc);
    // Geriye doğru yarım adım atarak ve kesişme noktasını bularak başla
    var pts = [getInterpPx(pi, loc, [-marchStep[0], -marchStep[1]])];
    var m = pi.z.length;
    var n = pi.z[0].length;
    var startLoc = loc.slice();
    var startStep = marchStep.slice();
    var cnt;

    // Şimdi yolu takip et
    for(cnt = 0; cnt < 10000; cnt++) { // sonsuz döngülerden kaçınmak için
        if(mi > 20) {
            mi = constants.CHOOSESADDLE[mi][(marchStep[0] || marchStep[1]) < 0 ? 0 : 1];
            pi.crossings[locStr] = constants.SADDLEREMAINDER[mi];
        } else {
            delete pi.crossings[locStr];
        }

        marchStep = constants.NEWDELTA[mi];
        if(!marchStep) {
            Lib.log('Kötü bir yürüyüş indeksi bulundu:', mi, loc, pi.level);
            break;
        }

        // İleriye doğru yarım adım atarak kesişme noktasını bul ve ardından tam adımı at
        pts.push(getInterpPx(pi, loc, marchStep));
        loc[0] += marchStep[0];
        loc[1] += marchStep[1];
        locStr = loc.join(',');

        // Aynı noktayı birden fazla kez dahil etme
        if(equalPts(pts[pts.length - 1], pts[pts.length - 2], xtol, ytol)) pts.pop();

        var atEdge = (marchStep[0] && (loc[0] < 0 || loc[0] > n - 2)) ||
                (marchStep[1] && (loc[1] < 0 || loc[1] > m - 2));

        var closedLoop = loc[0] === startLoc[0] && loc[1] === startLoc[1] &&
                marchStep[0] === startStep[0] && marchStep[1] === startStep[1];

        // Bir döngüyü tamamladık mı yoksa bir kenara mı ulaştık?
        if((closedLoop) || (edgeflag && atEdge)) break;

        mi = pi.crossings[locStr];
    }

    if(cnt === 10000) {
        Lib.log('Konturda sonsuz döngü mü?');
    }
    var closedpath = equalPts(pts[0], pts[pts.length - 1], xtol, ytol);
    var totaldist = 0;
    var distThresholdFactor = 0.2 * pi.smoothing;
    var alldists = [];
    var cropstart = 0;
    var distgroup, cnt2, cnt3, newpt, ptcnt, ptavg, thisdist,
        i, j, edgepathi, edgepathj;

    /*
     * Birbirine çok yakın olan noktaları kontrol et (<1/5 ortalama mesafe
     * *grid indeks birimlerinde* (log eksenleri ve düzensiz ızgaralar için önemli),
     * daha az pürüzsüzleştirilmişse daha az) ve sadece merkezi (veya merkez 2'nin ortalamasını) al.
     * Bu, bir nokta bir kontur seviyesine çok yakın olduğunda tuhaf davranışları azaltır.
     */
    for(cnt = 1; cnt < pts.length; cnt++) {
        thisdist = ptDist(pts[cnt], pts[cnt - 1]);
        totaldist += thisdist;
        alldists.push(thisdist);
    }

    var distThreshold = totaldist / alldists.length * distThresholdFactor;

    function getpt(i) { return pts[i % pts.length]; }

    for(cnt = pts.length - 2; cnt >= cropstart; cnt--) {
        distgroup = alldists[cnt];
        if(distgroup < distThreshold) {
            cnt3 = 0;
            for(cnt2 = cnt - 1; cnt2 >= cropstart; cnt2--) {
                if(distgroup + alldists[cnt2] < distThreshold) {
                    distgroup += alldists[cnt2];
                } else break;
            }

            // Yakın noktalar sınır boyunca dolanarak kapalı yol?
            if(closedpath && cnt === pts.length - 2) {
                for(cnt3 = 0; cnt3 < cnt2; cnt3++) {
                    if(distgroup + alldists[cnt3] < distThreshold) {
                        distgroup += alldists[cnt3];
                    } else break;
                }
            }
            ptcnt = cnt - cnt2 + cnt3 + 1;
            ptavg = Math.floor((cnt + cnt2 + cnt3 + 2) / 2);

            // Her iki uç nokta dahil: uç noktayı koru
            if(!closedpath && cnt === pts.length - 2) newpt = pts[pts.length - 1];
            else if(!closedpath && cnt2 === -1) newpt = pts[0];

            // Tek sayıda nokta - sadece merkezi al
            else if(ptcnt % 2) newpt = getpt(ptavg);

            // Çift sayıda nokta - merkezi iki noktanın ortalamasını al
            else {
                newpt = [(getpt(ptavg)[0] + getpt(ptavg + 1)[0]) / 2,
                    (getpt(ptavg)[1] + getpt(ptavg + 1)[1]) / 2];
            }

            pts.splice(cnt2 + 1, cnt - cnt2 + 1, newpt);
            cnt = cnt2 + 1;
            if(cnt3) cropstart = cnt3;
            if(closedpath) {
                if(cnt === pts.length - 2) pts[cnt3] = pts[pts.length - 1];
                else if(cnt === 0) pts[pts.length - 1] = pts[0];
            }
        }
    }
    pts.splice(0, cropstart);

    // İndeks parçalarıyla işimiz bitti - bunları kaldır ki yol oluşturma doğru çalışsın
    // çünkü sadece [xpx, ypx] içeren noktalara bağlı
    for(cnt = 0; cnt < pts.length; cnt++) pts[cnt].length = 2;

    // Tek noktalı yolları döndürme (yani tüm noktalar aynıydı
    // bu yüzden silindiler mi?)
    if(pts.length < 2) return;
    else if(closedpath) {
        pts.pop();
        pi.paths.push(pts);
    } else {
        if(!edgeflag) {
            Lib.log('Kapalı olmayan iç kontur?',
                pi.level, startLoc.join(','), pts.join('L'));
        }

        // Kenar yolu - mevcut bir kenar yolunun başladığı yerde mi başlıyor veya bitiyor mu?
        var merged = false;
        for(i = 0; i < pi.edgepaths.length; i++) {
            edgepathi = pi.edgepaths[i];
            if(!merged && equalPts(edgepathi[0], pts[pts.length - 1], xtol, ytol)) {
                pts.pop();
                merged = true;

                // Şimdi başka bir yolun (veya aynı yolun) sonuna da mı ulaşıyor?
                var doublemerged = false;
                for(j = 0; j < pi.edgepaths.length; j++) {
                    edgepathj = pi.edgepaths[j];
                    if(equalPts(edgepathj[edgepathj.length - 1], pts[0], xtol, ytol)) {
                        doublemerged = true;
                        pts.shift();
                        pi.edgepaths.splice(i, 1);
                        if(j === i) {
                            // Yol şimdi kapalı
                            pi.paths.push(pts.concat(edgepathj));
                        } else {
                            if(j > i) j--;
                            pi.edgepaths[j] = edgepathj.concat(pts, edgepathi);
                        }
                        break;
                    }
                }
                if(!doublemerged) {
                    pi.edgepaths[i] = pts.concat(edgepathi);
                }
            }
        }
        for(i = 0; i < pi.edgepaths.length; i++) {
            if(merged) break;
            edgepathi = pi.edgepaths[i];
            if(equalPts(edgepathi[edgepathi.length - 1], pts[0], xtol, ytol)) {
                pts.shift();
                pi.edgepaths[i] = edgepathi.concat(pts);
                merged = true;
            }
        }

        if(!merged) pi.edgepaths.push(pts);
    }
}

// Yolun ilk noktasının yürüyüş adımını almak için özel fonksiyon (loc'a götüren)
function getStartStep(mi, edgeflag, loc) {
    var dx = 0;
    var dy = 0;
    if(mi > 20 && edgeflag) {
        // Bu eyerler +/- x'te başlar
        if(mi === 208 || mi === 1114) {
            // Sol tarafta başlıyorsak, sağa gidiyoruz demektir
            dx = loc[0] === 0 ? 1 : -1;
        } else {
            // Altta başlıyorsak, yukarı gidiyoruz demektir
            dy = loc[1] === 0 ? 1 : -1;
        }
    } else if(constants.BOTTOMSTART.indexOf(mi) !== -1) dy = 1;
    else if(constants.LEFTSTART.indexOf(mi) !== -1) dx = 1;
    else if(constants.TOPSTART.indexOf(mi) !== -1) dy = -1;
    else dx = -1;
    return [dx, dy];
}

/*
 * Belirli bir kesişmenin piksel koordinatlarını bulun
 *
 * @param {object} pi: bu seviyedeki pathinfo nesnesi
 * @param {array} loc: kesişmenin grid indeksi [x, y]
 * @param {array} step: grid üzerinde hareket ettiğimiz yön [dx, dy]
 *
 * @return {array} [xpx, ypx, xi, yi]: ilk ikisi piksel konumu,
 *   sonraki ikisi mesafe hesaplamaları için kullanılan interpolasyonlu grid indeksleridir,
 *   birbirine çok yakın olan noktaları silmek için kullanılır.
 *   Bu, grid düzensiz olduğunda (ve en dramatik olarak log eksenlerinde ve geçersiz (0 veya negatif) değerler içerdiğinde) önemlidir.
 *   Bu ekstra iki öğeyi bir dizi bu noktalardan bir yola dönüştürmeden önce silmek çok önemlidir,
 *   çünkü bu rutinler uzunluk-2 noktalar gerektirir.
 */
function getInterpPx(pi, loc, step) {
    var locx = loc[0] + Math.max(step[0], 0);
    var locy = loc[1] + Math.max(step[1], 0);
    var zxy = pi.z[locy][locx];
    var xa = pi.xaxis;
    var ya = pi.yaxis;

    // Doğrusal alanda interpolasyon yap, ardından piksele dönüştür
    if(step[1]) {
        var dx = (pi.level - zxy) / (pi.z[locy][locx + 1] - zxy);
        // Interpolasyon yap, ancak log ekseni için NaN doğrusal değerlerine karşı koruma (dx 1 veya 0 olacaktır)
        var dxl =
            (dx !== 1 ? (1 - dx) * xa.c2l(pi.x[locx]) : 0) +
            (dx !== 0 ? dx * xa.c2l(pi.x[locx + 1]) : 0);

        return [xa.c2p(xa.l2c(dxl), true),
            ya.c2p(pi.y[locy], true),
            locx + dx, locy];
    } else {
        var dy = (pi.level - zxy) / (pi.z[locy + 1][locx] - zxy);
        var dyl =
            (dy !== 1 ? (1 - dy) * ya.c2l(pi.y[locy]) : 0) +
            (dy !== 0 ? dy * ya.c2l(pi.y[locy + 1]) : 0);

        return [xa.c2p(pi.x[locx], true),
            ya.c2p(ya.l2c(dyl), true),
            locx, locy + dy];
    }
}
