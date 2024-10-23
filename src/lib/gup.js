'use strict';

var identity = require('./identity');

function sar(d) {return [d];}

module.exports = {

    // D3 veri bağlama konsepti ve Genel Güncelleme Deseni, sahne grafiğinde
    // `.data(fun, keyFun)` çağrısını kullanarak gezinme fikrini teşvik eder.
    // `fun` çoğunlukla bir `repeat` (tekrar) işlevi olup, `<g>` elemanının altındaki
    // elemanların aynı verilere erişmesi gerektiğinde kullanılır veya bir `descend` (iniş)
    // işlevi olup, sahne grafiği düğümünü bir dizi elemanlara (örneğin, noktalar, çizgiler, satırlar)
    // genişletir ve bir dizi girdi olarak gerektirir.
    // `keyFun` işlevinin rolü, hangi elemanların girildiğini/çıkıldığını/güncellendiğini
    // belirlemektir, aksi takdirde D3, `transition`ları bozacak olan düz bir indeks kullanmaya geri döner.
    anahtarFonksiyonu: function(d) {return d.anahtar;},
    tekrar: sar,
    inis: identity,

    // Plotly.js, `calcData`nın gerçek içeriğini bir konteyner dizisinin sıfırıncı elemanı olarak
    // saklama geleneğini kullanır. Bu yardımcı işlevler, kod tabanına yeni gelen birinin `[0]`ın
    // ne olduğunu ve daha fazla eleman olup olmadığını (şu anda yok) bilmemesi durumunda açıklık sağlamak için kullanılır.
    sar: sar,
    sarilaniCikar: function(d) {return d[0];}
};
