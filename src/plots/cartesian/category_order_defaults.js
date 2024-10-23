'use strict';

var isTypedArraySpec = require('../../lib/array').isTypedArraySpec;

function kategorileriBul(ax, opts) {
    var veriOzelligi = opts.veriOzelligi || ax._id.charAt(0);
    var lookup = {};
    var axVerisi;
    var i, j;

    if(opts.axVerisi) {
        // x/y olmayan durum
        axVerisi = opts.axVerisi;
    } else {
        // x/y durumu
        axVerisi = [];
        for(i = 0; i < opts.veri.length; i++) {
            var iz = opts.veri[i];
            if(iz[veriOzelligi + 'axis'] === ax._id) {
                axVerisi.push(iz);
            }
        }
    }

    for(i = 0; i < axVerisi.length; i++) {
        var degerler = axVerisi[i][veriOzelligi];
        for(j = 0; j < degerler.length; j++) {
            var deger = degerler[j];
            if(deger !== null && deger !== undefined) {
                lookup[deger] = 1;
            }
        }
    }

    return Object.keys(lookup);
}

/**
 * Kategori* varsayılan ve başlangıç kategorilerini doldurur.
 *
 * @param {object} containerIn : giriş eksen nesnesi
 * @param {object} containerOut : tam eksen nesnesi
 * @param {function} zorla : Lib.coerce fonksiyon sarmalayıcısı
 * @param {object} opts :
 *   - veri {array} : (tam) veri izi
 * VEYA
 *   - axVerisi {array} : burada zorlanan eksenle ilişkili (tam) veri
 *   - veriOzelligi {string} : koordinat dizisine karşılık gelen öznitelik adı
 */
module.exports = function kategoriSiraVarsayilanlariniIsle(containerIn, containerOut, zorla, opts) {
    if(containerOut.type !== 'category') return;

    var diziIn = containerIn.categoryarray;
    var gecerliDizi = (Array.isArray(diziIn) && diziIn.length > 0) ||
        isTypedArraySpec(diziIn);

    // geçerli olmayan dizi ile 'categoryorder' 'array' olarak ayarlanamaz
    var siraVarsayilan;
    if(gecerliDizi) siraVarsayilan = 'array';

    var sira = zorla('categoryorder', siraVarsayilan);
    var dizi;

    // 'categoryarray' sadece dizi sırası durumunda zorlanır
    if(sira === 'array') {
        dizi = zorla('categoryarray');
    }

    // geçersiz 'categoryarray' ile 'categoryorder' 'array' olarak ayarlanamaz
    if(!gecerliDizi && sira === 'array') {
        sira = containerOut.categoryorder = 'trace';
    }

    // makeCalcdata için şeyleri ayarla
    if(sira === 'trace') {
        containerOut._initialCategories = [];
    } else if(sira === 'array') {
        containerOut._initialCategories = dizi.slice();
    } else {
        dizi = kategorileriBul(containerOut, opts).sort();
        if(sira === 'category ascending') {
            containerOut._initialCategories = dizi;
        } else if(sira === 'category descending') {
            containerOut._initialCategories = dizi.reverse();
        }
    }
};
