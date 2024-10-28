'use strict';

var RenkSkalası = require('../../components/colorscale');

var ısıHaritasıHesapla = require('../heatmap/calc');
var konturlarıAyarla = require('./set_contours');
var sonArtı = require('./end_plus');

// çoğu ısı haritası hesaplaması ile aynı, sonra ayarla
// yine de ısı haritası hesaplaması içinde birkaç şey
// kontur haritalarını arıyor, çünkü makeBoundArray çağrıları çok iç içe
module.exports = function hesapla(gd, iz) {
    var cd = ısıHaritasıHesapla(gd, iz);

    var zOut = cd[0].z;
    konturlarıAyarla(iz, zOut);

    var konturlar = iz.konturlar;
    var renkSeçenekleri = RenkSkalası.extractOpts(iz);
    var renkDeğerleri;

    if(konturlar.renklendirme === 'ısı haritası' && renkSeçenekleri.oto && iz.otoKontur === false) {
        var başlangıç = konturlar.başlangıç;
        var son = sonArtı(konturlar);
        var konturBoyutu = konturlar.boyut || 1;
        var konturSayısı = Math.floor((son - başlangıç) / konturBoyutu) + 1;

        if(!isFinite(konturBoyutu)) {
            konturBoyutu = 1;
            konturSayısı = 1;
        }

        var min0 = başlangıç - konturBoyutu / 2;
        var max0 = min0 + konturSayısı * konturBoyutu;
        renkDeğerleri = [min0, max0];
    } else {
        renkDeğerleri = zOut;
    }

    RenkSkalası.hesapla(gd, iz, {değerler: renkDeğerleri, harf: 'z'});

    return cd;
};
