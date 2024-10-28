'use strict';

module.exports = function yolYap(xp, yp, bicubicMi) {
    // d3 hatalarını önlemek için:
    if(xp.length === 0) return '';

    var i;
    var yol = [];
    var adim = bicubicMi ? 3 : 1;
    for(i = 0; i < xp.length; i += adim) {
        yol.push(xp[i] + ',' + yp[i]);

        if(bicubicMi && i < xp.length - adim) {
            yol.push('C');
            yol.push([
                xp[i + 1] + ',' + yp[i + 1],
                xp[i + 2] + ',' + yp[i + 2] + ' ',
            ].join(' '));
        }
    }
    return yol.join(bicubicMi ? '' : 'L');
};
