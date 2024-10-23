'use strict';

var Eksenler = require('../../plots/cartesian/axes');
var extendFlat = require('../../lib/extend').extendFlat;

module.exports = function etiketleriHesapla(iz, eksen) {
    var i, tobj, önek, sonek, ızgaraÇizgisi;

    var etiketler = eksen._etiketler = [];
    var ızgaraÇizgileri = eksen._ızgaraÇizgileri;

    for(i = 0; i < ızgaraÇizgileri.length; i++) {
        ızgaraÇizgisi = ızgaraÇizgileri[i];

        if(['başlangıç', 'her ikisi'].indexOf(eksen.gösteretiketleri) !== -1) {
            tobj = Eksenler.çizgiMetni(eksen, ızgaraÇizgisi.değer);

            extendFlat(tobj, {
                önek: önek,
                sonek: sonek,
                sonÇapa: true,
                xy: ızgaraÇizgisi.xy(0),
                dxy: ızgaraÇizgisi.dxy(0, 0),
                eksen: ızgaraÇizgisi.eksen,
                uzunluk: ızgaraÇizgisi.çaprazEksen.uzunluk,
                yazıtipi: ızgaraÇizgisi.eksen.çizgiyazıtipi,
                ilkMi: i === 0,
                sonMu: i === ızgaraÇizgileri.length - 1
            });

            etiketler.push(tobj);
        }

        if(['son', 'her ikisi'].indexOf(eksen.gösteretiketleri) !== -1) {
            tobj = Eksenler.çizgiMetni(eksen, ızgaraÇizgisi.değer);

            extendFlat(tobj, {
                sonÇapa: false,
                xy: ızgaraÇizgisi.xy(ızgaraÇizgisi.çaprazUzunluk - 1),
                dxy: ızgaraÇizgisi.dxy(ızgaraÇizgisi.çaprazUzunluk - 2, 1),
                eksen: ızgaraÇizgisi.eksen,
                uzunluk: ızgaraÇizgisi.çaprazEksen.uzunluk,
                yazıtipi: ızgaraÇizgisi.eksen.çizgiyazıtipi,
                ilkMi: i === 0,
                sonMu: i === ızgaraÇizgileri.length - 1
            });

            etiketler.push(tobj);
        }
    }
};
