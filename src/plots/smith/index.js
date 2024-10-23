'use strict';

var getSubplotCalcData = require('../get_data').getSubplotCalcData;
var counterRegex = require('../../lib').counterRegex;

var createPolar = require('../polar/polar');
var constants = require('./constants');

var attr = constants.attr;
var name = constants.name;
var counter = counterRegex(name);

var attributes = {};
attributes[attr] = {
    valType: 'subplotid',
    dflt: name,
    editType: 'calc',
    description: [
        'Bu iz verilerinin koordinatları ile',
        'bir smith alt grafiği arasında bir referans ayarlar.',
        'Eğer *smith* (varsayılan değer) ise, veriler `layout.smith`e referans verir.',
        'Eğer *smith2* ise, veriler `layout.smith2`ye referans verir, ve bu şekilde devam eder.'
    ].join(' ')
};

function ciz(gd) {
    var tamYerlesim = gd._fullLayout;
    var hesapVerisi = gd.calcdata;
    var altGrafikIdleri = tamYerlesim._subplots[name];

    for(var i = 0; i < altGrafikIdleri.length; i++) {
        var id = altGrafikIdleri[i];
        var altGrafikHesapVerisi = getSubplotCalcData(hesapVerisi, name, id);
        var altGrafik = tamYerlesim[id]._subplot;

        if(!altGrafik) {
            altGrafik = createPolar(gd, id, true);
            tamYerlesim[id]._subplot = altGrafik;
        }

        altGrafik.plot(altGrafikHesapVerisi, tamYerlesim, gd._promises);
    }
}

function temizle(yeniTamVeri, yeniTamYerlesim, eskiTamVeri, eskiTamYerlesim) {
    var eskiIdler = eskiTamYerlesim._subplots[name] || [];
    for(var i = 0; i < eskiIdler.length; i++) {
        var id = eskiIdler[i];
        var eskiAltGrafik = eskiTamYerlesim[id]._subplot;

        if(!yeniTamYerlesim[id] && !!eskiAltGrafik) {
            eskiAltGrafik.framework.remove();

            for(var k in eskiAltGrafik.clipPaths) {
                eskiAltGrafik.clipPaths[k].remove();
            }
        }
    }
}

module.exports = {
    attr: attr,
    name: name,
    idRoot: name,
    idRegex: counter,
    attrRegex: counter,
    attributes: attributes,
    layoutAttributes: require('./layout_attributes'),
    supplyLayoutDefaults: require('./layout_defaults'),
    plot: ciz,
    clean: temizle,
    toSVG: require('../cartesian').toSVG
};
