'use strict';

var nestedProperty = require('./nested_property');

var BASIT_OZELLIK_REGEX = /^\w*$/;

// Güncellenenleri belirlemek için bitmask. Bazen isim güncellenmeli,
// bazen değer güncellenmeli ve bazen de her ikisi. Bu, yeni güncellemeleri
// basit bir OR işlemiyle birleştirmenin basit bir yoludur.
//
// Tek istisna, özelliği açıkça kaldırmamız gerektiğinde UNSET bitidir.
// Bu durum, nestedProperty'nin null/undefined ile özel şekilde başa çıkma
// biçiminden kaynaklanır. `null` belirttiğinizde, ağaçtaki kullanılmayan
// öğeleri budar. Null ile undefined karışıklığı yaşadığım için, UNSET
// özelliği açıkça kaldırmak için `null` göndermeye zorlayan bir bittir.
var HICBIRI = 0;
var ISIM = 1;
var DEGER = 2;
var HER_IKISI = 3;
var KALDIR = 4;

module.exports = function anahtarliKapsayici(temelNesne, yol, anahtarIsmi, degerIsmi) {
    anahtarIsmi = anahtarIsmi || 'isim';
    degerIsmi = degerIsmi || 'deger';
    var i, dizi, temelOzellik;
    var degisimTurleri = {};

    if(yol && yol.length) {
        temelOzellik = nestedProperty(temelNesne, yol);
        dizi = temelOzellik.get();
    } else {
        dizi = temelNesne;
    }

    yol = yol || '';

    // Bir indeks oluştur:
    var indeksBul = {};
    if(dizi) {
        for(i = 0; i < dizi.length; i++) {
            indeksBul[dizi[i][anahtarIsmi]] = i;
        }
    }

    var basitDegerOzelligi = BASIT_OZELLIK_REGEX.test(degerIsmi);

    var nesne = {
        ayarla: function(isim, deger) {
            var degisimTuru = deger === null ? KALDIR : HICBIRI;

            // Gerekirse temel diziyi oluştur
            if(!dizi) {
                if(!temelOzellik || degisimTuru === KALDIR) return;

                dizi = [];
                temelOzellik.set(dizi);
            }

            var indeks = indeksBul[isim];
            if(indeks === undefined) {
                if(degisimTuru === KALDIR) return;

                degisimTuru = degisimTuru | HER_IKISI;
                indeks = dizi.length;
                indeksBul[isim] = indeks;
            } else if(deger !== (basitDegerOzelligi ? dizi[indeks][degerIsmi] : nestedProperty(dizi[indeks], degerIsmi).get())) {
                degisimTuru = degisimTuru | DEGER;
            }

            var yeniDeger = dizi[indeks] = dizi[indeks] || {};
            yeniDeger[anahtarIsmi] = isim;

            if(basitDegerOzelligi) {
                yeniDeger[degerIsmi] = deger;
            } else {
                nestedProperty(yeniDeger, degerIsmi).set(deger);
            }

            // Eğer kaldırma değilse, bu biti kaldırmaya zorla.
            if(deger !== null) {
                degisimTuru = degisimTuru & ~KALDIR;
            }

            degisimTurleri[indeks] = degisimTurleri[indeks] | degisimTuru;

            return nesne;
        },
        getir: function(isim) {
            if(!dizi) return;

            var indeks = indeksBul[isim];

            if(indeks === undefined) {
                return undefined;
            } else if(basitDegerOzelligi) {
                return dizi[indeks][degerIsmi];
            } else {
                return nestedProperty(dizi[indeks], degerIsmi).get();
            }
        },
        yenidenAdlandir: function(isim, yeniIsim) {
            var indeks = indeksBul[isim];

            if(indeks === undefined) return nesne;
            degisimTurleri[indeks] = degisimTurleri[indeks] | ISIM;

            indeksBul[yeniIsim] = indeks;
            delete indeksBul[isim];

            dizi[indeks][anahtarIsmi] = yeniIsim;

            return nesne;
        },
        kaldir: function(isim) {
            var indeks = indeksBul[isim];

            if(indeks === undefined) return nesne;

            var nesne = dizi[indeks];
            if(Object.keys(nesne).length > 2) {
                // Bu nesne anahtar/değer dışında daha fazla içerik içeriyor, bu yüzden
                // değeri değiştirmeden kaldır:
                degisimTurleri[indeks] = degisimTurleri[indeks] | DEGER;
                return nesne.ayarla(isim, null);
            }

            if(basitDegerOzelligi) {
                for(i = indeks; i < dizi.length; i++) {
                    degisimTurleri[i] = degisimTurleri[i] | HER_IKISI;
                }
                for(i = indeks; i < dizi.length; i++) {
                    indeksBul[dizi[i][anahtarIsmi]]--;
                }
                dizi.splice(indeks, 1);
                delete(indeksBul[isim]);
            } else {
                // Bu güncellemeyi *kesinlikle* gerçekleştirin, böylece sonucun budanıp budanmadığını kontrol edebiliriz.
                // Eğer öyleyse, bu bir kaldırmadır. Değilse, bu sadece bir değer kaldırmadır.
                nestedProperty(nesne, degerIsmi).set(null);

                // Şimdi üst düzey nested property'nin herhangi bir anahtarı olup olmadığını kontrol edin.
                // Eğer öyleyse, nesne hala değerlere sahiptir, bu yüzden sadece anahtarı kaldırmak istiyoruz.
                // Değilse, başka veri olmadığı için tüm nesne kaldırılabilir.
                // var ustDuzeyAnahtarlar = Object.keys(nesne[degerIsmi.split('.')[0]] || []);

                degisimTurleri[indeks] = degisimTurleri[indeks] | DEGER | KALDIR;
            }

            return nesne;
        },
        guncellemeOlustur: function() {
            var astr, indeks;
            var guncelleme = {};
            var degisenler = Object.keys(degisimTurleri);
            for(var i = 0; i < degisenler.length; i++) {
                indeks = degisenler[i];
                astr = yol + '[' + indeks + ']';
                if(dizi[indeks]) {
                    if(degisimTurleri[indeks] & ISIM) {
                        guncelleme[astr + '.' + anahtarIsmi] = dizi[indeks][anahtarIsmi];
                    }
                    if(degisimTurleri[indeks] & DEGER) {
                        if(basitDegerOzelligi) {
                            guncelleme[astr + '.' + degerIsmi] = (degisimTurleri[indeks] & KALDIR) ? null : dizi[indeks][degerIsmi];
                        } else {
                            guncelleme[astr + '.' + degerIsmi] = (degisimTurleri[indeks] & KALDIR) ? null : nestedProperty(dizi[indeks], degerIsmi).get();
                        }
                    }
                } else {
                    guncelleme[astr] = null;
                }
            }

            return guncelleme;
        }
    };

    return nesne;
};
