'use strict';

// Gerekli modülleri dahil et
var Kayıt = require('../../registry');
var Kütüphane = require('../../lib');
var yerleşimÖzellikleri = require('./layout_attributes');

// Yerleşim varsayılanlarını sağlama fonksiyonu
function _varsayılanlarıSağla(yerleşimGirdi, yerleşimÇıktı, tamVeri, zorla, izTipi) {
    var kategori = izTipi + 'Yerleşim';
    var izTipiVar = false;

    // Verilerde iz tipini kontrol et
    for(var i = 0; i < tamVeri.length; i++) {
        var iz = tamVeri[i];

        if(Kayıt.izMi(iz, kategori)) {
            izTipiVar = true;
            break;
        }
    }
    if(!izTipiVar) return;

    // Zorunlu yerleşim özelliklerini sağla
    zorla(izTipi + 'modu');
    zorla(izTipi + 'boşluk');
    zorla(izTipi + 'grupboşluğu');
}

// Ana yerleşim varsayılanlarını sağlama fonksiyonu
function yerleşimVarsayılanlarınıSağla(yerleşimGirdi, yerleşimÇıktı, tamVeri) {
    function zorla(özellik, varsayılan) {
        return Kütüphane.zorla(yerleşimGirdi, yerleşimÇıktı, yerleşimÖzellikleri, özellik, varsayılan);
    }
    _varsayılanlarıSağla(yerleşimGirdi, yerleşimÇıktı, tamVeri, zorla, 'kutu');
}

// Modülü dışa aktar
module.exports = {
    yerleşimVarsayılanlarınıSağla: yerleşimVarsayılanlarınıSağla,
    _varsayılanlarıSağla: _varsayılanlarıSağla
};
