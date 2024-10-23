'use strict';

var Lib = require('../../lib');
var handleArrayContainerDefaults = require('../../plots/array_container_defaults');

var attributes = require('./attributes');
var constants = require('./constants');

var isim = constants.name;
var butonOzellikleri = attributes.buttons;

module.exports = function guncellemeMenusuVarsayilanlari(layoutIn, layoutOut) {
    var ayarlar = {
        name: isim,
        handleItemDefaults: menuVarsayilanlari
    };

    handleArrayContainerDefaults(layoutIn, layoutOut, ayarlar);
};

function menuVarsayilanlari(menuIn, menuOut, layoutOut) {
    function zorla(attr, varsayilan) {
        return Lib.coerce(menuIn, menuOut, attributes, attr, varsayilan);
    }

    var butonlar = handleArrayContainerDefaults(menuIn, menuOut, {
        name: 'buttons',
        handleItemDefaults: butonVarsayilanlari
    });

    var gorunur = zorla('visible', butonlar.length > 0);
    if(!gorunur) return;

    zorla('active');
    zorla('direction');
    zorla('type');
    zorla('showactive');

    zorla('x');
    zorla('y');
    Lib.noneOrAll(menuIn, menuOut, ['x', 'y']);

    zorla('xanchor');
    zorla('yanchor');

    zorla('pad.t');
    zorla('pad.r');
    zorla('pad.b');
    zorla('pad.l');

    Lib.coerceFont(zorla, 'font', layoutOut.font);

    zorla('bgcolor', layoutOut.paper_bgcolor);
    zorla('bordercolor');
    zorla('borderwidth');
}

function butonVarsayilanlari(butonIn, butonOut) {
    function zorla(attr, varsayilan) {
        return Lib.coerce(butonIn, butonOut, butonOzellikleri, attr, varsayilan);
    }

    var gorunur = zorla('visible',
        (butonIn.method === 'skip' || Array.isArray(butonIn.args)));
    if(gorunur) {
        zorla('method');
        zorla('args');
        zorla('args2');
        zorla('label');
        zorla('execute');
    }
}
