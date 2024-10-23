'use strict';

module.exports = Elek;

var ayriDegerler = require('../../lib').distinctVals;

/**
 * Verileri izlerden kovalar içine elemek için yardımcı sınıf
 *
 * @class
 *
 * @param {Array} izler
 *   Hesaplanmış izlerin dizisi
 * @param {object} secenekler
 *  - @param {boolean} [negDegerAyir]
 *      Eğer true ise, aynı konumdaki verileri pozitif ve negatif
 *      değerler için ayrı çubuklara ayır
 *  - @param {boolean} [cakismaBirlesme]
 *     Eğer true ise, çakışan çubukları tek bir çubukta birleştirme
 */
function Elek(izler, secenekler) {
    this.izler = izler;
    this.negDegerAyir = secenekler.negDegerAyir;
    this.cakismaBirlesme = secenekler.cakismaBirlesme;

    // Tek kovalı histogramlar için - bkz. histogram/calc
    var genislik1 = Infinity;

    var eksenHarf = secenekler.konumEkseni._id.charAt(0);

    var konumlar = [];
    for(var i = 0; i < izler.length; i++) {
        var iz = izler[i];
        for(var j = 0; j < iz.length; j++) {
            var cubuk = iz[j];
            var konum = cubuk.p;
            if(konum === undefined) {
                konum = cubuk[eksenHarf];
            }
            if(konum !== undefined) konumlar.push(konum);
        }
        if(iz[0] && iz[0].genislik1) {
            genislik1 = Math.min(iz[0].genislik1, genislik1);
        }
    }
    this.konumlar = konumlar;

    var ad = ayriDegerler(konumlar);

    this.ayriKonumlar = ad.degerler;
    if(ad.degerler.length === 1 && genislik1 !== Infinity) this.minFark = genislik1;
    else this.minFark = Math.min(ad.minFark, genislik1);

    var tip = (secenekler.konumEkseni || {}).tip;
    if(tip === 'kategori' || tip === 'cokluKategori') {
        this.minFark = 1;
    }

    this.kovaGenisligi = this.minFark;

    this.kovalar = {};
}

/**
 * Elek verisi
 *
 * @method
 * @param {number} konum
 * @param {number} deger
 * @returns {number} Önceki kova değeri
 */
Elek.prototype.koy = function koy(konum, deger) {
    var etiket = this.etiketAl(konum, deger);
    var eskiDeger = this.kovalar[etiket] || 0;

    this.kovalar[etiket] = eskiDeger + deger;

    return eskiDeger;
};

/**
 * Belirli bir veri için mevcut kova değerini al
 *
 * @method
 * @param {number} konum  Verinin konumu
 * @param {number} [deger]   Verinin değeri
 *                           (this.negDegerAyir true ise gereklidir)
 * @returns {number} Mevcut kova değeri
 */
Elek.prototype.al = function al(konum, deger) {
    var etiket = this.etiketAl(konum, deger);
    return this.kovalar[etiket] || 0;
};

/**
 * Belirli bir veri için kova etiketini al
 *
 * @method
 * @param {number} konum  Verinin konumu
 * @param {number} [deger]   Verinin değeri
 *                           (this.negDegerAyir true ise gereklidir)
 * @returns {string} Kova etiketi
 * (değer negatifse ve this.negDegerAyir true ise 'v' ile; aksi takdirde '^' ile öneklenir)
 */
Elek.prototype.etiketAl = function etiketAl(konum, deger) {
    var onEk = (deger < 0 && this.negDegerAyir) ? 'v' : '^';
    var etiket = (this.cakismaBirlesme) ?
        konum :
        Math.round(konum / this.kovaGenisligi);
    return onEk + etiket;
};
