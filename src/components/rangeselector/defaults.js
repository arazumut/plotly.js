'use strict';

var Lib = require('../../lib');
var Color = require('../color');
var Template = require('../../plot_api/plot_template');
var handleArrayContainerDefaults = require('../../plots/array_container_defaults');

var attributes = require('./attributes');
var constants = require('./constants');

module.exports = function handleDefaults(containerIn, containerOut, layout, counterAxes, calendar) {
    var selectorIn = containerIn.rangeselector || {};
    var selectorOut = Template.newContainer(containerOut, 'rangeselector');

    function zorla(attr, varsayılan) {
        return Lib.coerce(selectorIn, selectorOut, attributes, attr, varsayılan);
    }

    var butonlar = handleArrayContainerDefaults(selectorIn, selectorOut, {
        name: 'buttons',
        handleItemDefaults: butonVarsayılanları,
        calendar: calendar
    });

    var görünür = zorla('visible', butonlar.length > 0);
    if(görünür) {
        var posVarsayılan = varsayılanPozisyon(containerOut, layout, counterAxes);
        zorla('x', posVarsayılan[0]);
        zorla('y', posVarsayılan[1]);
        Lib.noneOrAll(containerIn, containerOut, ['x', 'y']);

        zorla('xanchor');
        zorla('yanchor');

        Lib.coerceFont(zorla, 'font', layout.font);

        var arkaPlanRengi = zorla('bgcolor');
        zorla('activecolor', Color.contrast(arkaPlanRengi, constants.lightAmount, constants.darkAmount));
        zorla('bordercolor');
        zorla('borderwidth');
    }
};

function butonVarsayılanları(butonIn, butonOut, selectorOut, opts) {
    var calendar = opts.calendar;

    function zorla(attr, varsayılan) {
        return Lib.coerce(butonIn, butonOut, attributes.buttons, attr, varsayılan);
    }

    var görünür = zorla('visible');

    if(görünür) {
        var adım = zorla('step');
        if(adım !== 'all') {
            if(calendar && calendar !== 'gregorian' && (adım === 'month' || adım === 'year')) {
                butonOut.stepmode = 'backward';
            } else {
                zorla('stepmode');
            }

            zorla('count');
        }

        zorla('label');
    }
}

function varsayılanPozisyon(containerOut, layout, counterAxes) {
    var sabitlenenListe = counterAxes.filter(function(ax) {
        return layout[ax].anchor === containerOut._id;
    });

    var posY = 0;
    for(var i = 0; i < sabitlenenListe.length; i++) {
        var domain = layout[sabitlenenListe[i]].domain;
        if(domain) posY = Math.max(domain[1], posY);
    }

    return [containerOut.domain[0], posY + constants.yPad];
}
