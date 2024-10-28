'use strict';

module.exports = {
    özellikler: require('./attributes'), // attributes -> özellikler
    varsayılanlarıSağla: require('./defaults'), // supplyDefaults -> varsayılanlarıSağla
    çiz: require('./plot'), // plot -> çiz
    hesapla: require('./calc'), // calc -> hesapla
    animasyonlu: true, // animatable -> animasyonlu
    konteynerMi: true, // isContainer -> konteynerMi // böylece carpet izleri diğer izlerden önce `hesapla` alır

    modülTürü: 'iz', // moduleType -> modülTürü
    isim: 'carpet', // name -> isim
    temelÇizimModülü: require('../../plots/cartesian'), // basePlotModule -> temelÇizimModülü
    kategoriler: ['cartesian', 'svg', 'carpet', 'carpetAxis', 'notLegendIsolatable', 'noMultiCategory', 'noHover', 'noSortingByValue'], // categories -> kategoriler
    meta: {
        açıklama: [
            'Halı eksen düzenini tanımlayan veriler `y` ve (isteğe bağlı olarak) `x` içinde ayarlanır.',
            'Eğer sadece `y` varsa, `x` grafik bir hile grafiği olarak yorumlanır ve `y` değerleri kullanılarak doldurulur.',

            '`x` ve `y` ya her boyutu `a` ve `b` ile eşleşen 2D diziler olabilir,',
            'ya da `a` ve `b` ile toplam uzunluğu eşit olan 1D diziler olabilir.'
        ].join(' ')
    }
};
