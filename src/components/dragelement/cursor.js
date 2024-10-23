'use strict';

var Lib = require('../../lib');

// En yakın köşe/kenara işaret eden imleçleri ayarla,
// hizalamayı belirtmek için
// x ve y, grafik alanının 0-1 arası kesirleridir
var imlecSeti = [
    ['sw-resize', 's-resize', 'se-resize'],
    ['w-resize', 'move', 'e-resize'],
    ['nw-resize', 'n-resize', 'ne-resize']
];

module.exports = function imlecAl(x, y, xankoru, yankoru) {
    if(xankoru === 'sol') x = 0;
    else if(xankoru === 'merkez') x = 1;
    else if(xankoru === 'sağ') x = 2;
    else x = Lib.constrain(Math.floor(x * 3), 0, 2);

    if(yankoru === 'alt') y = 0;
    else if(yankoru === 'orta') y = 1;
    else if(yankoru === 'üst') y = 2;
    else y = Lib.constrain(Math.floor(y * 3), 0, 2);

    return imlecSeti[y][x];
};
