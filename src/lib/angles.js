'use strict';

var modModule = require('./mod');
var mod = modModule.mod;
var modHalf = modModule.modHalf;

var PI = Math.PI;
var ikiPI = 2 * PI;

function dereceyiRadyanaCevir(derece) { return derece / 180 * PI; }

function radyaniDereceyeCevir(radyan) { return radyan / PI * 180; }

/**
 * sektör tam bir daire mi?
 * ... bu SVG yol çizim rutinlerinde sıkça karşılaşılan bir durum
 *
 * Not: 2pi'den fazla olan tüm sektörleri 'tam' daire olarak kabul ediyoruz
 *
 * @param {2 öğeli dizi} aBnds : açısal sınırlar *radyan* cinsinden
 * @return {boolean}
 */
function tamDaireMi(aBnds) {
    return Math.abs(aBnds[1] - aBnds[0]) > ikiPI - 1e-14;
}

/**
 * 'a' ve 'b' açısı arasındaki açısal delta
 * çözüm şu kaynaktan alınmıştır: https://stackoverflow.com/a/2007279
 *
 * @param {number} a : ilk açı *radyan* cinsinden
 * @param {number} b : ikinci açı *radyan* cinsinden
 * @return {number} açısal delta *radyan* cinsinden
 */
function aciDelta(a, b) {
    return modHalf(b - a, ikiPI);
}

/**
 * 'a' ve 'b' açısı arasındaki açısal mesafe
 *
 * @param {number} a : ilk açı *radyan* cinsinden
 * @param {number} b : ikinci açı *radyan* cinsinden
 * @return {number} açısal mesafe *radyan* cinsinden
 */
function aciMesafesi(a, b) {
    return Math.abs(aciDelta(a, b));
}

/**
 * açı sektör içinde mi?
 *
 * @param {number} a : test edilecek açı *radyan* cinsinden
 * @param {2 öğeli dizi} aBnds : sektörün açısal sınırları *radyan* cinsinden
 * @param {boolean}
 */
function aciSektorIcindeMi(a, aBnds) {
    if(tamDaireMi(aBnds)) return true;

    var s0, s1;

    if(aBnds[0] < aBnds[1]) {
        s0 = aBnds[0];
        s1 = aBnds[1];
    } else {
        s0 = aBnds[1];
        s1 = aBnds[0];
    }

    s0 = mod(s0, ikiPI);
    s1 = mod(s1, ikiPI);
    if(s0 > s1) s1 += ikiPI;

    var a0 = mod(a, ikiPI);
    var a1 = a0 + ikiPI;

    return (a0 >= s0 && a0 <= s1) || (a1 >= s0 && a1 <= s1);
}

/**
 * nokta (r,a) sektör içinde mi?
 *
 * @param {number} r : noktanın radyal koordinatı
 * @param {number} a : noktanın açısal koordinatı *radyan* cinsinden
 * @param {2 öğeli dizi} rBnds : sektörün radyal sınırları
 * @param {2 öğeli dizi} aBnds : sektörün açısal sınırları *radyan* cinsinden
 * @return {boolean}
 */
function noktaSektorIcindeMi(r, a, rBnds, aBnds) {
    if(!aciSektorIcindeMi(a, aBnds)) return false;

    var r0, r1;

    if(rBnds[0] < rBnds[1]) {
        r0 = rBnds[0];
        r1 = rBnds[1];
    } else {
        r0 = rBnds[1];
        r1 = rBnds[0];
    }

    return r >= r0 && r <= r1;
}

