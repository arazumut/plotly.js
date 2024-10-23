'use strict';

// zip3 fonksiyonunu dışa aktar
module.exports = function zip3(x, y, z, uzunluk) {
    // Eğer uzunluk belirtilmemişse, x dizisinin uzunluğunu kullan
    uzunluk = uzunluk || x.length;

    // Sonuç dizisini oluştur
    var sonuc = new Array(uzunluk);
    for(var i = 0; i < uzunluk; i++) {
        // x, y ve z dizilerinin i. elemanlarını birleştir ve sonuç dizisine ekle
        sonuc[i] = [x[i], y[i], z[i]];
    }
    // Sonuç dizisini döndür
    return sonuc;
};
