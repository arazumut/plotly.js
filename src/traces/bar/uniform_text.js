'use strict';

var d3 = require('@plotly/d3');
var Lib = require('../../lib');

function metniYenidenBoyutlandır(gd, gIz, izTipi) {
    var tamYerleşim = gd._fullLayout;
    var minBoyut = tamYerleşim['_' + izTipi + 'Metin_minboyut'];
    if(minBoyut) {
        var gizlenmeli = tamYerleşim.uniformtext.mode === 'hide';

        var seçici;
        switch(izTipi) {
            case 'huniAlanı' :
            case 'pasta' :
            case 'güneşPatlaması' :
                seçici = 'g.dilim';
                break;
            case 'ağaçHaritası' :
            case 'buzul' :
                seçici = 'g.dilim, g.yolÇubuğu';
                break;
            default :
                seçici = 'g.noktalar > g.nokta';
        }

        gIz.selectAll(seçici).each(function(d) {
            var dönüşüm = d.transform;
            if(dönüşüm) {
                dönüşüm.ölçek = (gizlenmeli && dönüşüm.gizle) ? 0 : minBoyut / dönüşüm.fontBoyutu;

                var el = d3.select(this).select('text');
                Lib.dönüşümVeGörünürlüğüAyarla(el, dönüşüm);
            }
        });
    }
}

function minMetinBoyutunuKaydet(
    izTipi, // giriş
    dönüşüm, // giriş/çıkış
    tamYerleşim // giriş/çıkış
) {
    if(tamYerleşim.uniformtext.mode) {
        var minAnahtar = minAnahtarıAl(izTipi);
        var minBoyut = tamYerleşim.uniformtext.minboyut;
        var boyut = dönüşüm.ölçek * dönüşüm.fontBoyutu;

        dönüşüm.gizle = boyut < minBoyut;

        tamYerleşim[minAnahtar] = tamYerleşim[minAnahtar] || Infinity;
        if(!dönüşüm.gizle) {
            tamYerleşim[minAnahtar] = Math.min(
                tamYerleşim[minAnahtar],
                Math.max(boyut, minBoyut)
            );
        }
    }
}

function minMetinBoyutunuTemizle(
    izTipi, // giriş
    tamYerleşim // giriş/çıkış
) {
    var minAnahtar = minAnahtarıAl(izTipi);
    tamYerleşim[minAnahtar] = undefined;
}

function minAnahtarıAl(izTipi) {
    return '_' + izTipi + 'Metin_minboyut';
}

module.exports = {
    minMetinBoyutunuKaydet: minMetinBoyutunuKaydet,
    minMetinBoyutunuTemizle: minMetinBoyutunuTemizle,
    metniYenidenBoyutlandır: metniYenidenBoyutlandır
};
