'use strict';

module.exports = function handleContourDefaults(traceIn, traceOut, coerce, coerce2) {
    var konturBaslangici = coerce2('contours.start');
    var konturBitisi = coerce2('contours.end');
    var eksikBitiş = (konturBaslangici === false) || (konturBitisi === false);

    // Normalde sadece otomatik kontur kapalıysa boyuta ihtiyacımız var. Ancak contour.calc
    // hesaplanan kontur boyutunu giriş izine geri gönderir, bu yüzden
    // ilk çizimden sonra calc olmadan supplyDefaults çağırabilen restyle gibi şeyler için
    // önceki hesaplamayı yeniden kullanabiliriz
    var konturBoyutu = coerce('contours.size');
    var otomatikKontur;

    if(eksikBitiş) otomatikKontur = traceOut.autocontour = true;
    else otomatikKontur = coerce('autocontour', false);

    if(otomatikKontur || !konturBoyutu) coerce('ncontours');
};
