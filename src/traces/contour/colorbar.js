'use strict';

// Gerekli modülleri dahil et
var RenkSkalası = require('../../components/colorscale');
var renkHaritasıOluştur = require('./make_color_map');
var sonArtı = require('./end_plus');

// Hesaplama fonksiyonu
function hesapla(gd, iz, seçenekler) {
    var konturlar = iz.konturlar;
    var çizgi = iz.çizgi;
    var boyut = konturlar.boyut || 1;
    var renklendirme = konturlar.renklendirme;
    var renkHaritası = renkHaritasıOluştur(iz, {renkÇubuğu: true});

    if(renklendirme === 'ısı haritası') {
        var renkSeçenekleri = RenkSkalası.seçenekleriÇıkar(iz);
        seçenekler._doldurmaGradyanı = renkSeçenekleri.tersSkala ? 
            RenkSkalası.skalaTersÇevir(renkSeçenekleri.renkSkalası) : 
            renkSeçenekleri.renkSkalası;
        seçenekler._zAralığı = [renkSeçenekleri.min, renkSeçenekleri.max];
    } else if(renklendirme === 'doldur') {
        seçenekler._doldurmaRengi = renkHaritası;
    }

    seçenekler._çizgi = {
        renk: renklendirme === 'çizgiler' ? renkHaritası : çizgi.renk,
        genişlik: konturlar.çizgileriGöster !== false ? çizgi.genişlik : 0,
        çizgiTipi: çizgi.çizgiTipi
    };

    seçenekler._seviyeler = {
        başlangıç: konturlar.başlangıç,
        bitiş: sonArtı(konturlar),
        boyut: boyut
    };
}

// Modülü dışa aktar
module.exports = {
    min: 'zmin',
    max: 'zmax',
    hesapla: hesapla
};
