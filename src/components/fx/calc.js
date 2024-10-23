'use strict';

var Lib = require('../../lib');
var Registry = require('../../registry');

module.exports = function hesapla(gd) {
    var hesapVerisi = gd.hesapVerisi;
    var tamYerleşim = gd._tamYerleşim;

    function hoverBilgisiZorlaOluştur(iz) {
        return function(değer) {
            return Lib.hoverBilgisiZorla({hoverinfo: değer}, {_module: iz._module}, tamYerleşim);
        };
    }

    for(var i = 0; i < hesapVerisi.length; i++) {
        var hv = hesapVerisi[i];
        var iz = hv[0].iz;

        // pasta grafik izleri için hover hesaplama alanlarını dahil etmeyin
        // çünkü hesapVerisi öğeleri değere göre sıralanabilir ve
        // veri dizisi sırasıyla eşleşmeyebilir.
        if(Registry.izMi(iz, 'pasta-benzeri')) continue;

        var doldurFn = Registry.izMi(iz, '2dHarita') ? yapıştır : Lib.diziDoldur;

        doldurFn(iz.hoverinfo, hv, 'hi', hoverBilgisiZorlaOluştur(iz));

        if(iz.hovertemplate) doldurFn(iz.hovertemplate, hv, 'ht');

        if(!iz.hoverlabel) continue;

        doldurFn(iz.hoverlabel.bgcolor, hv, 'hbg');
        doldurFn(iz.hoverlabel.bordercolor, hv, 'hbc');
        doldurFn(iz.hoverlabel.font.size, hv, 'hts');
        doldurFn(iz.hoverlabel.font.color, hv, 'htc');
        doldurFn(iz.hoverlabel.font.family, hv, 'htf');
        doldurFn(iz.hoverlabel.font.weight, hv, 'htw');
        doldurFn(iz.hoverlabel.font.style, hv, 'hty');
        doldurFn(iz.hoverlabel.font.variant, hv, 'htv');
        doldurFn(iz.hoverlabel.namelength, hv, 'hnl');
        doldurFn(iz.hoverlabel.align, hv, 'hta');
    }
};

function yapıştır(izÖzelliği, hv, hvÖzelliği, fn) {
    fn = fn || Lib.kimlik;

    if(Array.isArray(izÖzelliği)) {
        hv[0][hvÖzelliği] = fn(izÖzelliği);
    }
}
