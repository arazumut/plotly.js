'use strict';

// Gerekli modülleri dahil et
var Renk = require('../../components/color');
var renkSkalasıVarMı = require('../../components/colorscale/helpers').hasColorscale;
var renkSkalasıVarsayılanları = require('../../components/colorscale/defaults');
var desenKoerce = require('../../lib').coercePattern;

module.exports = function stilVarsayılanlarınıEleAl(girdiIz, çıktıIz, koerce, varsayılanRenk, düzen) {
    var işaretleyiciRengi = koerce('marker.color', varsayılanRenk);
    var işaretleyiciRenkSkalasıVarMı = renkSkalasıVarMı(girdiIz, 'marker');
    if(işaretleyiciRenkSkalasıVarMı) {
        renkSkalasıVarsayılanları(
            girdiIz, çıktıIz, düzen, koerce, {prefix: 'marker.', cLetter: 'c'}
        );
    }

    koerce('marker.line.color', Renk.varsayılanÇizgi);

    if(renkSkalasıVarMı(girdiIz, 'marker.line')) {
        renkSkalasıVarsayılanları(
            girdiIz, çıktıIz, düzen, koerce, {prefix: 'marker.line.', cLetter: 'c'}
        );
    }

    koerce('marker.line.width');
    koerce('marker.opacity');
    desenKoerce(koerce, 'marker.pattern', işaretleyiciRengi, işaretleyiciRenkSkalasıVarMı);
    koerce('selected.marker.color');
    koerce('unselected.marker.color');
};
