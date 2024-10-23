'use strict';

module.exports = {
    /**
     * Tüm eksik verileri calcdata'da undefined olarak standartlaştır
     * null veya NaN asla kullanma.
     * Bu şekilde gerçek verileri test etmek için !==undefined veya !== BADNUM kullanabiliriz.
     */
    BADNUM: undefined,

    /*
     * Belirli işlemleri kayan nokta maksimum değerinin çok altında sınırlayın
     * hatalardan kaçınmak için: Dev bir ekrandaki piksel sayısıyla bile çarptığınızda çalıştığından emin olun.
     */
    FP_SAFE: Number.MAX_VALUE * 1e-4,

    /*
     * Tarih birimlerinin milisaniyeye dönüştürülmesi
     * yıl ve ay sabitleri "ORT" olarak işaretlenmiştir
     * çünkü tüm yıllar ve aylar aynı uzunlukta değildir.
     */
    BIRORTYIL: 31557600000, // 365.25 gün
    BIRORTAY: 2629800000, // 1/12 BIRORTYIL
    BIRHAFTA: 604800000, // 7 * BIRGUN
    BIRGUN: 86400000, // 24 * BIRSAAT
    BIRSAAT: 3600000,
    BIRDakika: 60000,
    BIRSANIYE: 1000,
    BIRMILISANIYE: 1,
    BIRMICROSANIYE: 0.001,
    /*
     * Dünya takvimleri ve epoch ms arasında hızlı dönüşüm için, Unix epoch'unun Julian Günü Numarası.
     * calendars.instance().newDate(1970, 1, 1).toJD()'den alınmıştır.
     */
    EPOCHJD: 2440587.5,

    /*
     * İki değer neredeyse eşit mi? 1PPM ile karşılaştırın.
     */
    NEREDEYSE_ESIT: 1 - 1e-6,

    /*
     * Negatif olmayan bir log değerini kesmemiz istenirse, ne kadar ekran dışına koyarız?
     */
    LOG_KESME: 10,

    /*
     * Bir sayı değil, ancak sayıları görüntülemek için: "eksi işareti" sembolü
     * normal ascii tire "-" den daha geniştir.
     */
    EKSİ_ISARETI: '\u2212'
};
