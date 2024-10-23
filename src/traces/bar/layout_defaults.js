'use strict';

var Registry = require('../../registry');
var Axes = require('../../plots/cartesian/axes');
var Lib = require('../../lib');

var layoutAttributes = require('./layout_attributes');
var validateCornerradius = require('./defaults').validateCornerradius;

module.exports = function(layoutIn, layoutOut, fullData) {
    function zorla(attr, varsayilan) {
        return Lib.coerce(layoutIn, layoutOut, layoutAttributes, attr, varsayilan);
    }

    var barVarMi = false;
    var bosluksuzOlmaliMi = false;
    var yineDeBosluklu = false;
    var kullanilanAltGrafikler = {};

    var mod = zorla('barmode');

    for(var i = 0; i < fullData.length; i++) {
        var iz = fullData[i];
        if(Registry.traceIs(iz, 'bar') && iz.visible) barVarMi = true;
        else continue;

        // Aynı alt grafikte en az 2 gruplanmış bar izi varsa,
        // veri histogram olsa bile varsayılan olarak bir boşluk olmalı
        if(mod === 'group') {
            var altGrafikId = iz.xaxis + iz.yaxis;
            if(kullanilanAltGrafikler[altGrafikId]) yineDeBosluklu = true;
            kullanilanAltGrafikler[altGrafikId] = true;
        }

        if(iz.visible && iz.type === 'histogram') {
            var eksen = Axes.getFromId({_fullLayout: layoutOut},
                        iz[iz.orientation === 'v' ? 'xaxis' : 'yaxis']);
            if(eksen.type !== 'category') bosluksuzOlmaliMi = true;
        }
    }

    if(!barVarMi) {
        delete layoutOut.barmode;
        return;
    }

    if(mod !== 'overlay') zorla('barnorm');

    zorla('bargap', (bosluksuzOlmaliMi && !yineDeBosluklu) ? 0 : 0.2);
    zorla('bargroupgap');
    var r = zorla('barcornerradius');
    layoutOut.barcornerradius = validateCornerradius(r);
};
