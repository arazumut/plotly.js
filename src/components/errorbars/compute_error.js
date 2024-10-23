'use strict';

/**
 * Hata çubuğu hesaplama fonksiyonu oluşturucu
 *
 * Not: Oluşturulan fonksiyon veri noktası girişlerini temizlemez. Sayısal olmayan
 * girişler tanımsız hata büyüklüklerine neden olur.
 *
 * @param {object} seçenekler hata çubuğu özellikleri
 *
 * @return {function} :
 *      @param {numeric} veriNoktası hata büyüklüğünü hesaplamak için kullanılan veri noktası
 *      @param {number} indeks veriNoktası'nın ilgili veri dizisindeki indeksi
 *      @return {array}
 *        - hata[0] : negatif yöndeki hata büyüklüğü
 *        - hata[1] : pozitif yöndeki hata büyüklüğü
 */
module.exports = function hataHesaplaOlustur(seçenekler) {
    var tür = seçenekler.tür;
    var simetrik = seçenekler.simetrik;

    if(tür === 'veri') {
        var dizi = seçenekler.dizi || [];

        if(simetrik) {
            return function hataHesapla(veriNoktası, indeks) {
                var değer = +(dizi[indeks]);
                return [değer, değer];
            };
        } else {
            var diziEksi = seçenekler.diziEksi || [];
            return function hataHesapla(veriNoktası, indeks) {
                var değer = +dizi[indeks];
                var değerEksi = +diziEksi[indeks];
                // biri mevcut ve diğeri eksikse, mevcut olanı yine de görmek için 0 ile doldurun.
                // Özellikle manuel veri girişi sırasında kullanışlıdır.
                if(!isNaN(değer) || !isNaN(değerEksi)) {
                    return [değerEksi || 0, değer || 0];
                }
                return [NaN, NaN];
            };
        }
    } else {
        var hataDeğeriHesapla = hataDeğeriHesaplaOlustur(tür, seçenekler.değer);
        var hataDeğeriEksiHesapla = hataDeğeriHesaplaOlustur(tür, seçenekler.değerEksi);

        if(simetrik || seçenekler.değerEksi === undefined) {
            return function hataHesapla(veriNoktası) {
                var değer = hataDeğeriHesapla(veriNoktası);
                return [değer, değer];
            };
        } else {
            return function hataHesapla(veriNoktası) {
                return [
                    hataDeğeriEksiHesapla(veriNoktası),
                    hataDeğeriHesapla(veriNoktası)
                ];
            };
        }
    }
};

/**
 * Hata çubuğu büyüklüğünü hesapla (veri türü hariç tüm türler için)
 *
 * @param {string} tür hata çubuğu türü
 * @param {numeric} değer hata çubuğu değeri
 *
 * @return {function} :
 *      @param {numeric} veriNoktası
 */
function hataDeğeriHesaplaOlustur(tür, değer) {
    if(tür === 'yüzde') {
        return function(veriNoktası) {
            return Math.abs(veriNoktası * değer / 100);
        };
    }
    if(tür === 'sabit') {
        return function() {
            return Math.abs(değer);
        };
    }
    if(tür === 'karekök') {
        return function(veriNoktası) {
            return Math.sqrt(Math.abs(veriNoktası));
        };
    }
}
