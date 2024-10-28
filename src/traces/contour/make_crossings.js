'use strict';

var constants = require('./constants');

// Tüm seviyeler için tüm marching indekslerini hesapla.
// Kapsamlı olmak istediğimiz için, sadece bir yolu takip etmek yerine
// her kesişimde kontur geçişlerini kontrol edeceğiz.
// TODO: İç döngüyü sadece ilgili seviyelerle kısalt
module.exports = function makeCrossings(pathinfo) {
    var z = pathinfo[0].z;
    var m = z.length;
    var n = z[0].length; // interp2d'de z'nin düzensiz olmadığından emin olduk
    var ikiGeniş = m === 2 || n === 2;
    var xi;
    var yi;
    var başlangıçIndeksleri;
    var yBaşlangıçIndeksleri;
    var etiket;
    var köşeler;
    var mi;
    var pi;
    var i;

    for(yi = 0; yi < m - 1; yi++) {
        yBaşlangıçIndeksleri = [];
        if(yi === 0) yBaşlangıçIndeksleri = yBaşlangıçIndeksleri.concat(constants.BOTTOMSTART);
        if(yi === m - 2) yBaşlangıçIndeksleri = yBaşlangıçIndeksleri.concat(constants.TOPSTART);

        for(xi = 0; xi < n - 1; xi++) {
            başlangıçIndeksleri = yBaşlangıçIndeksleri.slice();
            if(xi === 0) başlangıçIndeksleri = başlangıçIndeksleri.concat(constants.LEFTSTART);
            if(xi === n - 2) başlangıçIndeksleri = başlangıçIndeksleri.concat(constants.RIGHTSTART);

            etiket = xi + ',' + yi;
            köşeler = [[z[yi][xi], z[yi][xi + 1]],
                       [z[yi + 1][xi], z[yi + 1][xi + 1]]];
            for(i = 0; i < pathinfo.length; i++) {
                pi = pathinfo[i];
                mi = getMarchingIndex(pi.level, köşeler);
                if(!mi) continue;

                pi.crossings[etiket] = mi;
                if(başlangıçIndeksleri.indexOf(mi) !== -1) {
                    pi.starts.push([xi, yi]);
                    if(ikiGeniş && başlangıçIndeksleri.indexOf(mi,
                            başlangıçIndeksleri.indexOf(mi) + 1) !== -1) {
                        // Aynı kare karşıt taraflardan başlangıçlara sahip
                        // Bir köşenin karşıt kenarlarında başlangıçların olması mümkün değil,
                        // sadece bir başlangıç ve bir bitiş olabilir...
                        // Ancak dizi sadece iki nokta genişliğinde ise (her iki yönde de)
                        // karşıt taraflarda başlangıçlar olabilir.
                        pi.starts.push([xi, yi]);
                    }
                }
            }
        }
    }
};

// Değiştirilmiş marching squares algoritması,
// böylece başlangıçtan itibaren saddle noktalarını ayırt ederiz
// ve geçiş olmayan durumları görmezden geliriz
// Kullandığım indeks şu temele dayanıyor:
// http://en.wikipedia.org/wiki/Marching_squares
// Ancak saddle noktaları ikiye ayrılır ve onları
// iki uygun saddle olmayan indeksin ondalık kombinasyonu olarak temsil ederim
function getMarchingIndex(val, köşeler) {
    var mi = (köşeler[0][0] > val ? 0 : 1) +
             (köşeler[0][1] > val ? 0 : 2) +
             (köşeler[1][1] > val ? 0 : 4) +
             (köşeler[1][0] > val ? 0 : 8);
    if(mi === 5 || mi === 10) {
        var ortalama = (köşeler[0][0] + köşeler[0][1] +
                        köşeler[1][0] + köşeler[1][1]) / 4;
        // Büyük bir vadi ile iki zirve
        if(val > ortalama) return (mi === 5) ? 713 : 1114;
        // Büyük bir sırt ile iki vadi
        return (mi === 5) ? 104 : 208;
    }
    return (mi === 15) ? 0 : mi;
}
