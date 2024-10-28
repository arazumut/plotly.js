'use strict';
module.exports = {
    // marching squares algoritması için bazı sabitler
    // her indeks için yol nereden başlar?
    ALTBAŞLANGIÇ: [1, 9, 13, 104, 713],
    ÜSTBAŞLANGIÇ: [4, 6, 7, 104, 713],
    SOLBAŞLANGIÇ: [8, 12, 14, 208, 1114],
    SAĞBAŞLANGIÇ: [2, 3, 11, 208, 1114],

    // belirli bir indeksten hangi yönde [dx,dy] çıkış yaparız?
    // saddles (çıkıntılar) zaten belirsizleştirilmiş
    YENİDELTA: [
        null, [-1, 0], [0, -1], [-1, 0],
        [1, 0], null, [0, -1], [-1, 0],
        [0, 1], [0, 1], null, [0, 1],
        [1, 0], [1, 0], [0, -1]
    ],

    // her saddle (çıkıntı) için, burada ilk indeks
    // dx||dy<0 için, ikinci dx||dy>0 için kullanılır
    SADDLESEÇİMİ: {
        104: [4, 1],
        208: [2, 8],
        713: [7, 13],
        1114: [11, 14]
    },

    // bir saddle (çıkıntı) için bir indeks kullanıldıktan sonra,
    // daha sonra kullanılmak üzere hangi indeksin yerine geçer?
    SADDLEKALAN: {1: 4, 2: 8, 4: 1, 7: 13, 8: 2, 11: 14, 13: 7, 14: 11},

    // bir etiket başına, kontur uzunluğu, grafik alanı çaprazının katı olarak
    ETİKETMESAFESİ: 2,

    // belirli bir kontur seviyesinden sonra, çizdiğimiz etiket sayısını artırmaya başlarız.
    // Birçok kontur genellikle birbirine yakın olacaktır, bu yüzden bir etiketi bulmak için uzun bir yol izlemek zor olacaktır
    ETİKETARTIŞI: 10,

    // bir kontur çizgisinin minimum uzunluğu, etiket uzunluğunun katı olarak,
    // herhangi bir etiket çizdiğimizde
    ETİKETMİN: 3,

    // tek bir kontur yolunda çizeceğimiz maksimum etiket sayısı, ne kadar uzun olursa olsun
    ETİKETMAKS: 10,

    // etiket pozisyonu maliyet fonksiyonu için sabitler
    ETİKETOPTİMİZATÖR: {
        // kenar yakınlığına verilen ağırlık
        KENARMALİYETİ: 1,
        // yataydan sapma açısına verilen ağırlık
        AÇIMALİYETİ: 1,
        // zaten yerleştirilmiş etiketlerden uzaklığa verilen ağırlık
        KOMŞUMALİYETİ: 5,
        // aynı seviyedeki etiketler için maliyet çarpanı
        AYNISEVİYEFAKTÖRÜ: 10,
        // aynı seviyedeki etiketler için minimum mesafe (etiket uzunluğunun katı olarak)
        AYNISEVİYEMESAFESİ: 5,
        // etiketi yerleştirmeyeceğimiz maksimum maliyet
        MAKSİMUMMALİYET: 100,
        // aramanın ilk iterasyonunda bakılacak eşit aralıklı nokta sayısı
        İLKARAMANOKTALARI: 10,
        // ilk geniş aramadan sonra yapılan ikili arama iterasyon sayısı
        İTERASYONLAR: 5
    }
};
