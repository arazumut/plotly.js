'use strict';

// Gerekli modülleri dahil et
var Eksenler = require('../../plots/cartesian/axes');
var periyoduHizala = require('../../plots/cartesian/align_period');
var renkSkalasıVarMı = require('../../components/colorscale/helpers').hasColorscale;
var renkSkalasıHesapla = require('../../components/colorscale/calc');
var dizileriHesapVerisineCevir = require('./arrays_to_calcdata');
var secimHesapla = require('../scatter/calc_selection');

module.exports = function hesapla(gd, iz) {
    var xa = Eksenler.getFromId(gd, iz.xaxis || 'x');
    var ya = Eksenler.getFromId(gd, iz.yaxis || 'y');
    var boyut, pozisyon, orijinalPozisyon, pObj, periyotVar, pHarf;

    var boyutSecenekleri = {
        msUTC: !!(iz.base || iz.base === 0)
    };

    if(iz.orientation === 'h') {
        boyut = xa.makeCalcdata(iz, 'x', boyutSecenekleri);
        orijinalPozisyon = ya.makeCalcdata(iz, 'y');
        pObj = periyoduHizala(iz, ya, 'y', orijinalPozisyon);
        periyotVar = !!iz.yperiodalignment;
        pHarf = 'y';
    } else {
        boyut = ya.makeCalcdata(iz, 'y', boyutSecenekleri);
        orijinalPozisyon = xa.makeCalcdata(iz, 'x');
        pObj = periyoduHizala(iz, xa, 'x', orijinalPozisyon);
        periyotVar = !!iz.xperiodalignment;
        pHarf = 'x';
    }
    pozisyon = pObj.vals;

    // Çizilecek "hesaplanmış veriyi" oluştur
    var seriUzunlugu = Math.min(pozisyon.length, boyut.length);
    var cd = new Array(seriUzunlugu);

    // Pozisyon ve boyutu ayarla
    for(var i = 0; i < seriUzunlugu; i++) {
        cd[i] = { p: pozisyon[i], s: boyut[i] };

        if(periyotVar) {
            cd[i].orijinal_p = orijinalPozisyon[i]; // hover için kullanılır
            cd[i][pHarf + 'Son'] = pObj.ends[i];
            cd[i][pHarf + 'Baslangic'] = pObj.starts[i];
        }

        if(iz.ids) {
            cd[i].id = String(iz.ids[i]);
        }
    }

    // Otomatik z ve otomatik renk skalası eğer uygulanabilir ise
    if(renkSkalasıVarMı(iz, 'marker')) {
        renkSkalasıHesapla(gd, iz, {
            vals: iz.marker.color,
            containerStr: 'marker',
            cHarf: 'c'
        });
    }
    if(renkSkalasıVarMı(iz, 'marker.line')) {
        renkSkalasıHesapla(gd, iz, {
            vals: iz.marker.line.color,
            containerStr: 'marker.line',
            cHarf: 'c'
        });
    }

    dizileriHesapVerisineCevir(cd, iz);
    secimHesapla(cd, iz);

    return cd;
};
