'use strict';

var Lib = require('../../lib');

/*
 * Verilen bir 2D dizi ve her iki yönde bir temel ile, bu fonksiyon 2D diziyi
 * yumuşatma ve ekstrapolasyon kombinasyonu kullanarak doldurur. Bu, halı grafikleri
 * için oldukça önemlidir çünkü düzenleme için kullanılır, bu yüzden noktaları
 * basitçe atlayamayız veya boş bırakamayız. Verilerin eksik olduğunu daha sonra
 * bir şekilde temsil etsek bile, interpolasyonun noktaları bir yere koyması için
 * makul bir tahmine ihtiyacımız var.
 *
 * giriş:
 *  - data: 2D dizi
 *  - a: a.length === data[0].length olacak şekilde bir dizi
 *  - b: b.length === data.length olacak şekilde bir dizi
 */
module.exports = function smoothFill2dArray(data, a, b) {
    var i, j, k;
    var ip = [];
    var jp = [];
    // var neighborCnts = [];

    var ni = data[0].length;
    var nj = data.length;

    function avgSurrounding(i, j) {
        // Düşük kaliteli bir başlangıç olarak, çevredeki noktaları basitçe ortalayabiliriz
        // (uniform olmayan bir ızgara farkındalığı olmadan):
        var sum = 0.0;
        var val;
        var cnt = 0;
        if(i > 0 && (val = data[j][i - 1]) !== undefined) {
            cnt++;
            sum += val;
        }
        if(i < ni - 1 && (val = data[j][i + 1]) !== undefined) {
            cnt++;
            sum += val;
        }
        if(j > 0 && (val = data[j - 1][i]) !== undefined) {
            cnt++;
            sum += val;
        }
        if(j < nj - 1 && (val = data[j + 1][i]) !== undefined) {
            cnt++;
            sum += val;
        }
        return sum / Math.max(1, cnt);
    }

    // Bu döngü tüm hücreler üzerinde iterasyon yapar. Null olan hücreler not edilir ve
    // sadece bu noktalar Laplace denklemi ile güncellenir. Komşuları olan noktalar ortalama
    // alır. Hiç komşusu olmayan noktalar sıfıra ayarlanır. Ayrıca maksimum büyüklüğü izleyerek
    // toleransımızı buna göre ölçeklendirebiliriz.
    var dmax = 0.0;
    for(i = 0; i < ni; i++) {
        for(j = 0; j < nj; j++) {
            if(data[j][i] === undefined) {
                ip.push(i);
                jp.push(j);

                data[j][i] = avgSurrounding(i, j);
                // neighborCnts.push(result.neighbors);
            }
            dmax = Math.max(dmax, Math.abs(data[j][i]));
        }
    }

    if(!ip.length) return data;

    // Toleransın aşırı olması gerekmez. Bu sadece görüntüleme pozisyonlaması içindir.
    var dxp, dxm, dap, dam, dbp, dbm, c, d, diff, reldiff, overrelaxation;
    var tol = 1e-5;
    var resid = 0;
    var itermax = 100;
    var iter = 0;
    var n = ip.length;
    do {
        resid = 0;
        // Normalde iki boyutta döngü yapardık, ancak tüm noktalar boş değil ve güncellenmesi
        // gerekmiyor, bu yüzden sadece yukarıda tablolanan noktalar üzerinde döngü yapıyoruz.
        for(k = 0; k < n; k++) {
            i = ip[k];
            j = jp[k];
            // neighborCnt = neighborCnts[k];

            // Kaç katkı olduğunu izlemek için bir sayaç izleyin. Bu sayacı sonunda ortalamak
            // için kullanacağız, bu da Neumann sınır koşulları ile Laplace denklemi ile
            // ikinci türev sıfır olacak şekilde sınırda güzel bir doğrusal ekstrapolasyon
            // elde ederiz.
            var boundaryCnt = 0;
            var newVal = 0;

            var d0, d1, x0, x1, i0, j0;
            if(i === 0) {
                // Bu, i = 0 sınırı boyunca yatıyorsa, bu noktadan sağdaki iki noktadan
                // ekstrapolasyon yapın. Sonlu farklar, uniform olmayan ızgara aralıklarını
                // dikkate alır:
                i0 = Math.min(ni - 1, 2);
                x0 = a[i0];
                x1 = a[1];
                d0 = data[j][i0];
                d1 = data[j][1];
                newVal += d1 + (d1 - d0) * (a[0] - x1) / (x1 - x0);
                boundaryCnt++;
            } else if(i === ni - 1) {
                // Yüksek i sınırı boyunca, bu noktadan solundaki iki noktadan ekstrapolasyon yapın.
                i0 = Math.max(0, ni - 3);
                x0 = a[i0];
                x1 = a[ni - 2];
                d0 = data[j][i0];
                d1 = data[j][ni - 2];
                newVal += d1 + (d1 - d0) * (a[ni - 1] - x1) / (x1 - x0);
                boundaryCnt++;
            }

            if((i === 0 || i === ni - 1) && (j > 0 && j < nj - 1)) {
                // Min(i) veya max(i) sınırları boyunca, köşede olmadığımız sürece dikey olarak
                // da yumuşatın. Burada kullanılan sonlu farklar da uniform olmayan ızgara
                // aralıklarını dikkate alır:
                dxp = b[j + 1] - b[j];
                dxm = b[j] - b[j - 1];
                newVal += (dxm * data[j + 1][i] + dxp * data[j - 1][i]) / (dxm + dxp);
                boundaryCnt++;
            }

            if(j === 0) {
                // j = 0 sınırı boyunca, bu noktayı yukarısındaki iki noktadan ekstrapolasyon yapın.
                j0 = Math.min(nj - 1, 2);
                x0 = b[j0];
                x1 = b[1];
                d0 = data[j0][i];
                d1 = data[1][i];
                newVal += d1 + (d1 - d0) * (b[0] - x1) / (x1 - x0);
                boundaryCnt++;
            } else if(j === nj - 1) {
                // Aynı şekilde, max j sınırı için aşağıdaki hücrelerden:
                j0 = Math.max(0, nj - 3);
                x0 = b[j0];
                x1 = b[nj - 2];
                d0 = data[j0][i];
                d1 = data[nj - 2][i];
                newVal += d1 + (d1 - d0) * (b[nj - 1] - x1) / (x1 - x0);
                boundaryCnt++;
            }

            if((j === 0 || j === nj - 1) && (i > 0 && i < ni - 1)) {
                // Şimdi köşede olmadığımız sürece sola/sağa noktaları ortalayın:
                dxp = a[i + 1] - a[i];
                dxm = a[i] - a[i - 1];
                newVal += (dxm * data[j][i + 1] + dxp * data[j][i - 1]) / (dxm + dxp);
                boundaryCnt++;
            }

            if(!boundaryCnt) {
                // Yukarıdaki koşullardan hiçbiri tetiklenmediyse, bu bir iç noktadır ve
                // sadece Laplace denklemi güncellemesi yapabiliriz. Yukarıda olduğu gibi,
                // bu farklar uniform olmayan ızgara aralıklarını dikkate alır:
                dap = a[i + 1] - a[i];
                dam = a[i] - a[i - 1];
                dbp = b[j + 1] - b[j];
                dbm = b[j] - b[j - 1];

                // Bunlar iterasyon için kullanışlı sabitlerdir, bu oldukça basit ama
                // f_xx + f_yy = 0'dan türetmek biraz uzun sürer.
                c = dap * dam * (dap + dam);
                d = dbp * dbm * (dbp + dbm);

                newVal = (c * (dbm * data[j + 1][i] + dbp * data[j - 1][i]) +
                          d * (dam * data[j][i + 1] + dap * data[j][i - 1])) /
                          (d * (dam + dap) + c * (dbm + dbp));
            } else {
                // Sınır koşullarından katkılarımız varsa, çeşitli katkılardan sonucu ortalayın:
                newVal /= boundaryCnt;
            }

            // Jacobi güncellemeleri inanılmaz derecede yavaş bir şekilde yakınsar, bu yüzden
            // bu yaklaşım çok daha hızlı olan Gauss-Seidel iterasyonunu kullanır.
            diff = newVal - data[j][i];
            reldiff = diff / dmax;
            resid += reldiff * reldiff;

            // Gauss-Seidel benzeri iterasyon, omega bazı heuristikler ve hızlı testler
            // temelinde seçilmiştir.
            //
            // NB: Sınırları aşırı rahatlatmayın. Aksi takdirde, güvenli bir şekilde optimal
            // olan düşük bir aşırı rahatlama faktörü ayarlayın:
            overrelaxation = boundaryCnt ? 0 : 0.85;

            // Eğer dört null olmayan komşu varsa, aşırı rahatlama olmadan basit bir ortalama
            // isteriz. Tüm çevredeki noktalar null ise, tam aşırı rahatlama isteriz.
            //
            // Deneylere dayanarak, bu aslında yakınsama hızını biraz yavaşlatıyor gibi görünüyor.
            // Referans için burada bırakacağım, eğer bu yeniden gözden geçirilmesi gerekirse,
            // ancak bu şekilde gayet iyi çalışıyor gibi görünüyor.
            // if (overrelaxation) overrelaxation *= (4 - neighborCnt) / 4;

            data[j][i] += diff * (1 + overrelaxation);
        }

        resid = Math.sqrt(resid);
    } while(iter++ < itermax && resid > tol);

    Lib.log('Yumuşatıcı', iter, 'iterasyondan sonra', resid, 'ile yakınsadı');

    return data;
};
