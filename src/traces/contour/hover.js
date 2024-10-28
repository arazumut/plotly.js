'use strict';

// Renk bileşenini içe aktar
var Renk = require('../../components/color');

// Isı haritası hover noktalarını içe aktar
var isiharitasiHoverNoktalari = require('../heatmap/hover');

// hoverNoktalari fonksiyonunu dışa aktar
module.exports = function hoverNoktalari(noktaVerisi, xDegeri, yDegeri, hoverModu, secenekler) {
    if(!secenekler) secenekler = {};
    secenekler.konturMu = true;

    // Isı haritası hover verilerini al
    var hoverVerisi = isiharitasiHoverNoktalari(noktaVerisi, xDegeri, yDegeri, hoverModu, secenekler);

    if(hoverVerisi) {
        hoverVerisi.forEach(function(hoverNoktasi) {
            var iz = hoverNoktasi.iz;
            if(iz.konturlar.tipi === 'kisitlama') {
                if(iz.dolguRengi && Renk.seffaflik(iz.dolguRengi)) {
                    hoverNoktasi.renk = Renk.seffaflikEkle(iz.dolguRengi, 1);
                } else if(iz.konturlar.cizgileriGoster && Renk.seffaflik(iz.cizgi.renk)) {
                    hoverNoktasi.renk = Renk.seffaflikEkle(iz.cizgi.renk, 1);
                }
            }
        });
    }

    return hoverVerisi;
};
