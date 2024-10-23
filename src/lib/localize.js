'use strict';

var Kayıt = require('../registry');

/**
 * yerelleştir: geçerli yerel ayar için bir dizeyi çevir
 *
 * @param {object} gd: bağlam için graphDiv
 *  gd._context.locale dili (& isteğe bağlı bölge/ülke) belirler
 *  her yerel ayar için sözlük ya
 *  gd._context.locales içinde ya da global olarak Plotly.register aracılığıyla sağlanabilir
 * @param {string} s: çevrilecek dize
 */
module.exports = function yerelleştir(gd, s) {
    var yerelAyar = gd._context.locale;

    /*
     * Arama önceliği:
     *     contextDicts[yerelAyar],
     *     registeredDicts[yerelAyar],
     *     contextDicts[temelYerelAyar], (eğer temelYerelAyar farklıysa)
     *     registeredDicts[temelYerelAyar]
     * Bulduğumuz ilk çeviriyi döndür.
     * Bu şekilde, bir bölgeselleştirme yaparsanız, yalnızca
     * temel yerel ayardan farklı olanı belirtmenize izin verilir, diğer her şey
     * temel yerel ayara geri döner.
     */
    for(var i = 0; i < 2; i++) {
        var yerelAyarlar = gd._context.locales;
        for(var j = 0; j < 2; j++) {
            var sözlük = (yerelAyarlar[yerelAyar] || {}).dictionary;
            if(sözlük) {
                var çıktı = sözlük[s];
                if(çıktı) return çıktı;
            }
            yerelAyarlar = Kayıt.localeRegistry;
        }

        var temelYerelAyar = yerelAyar.split('-')[0];
        if(temelYerelAyar === yerelAyar) break;
        yerelAyar = temelYerelAyar;
    }

    return s;
};
