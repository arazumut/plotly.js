'use strict';

var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var BADNUM = require('../../constants/numerical').BADNUM;

var isArrayOrTypedArray = Lib.isArrayOrTypedArray;
var isDateTime = Lib.isDateTime;
var cleanNumber = Lib.cleanNumber;
var round = Math.round;

module.exports = function otomatikTip(array, takvim, seçenekler) {
    var dizi = array;

    var cokluKategoriYok = seçenekler.cokluKategoriYok;
    if(isArrayOrTypedArray(dizi) && !dizi.length) return '-';
    if(!cokluKategoriYok && cokluKategori(dizi)) return 'coklukategori';
    if(cokluKategoriYok && Array.isArray(dizi[0])) { // burada tiplenmiş dizileri düzleştirmeye gerek yok
        var b = [];
        for(var i = 0; i < dizi.length; i++) {
            if(isArrayOrTypedArray(dizi[i])) {
                for(var j = 0; j < dizi[i].length; j++) {
                    b.push(dizi[i][j]);
                }
            }
        }
        dizi = b;
    }

    if(dahaCokTarih(dizi, takvim)) return 'tarih';

    var sayisalDonustur = seçenekler.otomatikTipSayilar !== 'katı'; // otomatikTipSayilar seçeneklerde sağlanmamışsa, katı ile karşılaştır
    if(kategori(dizi, sayisalDonustur)) return 'kategori';
    if(lineerTamam(dizi, sayisalDonustur)) return 'lineer';

    return '-';
};

function tipNumaraVarMi(deger, sayisalDonustur) {
    return sayisalDonustur ? isNumeric(deger) : typeof deger === 'number';
}

// dizide en az bir sayı var mı? Eğer yoksa, ax.type boş bırakılmalı ki daha sonra otomatik olarak ayarlanabilsin
function lineerTamam(dizi, sayisalDonustur) {
    var uzunluk = dizi.length;

    for(var i = 0; i < uzunluk; i++) {
        if(tipNumaraVarMi(dizi[i], sayisalDonustur)) return true;
    }

    return false;
}

// dizi çoğunlukla tarihlerden mi oluşuyor? 
// not: bazı değerler ne sayı ne de tarih olabilir (boşluklar, metinler gibi)
// 2 veya 4 basamaklı tamsayılar hem sayı hem de tarih olabilir, bu yüzden
// çoğunlukla 2 ve 4 basamaklı sayılar ve birkaç tarih içeren durumları dışlamak için
// tarihler, sayıların iki katı olmalıdır
// kategorilerde olduğu gibi, sadece AYRIK değerleri dikkate al.
function dahaCokTarih(dizi, takvim) {
    var uzunluk = dizi.length;

    var artış = artışAl(uzunluk);
    var tarihler = 0;
    var sayilar = 0;
    var gorulen = {};

    for(var f = 0; f < uzunluk; f += artış) {
        var i = round(f);
        var deger = dizi[i];
        var degerStr = String(deger);
        if(gorulen[degerStr]) continue;
        gorulen[degerStr] = 1;

        if(isDateTime(deger, takvim)) tarihler++;
        if(isNumeric(deger)) sayilar++;
    }

    return tarihler > sayilar * 2;
}

// en fazla 1000 noktayı, eşit aralıklarla test etmek için artış değeri döndür
function artışAl(uzunluk) {
    return Math.max(1, (uzunluk - 1) / 1000);
}

// gd.data'daki (x,y)-değerleri çoğunlukla metin mi?
// sayılardan iki kat fazla AYRIK kategori gerektirir
function kategori(dizi, sayisalDonustur) {
    var uzunluk = dizi.length;

    var artış = artışAl(uzunluk);
    var sayilar = 0;
    var kategoriler = 0;
    var gorulen = {};

    for(var f = 0; f < uzunluk; f += artış) {
        var i = round(f);
        var deger = dizi[i];
        var degerStr = String(deger);
        if(gorulen[degerStr]) continue;
        gorulen[degerStr] = 1;

        var tip = typeof deger;
        if(tip === 'boolean') kategoriler++;
        else if(sayisalDonustur ? cleanNumber(deger) !== BADNUM : tip === 'number') sayilar++;
        else if(tip === 'string') kategoriler++;
    }

    return kategoriler > sayilar * 2;
}

// çoklu kategori için çok gevşek gereksinimler,
// hiçbir zaman çoklu kategoriye otomatik olarak geçmemesi gereken iz modülleri
// 'cokluKategoriYok' ile belirtilmelidir
function cokluKategori(dizi) {
    return isArrayOrTypedArray(dizi[0]) && isArrayOrTypedArray(dizi[1]);
}
