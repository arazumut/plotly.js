'use strict';

// Gerekli modülü içe aktar
var getShowAttrDflt = require('./show_dflt');

// Prefix ve Suffix varsayılanlarını işleyen fonksiyon
module.exports = function handlePrefixSuffixDefaults(containerIn, containerOut, coerce, axType, options) {
    // Eğer options tanımlı değilse, boş bir obje olarak ayarla
    if(!options) options = {};
    var tickSuffixDflt = options.tickSuffixDflt;

    // Gösterim varsayılanını al
    var showAttrDflt = getShowAttrDflt(containerIn);

    // tickprefix değerini zorla
    var tickPrefix = coerce('tickprefix');
    // Eğer tickPrefix varsa, showtickprefix değerini zorla
    if(tickPrefix) coerce('showtickprefix', showAttrDflt);

    // ticksuffix değerini zorla, varsayılan değeri kullan
    var tickSuffix = coerce('ticksuffix', tickSuffixDflt);
    // Eğer tickSuffix varsa, showticksuffix değerini zorla
    if(tickSuffix) coerce('showticksuffix', showAttrDflt);
};
