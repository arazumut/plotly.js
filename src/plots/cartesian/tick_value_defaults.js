'use strict';

var temizleTickler = require('./clean_ticks');
var diziVeyaTypedArrayMi = require('../../lib').isArrayOrTypedArray;
var typedArraySpecMi = require('../../lib/array').isTypedArraySpec;
var decodeTypedArraySpec = require('../../lib/array').decodeTypedArraySpec;

module.exports = function tickDegerVarsayilanlariniIsle(containerIn, containerOut, zorla, eksenTipi, secenekler) {
    if(!secenekler) secenekler = {};
    var kucukMu = secenekler.kucukMu;
    var cIn = kucukMu ? containerIn.kucuk || {} : containerIn;
    var cOut = kucukMu ? containerOut.kucuk : containerOut;
    var onEk = kucukMu ? 'kucuk.' : '';

    function girisOku(ozellik) {
        var deger = cIn[ozellik];
        if(typedArraySpecMi(deger)) deger = decodeTypedArraySpec(deger);

        return (
            deger !== undefined
        ) ? deger : (cOut._sablon || {})[ozellik];
    }

    var _tick0 = girisOku('tick0');
    var _dtick = girisOku('dtick');
    var _tickvals = girisOku('tickvals');

    var tickModuVarsayilan = diziVeyaTypedArrayMi(_tickvals) ? 'dizi' :
        _dtick ? 'dogrusal' :
        'otomatik';
    var tickModu = zorla(onEk + 'tickmodu', tickModuVarsayilan);

    if(tickModu === 'otomatik' || tickModu === 'senkron') {
        zorla(onEk + 'nticks');
    } else if(tickModu === 'dogrusal') {
        // dtick genellikle pozitif bir sayıdır, ancak log veya tarih eksenleri için bazı
        // özel dizgiler mevcuttur
        // tick0 da özel bir mantığa sahiptir
        var dtick = cOut.dtick = temizleTickler.dtick(
            _dtick, eksenTipi);
        cOut.tick0 = temizleTickler.tick0(
            _tick0, eksenTipi, containerOut.takvim, dtick);
    } else if(eksenTipi !== 'cokluKategori') {
        var tickvals = zorla(onEk + 'tickvals');
        if(tickvals === undefined) cOut.tickmodu = 'otomatik';
        else if(!kucukMu) zorla('ticktext');
    }
};
