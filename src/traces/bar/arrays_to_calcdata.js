'use strict';

var Lib = require('../../lib');

// arrayOk öznitelikleri, bunları calcdata dizisine birleştir
module.exports = function dizileriHesapVerisineBirleştir(cd, iz) {
    for(var i = 0; i < cd.length; i++) cd[i].i = i;

    Lib.diziBirleştir(iz.text, cd, 'tx');
    Lib.diziBirleştir(iz.hovertext, cd, 'htx');

    var işaretleyici = iz.marker;
    if(işaretleyici) {
        Lib.diziBirleştir(işaretleyici.opacity, cd, 'mo', true);
        Lib.diziBirleştir(işaretleyici.color, cd, 'mc');

        var işaretleyiciÇizgisi = işaretleyici.line;
        if(işaretleyiciÇizgisi) {
            Lib.diziBirleştir(işaretleyiciÇizgisi.color, cd, 'mlc');
            Lib.diziBirleştirPozitif(işaretleyiciÇizgisi.width, cd, 'mlw');
        }
    }
};
