'use strict';

var Lib = require('../../lib');
var handleArrayContainerDefaults = require('../../plots/array_container_defaults');

var attributes = require('./attributes');
var constants = require('./constants');

var isim = constants.name;
var adımÖzellikleri = attributes.steps;

module.exports = function kaydırıcıVarsayılanları(layoutIn, layoutOut) {
    handleArrayContainerDefaults(layoutIn, layoutOut, {
        name: isim,
        handleItemDefaults: kaydırıcıVarsayılanları
    });
};

function kaydırıcıVarsayılanları(kaydırıcıIn, kaydırıcıOut, layoutOut) {
    function zorla(attr, varsayılan) {
        return Lib.coerce(kaydırıcıIn, kaydırıcıOut, attributes, attr, varsayılan);
    }

    var adımlar = handleArrayContainerDefaults(kaydırıcıIn, kaydırıcıOut, {
        name: 'steps',
        handleItemDefaults: adımVarsayılanları
    });

    var adımSayısı = 0;
    for(var i = 0; i < adımlar.length; i++) {
        if(adımlar[i].visible) adımSayısı++;
    }

    var görünür;
    // İki seçenekten azsa, gerçekten bir kaydırıcı değildir
    if(adımSayısı < 2) görünür = kaydırıcıOut.visible = false;
    else görünür = zorla('visible');
    if(!görünür) return;

    kaydırıcıOut._adımSayısı = adımSayısı;
    var görünürAdımlar = kaydırıcıOut._görünürAdımlar = Lib.filterVisible(adımlar);

    var aktif = zorla('active');
    if(!(adımlar[aktif] || {}).visible) kaydırıcıOut.active = görünürAdımlar[0]._index;

    zorla('x');
    zorla('y');
    Lib.noneOrAll(kaydırıcıIn, kaydırıcıOut, ['x', 'y']);

    zorla('xanchor');
    zorla('yanchor');

    zorla('len');
    zorla('lenmode');

    zorla('pad.t');
    zorla('pad.r');
    zorla('pad.b');
    zorla('pad.l');

    Lib.coerceFont(zorla, 'font', layoutOut.font);

    var mevcutDeğerGörünür = zorla('currentvalue.visible');

    if(mevcutDeğerGörünür) {
        zorla('currentvalue.xanchor');
        zorla('currentvalue.prefix');
        zorla('currentvalue.suffix');
        zorla('currentvalue.offset');

        Lib.coerceFont(zorla, 'currentvalue.font', kaydırıcıOut.font);
    }

    zorla('transition.duration');
    zorla('transition.easing');

    zorla('bgcolor');
    zorla('activebgcolor');
    zorla('bordercolor');
    zorla('borderwidth');
    zorla('ticklen');
    zorla('tickwidth');
    zorla('tickcolor');
    zorla('minorticklen');
}

function adımVarsayılanları(değerIn, değerOut) {
    function zorla(attr, varsayılan) {
        return Lib.coerce(değerIn, değerOut, adımÖzellikleri, attr, varsayılan);
    }

    var görünür;
    if(değerIn.method !== 'skip' && !Array.isArray(değerIn.args)) {
        görünür = değerOut.visible = false;
    } else görünür = zorla('visible');

    if(görünür) {
        zorla('method');
        zorla('args');
        var etiket = zorla('label', 'adım-' + değerOut._index);
        zorla('value', etiket);
        zorla('execute');
    }
}