// pathArc, pathSector ve pathAnnulus için ortak
function _yol(r0, r1, a0, a1, cx, cy, kapaliMi) {
    cx = cx || 0;
    cy = cy || 0;

    var tamDaire = tamDaireMi([a0, a1]);
    var aBaslangic, aOrta, aSon;
    var rBaslangic, rSon;

    if(tamDaire) {
        aBaslangic = 0;
        aOrta = PI;
        aSon = ikiPI;
    } else {
        if(a0 < a1) {
            aBaslangic = a0;
            aSon = a1;
        } else {
            aBaslangic = a1;
            aSon = a0;
        }
    }

    if(r0 < r1) {
        rBaslangic = r0;
        rSon = r1;
    } else {
        rBaslangic = r1;
        rSon = r0;
    }

    // Not: burada svg koordinatları, y aşağı doğru artar
    function nokta(r, a) {
        return [r * Math.cos(a) + cx, cy - r * Math.sin(a)];
    }

    var buyukYay = Math.abs(aSon - aBaslangic) <= PI ? 0 : 1;
    function yay(r, a, saatYonu) {
        return 'A' + [r, r] + ' ' + [0, buyukYay, saatYonu] + ' ' + nokta(r, a);
    }

    var p;

    if(tamDaire) {
        if(rBaslangic === null) {
            p = 'M' + nokta(rSon, aBaslangic) +
                yay(rSon, aOrta, 0) +
                yay(rSon, aSon, 0) + 'Z';
        } else {
            p = 'M' + nokta(rBaslangic, aBaslangic) +
                yay(rBaslangic, aOrta, 0) +
                yay(rBaslangic, aSon, 0) + 'Z' +
                'M' + nokta(rSon, aBaslangic) +
                yay(rSon, aOrta, 1) +
                yay(rSon, aSon, 1) + 'Z';
        }
    } else {
        if(rBaslangic === null) {
            p = 'M' + nokta(rSon, aBaslangic) + yay(rSon, aSon, 0);
            if(kapaliMi) p += 'L0,0Z';
        } else {
            p = 'M' + nokta(rBaslangic, aBaslangic) +
                'L' + nokta(rSon, aBaslangic) +
                yay(rSon, aSon, 0) +
                'L' + nokta(rBaslangic, aSon) +
                yay(rBaslangic, aBaslangic, 1) + 'Z';
        }
    }

    return p;
}

/**
 * bir yay yolu
 *
 * @param {number} r : yarıçap
 * @param {number} a0 : ilk açısal koordinat *radyan* cinsinden
 * @param {number} a1 : ikinci açısal koordinat *radyan* cinsinden
 * @param {number (isteğe bağlı)} cx : merkezin x koordinatı
 * @param {number (isteğe bağlı)} cy : merkezin y koordinatı
 * @return {string} svg yolu
 */
function yayYolu(r, a0, a1, cx, cy) {
    return _yol(null, r, a0, a1, cx, cy, 0);
}

/**
 * bir sektör yolu
 *
 * @param {number} r : yarıçap
 * @param {number} a0 : ilk açısal koordinat *radyan* cinsinden
 * @param {number} a1 : ikinci açısal koordinat *radyan* cinsinden
 * @param {number (isteğe bağlı)} cx : merkezin x koordinatı
 * @param {number (isteğe bağlı)} cy : merkezin y koordinatı
 * @return {string} svg yolu
 */
function sektorYolu(r, a0, a1, cx, cy) {
    return _yol(null, r, a0, a1, cx, cy, 1);
}

/**
 * bir halka yolu
 *
 * @param {number} r0 : ilk radyal koordinat
 * @param {number} r1 : ikinci radyal koordinat
 * @param {number} a0 : ilk açısal koordinat *radyan* cinsinden
 * @param {number} a1 : ikinci açısal koordinat *radyan* cinsinden
 * @param {number (isteğe bağlı)} cx : merkezin x koordinatı
 * @param {number (isteğe bağlı)} cy : merkezin y koordinatı
 * @return {string} svg yolu
 */
function halkaYolu(r0, r1, a0, a1, cx, cy) {
    return _yol(r0, r1, a0, a1, cx, cy, 1);
}

module.exports = {
    dereceyiRadyanaCevir: dereceyiRadyanaCevir,
    radyaniDereceyeCevir: radyaniDereceyeCevir,
    aciDelta: aciDelta,
    aciMesafesi: aciMesafesi,
    tamDaireMi: tamDaireMi,
    aciSektorIcindeMi: aciSektorIcindeMi,
    noktaSektorIcindeMi: noktaSektorIcindeMi,
    yayYolu: yayYolu,
    sektorYolu: sektorYolu,
    halkaYolu: halkaYolu
};
