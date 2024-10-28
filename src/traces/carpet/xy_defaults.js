'use strict';

// Gerekli modülü dahil et
var isArray1D = require('../../lib').isArray1D;

// handleXYDefaults fonksiyonunu dışa aktar
module.exports = function handleXYDefaults(traceIn, traceOut, coerce) {
    // 'x' ve 'y' değerlerini zorla (coerce)
    var x = coerce('x');
    var hasX = x && x.length;
    var y = coerce('y');
    var hasY = y && y.length;
    
    // Eğer ne 'x' ne de 'y' varsa, false döndür
    if(!hasX && !hasY) return false;

    // Eğer 'x' yoksa, traceOut._cheater'ı true yap
    traceOut._cheater = !x;

    // Eğer 'x' ve 'y' 1 boyutlu dizilerse veya yoksa
    if((!hasX || isArray1D(x)) && (!hasY || isArray1D(y))) {
        var len = hasX ? x.length : Infinity;
        if(hasY) len = Math.min(len, y.length);
        if(traceOut.a && traceOut.a.length) len = Math.min(len, traceOut.a.length);
        if(traceOut.b && traceOut.b.length) len = Math.min(len, traceOut.b.length);
        traceOut._length = len;
    } else {
        traceOut._length = null;
    }

    // true döndür
    return true;
};
