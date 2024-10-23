'use strict';

// Belirli bir boyutun kesirini kullanarak adlandırılmış bir konuma ulaşmak için
module.exports = {
    // sol alt köşeden: bu, kağıt-referanslı konumlandırma sistemimizin başlangıç noktasıdır
    SOL_ALT: {
        sol: 0,
        orta: 0.5,
        sağ: 1,
        alt: 0,
        orta: 0.5,
        üst: 1
    },
    // sol üst köşeden: bu, ekran piksel konumlandırma başlangıç noktasıdır
    SOL_ÜST: {
        sol: 0,
        orta: 0.5,
        sağ: 1,
        alt: 1,
        orta: 0.5,
        üst: 0
    },
    // sağ alt köşeden: bazen sadece tersine ihtiyacınız olur
    SAĞ_ALT: {
        sol: 1,
        orta: 0.5,
        sağ: 0,
        alt: 0,
        orta: 0.5,
        üst: 1
    },
    // satırlar arasındaki dikey mesafeyi elde etmek için yazı tipi boyutunun katı
    SATIR_ARALIĞI: 1.3,

    // temel çizgiden büyük harf çizgisine kaydırmak için yazı tipi boyutunun katı
    // (Drawing.bBox'tan bu kaydırmayı hesaplamadığımızda kullanılır)
    // Bu, gerçekte yazı tipinden yazı tipine farklılık gösterebileceği için bir yaklaşımdır.
    // Ancak, Wikipedia'ya göre
    //   "ortalama" bir yazı tipi em'in %70'lik bir büyük harf yüksekliğine sahip olabilir
    // https://en.wikipedia.org/wiki/Em_(typography)#History
    BÜYÜK_HARF_KAYDIRMA: 0.70,

    // "ortalama" bir yazı tipinin büyük harf yüksekliğinin yarısı (daha fazla bilgi için yukarıya bakın).
    ORTA_KAYDIRMA: 0.35,

    KARŞI_TARAF: {
        sol: 'sağ',
        sağ: 'sol',
        üst: 'alt',
        alt: 'üst'
    }
};
