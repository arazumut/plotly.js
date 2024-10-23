'use strict';

module.exports = function klipYoluOlustur(xctrl, yctrl, aax, bax) {
    var i, x, y;
    var segmentler = [];

    var aDuzeltme = !!aax.smoothing;
    var bDuzeltme = !!bax.smoothing;
    var nea1 = xctrl[0].length - 1;
    var neb1 = xctrl.length - 1;

    // Alt a ekseni boyunca:
    for(i = 0, x = [], y = []; i <= nea1; i++) {
        x[i] = xctrl[0][i];
        y[i] = yctrl[0][i];
    }
    segmentler.push({x: x, y: y, bicubic: aDuzeltme});

    // Üst b ekseni boyunca:
    for(i = 0, x = [], y = []; i <= neb1; i++) {
        x[i] = xctrl[i][nea1];
        y[i] = yctrl[i][nea1];
    }
    segmentler.push({x: x, y: y, bicubic: bDuzeltme});

    // Üst a ekseni boyunca geri:
    for(i = nea1, x = [], y = []; i >= 0; i--) {
        x[nea1 - i] = xctrl[neb1][i];
        y[nea1 - i] = yctrl[neb1][i];
    }
    segmentler.push({x: x, y: y, bicubic: aDuzeltme});

    // Alt b ekseni boyunca geri:
    for(i = neb1, x = [], y = []; i >= 0; i--) {
        x[neb1 - i] = xctrl[i][0];
        y[neb1 - i] = yctrl[i][0];
    }
    segmentler.push({x: x, y: y, bicubic: bDuzeltme});

    return segmentler;
};
