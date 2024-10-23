'use strict';

var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');

module.exports = function pozisyonVarsayılanlarınıEleAl(containerIn, containerOut, zorla, seçenekler) {
    var karşıAkslar = seçenekler.karşıAkslar || [];
    var üstÜsteBinilebilirAkslar = seçenekler.üstÜsteBinilebilirAkslar || [];
    var harf = seçenekler.harf;
    var ızgara = seçenekler.ızgara;
    var üstÜsteBinenAlan = seçenekler.üstÜsteBinenAlan;
    var varsayılanBağlama, varsayılanAlan, varsayılanTaraf, varsayılanPozisyon, varsayılanKaydırma, varsayılanOtomatikKenarBoşluğu;

    if(ızgara) {
        varsayılanAlan = ızgara._alanlar[harf][ızgara._aksHaritası[containerOut._id]];
        varsayılanBağlama = ızgara._bağlamalar[containerOut._id];
        if(varsayılanAlan) {
            varsayılanTaraf = ızgara[harf + 'taraf'].split(' ')[0];
            varsayılanPozisyon = ızgara.alan[harf][varsayılanTaraf === 'sağ' || varsayılanTaraf === 'üst' ? 1 : 0];
        }
    }

    // Izgara olsa bile, bu eksen içinde olmayabilir - ızgara dışı varsayılanlara geri dön
    varsayılanAlan = varsayılanAlan || [0, 1];
    varsayılanBağlama = varsayılanBağlama || (isNumeric(containerIn.pozisyon) ? 'serbest' : (karşıAkslar[0] || 'serbest'));
    varsayılanTaraf = varsayılanTaraf || (harf === 'x' ? 'alt' : 'sol');
    varsayılanPozisyon = varsayılanPozisyon || 0;
    varsayılanKaydırma = 0;
    varsayılanOtomatikKenarBoşluğu = false;

    var bağlama = Lib.zorla(containerIn, containerOut, {
        bağlama: {
            valType: 'enumerated',
            values: ['serbest'].concat(karşıAkslar),
            dflt: varsayılanBağlama
        }
    }, 'bağlama');

    var taraf = Lib.zorla(containerIn, containerOut, {
        taraf: {
            valType: 'enumerated',
            values: harf === 'x' ? ['alt', 'üst'] : ['sol', 'sağ'],
            dflt: varsayılanTaraf
        }
    }, 'taraf');

    if(bağlama === 'serbest') {
        if(harf === 'y') {
            var otomatikKaydırma = zorla('otomatikKaydırma');
            if(otomatikKaydırma) {
                varsayılanPozisyon = taraf === 'sol' ? üstÜsteBinenAlan[0] : üstÜsteBinenAlan[1];
                varsayılanOtomatikKenarBoşluğu = containerOut.otomatikKenarBoşluğu ? containerOut.otomatikKenarBoşluğu : true;
                varsayılanKaydırma = taraf === 'sol' ? -3 : 3;
            }
            zorla('kaydırma', varsayılanKaydırma);
        }
        zorla('pozisyon', varsayılanPozisyon);
    }
    zorla('otomatikKenarBoşluğu', varsayılanOtomatikKenarBoşluğu);

    var üstÜsteBinme = false;
    if(üstÜsteBinilebilirAkslar.length) {
        üstÜsteBinme = Lib.zorla(containerIn, containerOut, {
            üstÜsteBinme: {
                valType: 'enumerated',
                values: [false].concat(üstÜsteBinilebilirAkslar),
                dflt: false
            }
        }, 'üstÜsteBinme');
    }

    if(!üstÜsteBinme) {
        var alan = zorla('alan', varsayılanAlan);

        if(alan[0] > alan[1] - 1 / 4096) containerOut.alan = varsayılanAlan;
        Lib.noneOrAll(containerIn.alan, containerOut.alan, varsayılanAlan);

        if(containerOut.tickmode === 'sync') {
            containerOut.tickmode = 'auto';
        }
    }

    zorla('katman');

    return containerOut;
};
