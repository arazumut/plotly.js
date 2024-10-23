'use strict';

// Gereken sabitleri içe aktar
var FROM_BL = require('../../constants/alignment').FROM_BL;

// scaleZoom fonksiyonunu dışa aktar
module.exports = function ölçekZoom(ax, faktör, merkezKesir) {
    // merkezKesir tanımlanmamışsa, varsayılan değeri ayarla
    if(merkezKesir === undefined) {
        merkezKesir = FROM_BL[ax.constraintoward || 'center'];
    }

    // Mevcut aralığı doğrusal olarak hesapla
    var doğrusalAralık = [ax.r2l(ax.range[0]), ax.r2l(ax.range[1])];
    var merkez = doğrusalAralık[0] + (doğrusalAralık[1] - doğrusalAralık[0]) * merkezKesir;

    // Yeni aralığı hesapla ve ayarla
    ax.range = ax._input.range = [
        ax.l2r(merkez + (doğrusalAralık[0] - merkez) * faktör),
        ax.l2r(merkez + (doğrusalAralık[1] - merkez) * faktör)
    ];
    ax.setScale(); // Ölçeği ayarla
};
