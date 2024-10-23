'use strict';

// Gerekli modülleri dahil et
var getSubplotCalcData = require('../get_data').getSubplotCalcData;
var counterRegex = require('../../lib').counterRegex;

var createPolar = require('./polar');
var constants = require('./constants');

// Sabitleri tanımla
var attr = constants.attr;
var name = constants.name;
var counter = counterRegex(name);

// Özellikleri tanımla
var attributes = {};
attributes[attr] = {
    valType: 'subplotid',
    dflt: name,
    editType: 'calc',
    description: [
        'Bu izleme verilerinin koordinatları ile',
        'bir polar alt grafik arasında bir referans ayarlar.',
        'Eğer *polar* (varsayılan değer) ise, veriler `layout.polar`a referans verir.',
        'Eğer *polar2* ise, veriler `layout.polar2`ye referans verir ve bu şekilde devam eder.'
    ].join(' ')
};

// Grafik çizim fonksiyonu
function plot(gd) {
    var fullLayout = gd._fullLayout;
    var calcData = gd.calcdata;
    var subplotIds = fullLayout._subplots[name];

    for(var i = 0; i < subplotIds.length; i++) {
        var id = subplotIds[i];
        var subplotCalcData = getSubplotCalcData(calcData, name, id);
        var subplot = fullLayout[id]._subplot;

        if(!subplot) {
            subplot = createPolar(gd, id);
            fullLayout[id]._subplot = subplot;
        }

        subplot.plot(subplotCalcData, fullLayout, gd._promises);
    }
}

// Temizlik fonksiyonu
function clean(newFullData, newFullLayout, oldFullData, oldFullLayout) {
    var oldIds = oldFullLayout._subplots[name] || [];
    var hadGl = (oldFullLayout._has && oldFullLayout._has('gl'));
    var hasGl = (newFullLayout._has && newFullLayout._has('gl'));
    var mustCleanScene = hadGl && !hasGl;

    for(var i = 0; i < oldIds.length; i++) {
        var id = oldIds[i];
        var oldSubplot = oldFullLayout[id]._subplot;

        if(!newFullLayout[id] && !!oldSubplot) {
            oldSubplot.framework.remove();
            oldSubplot.layers['radial-axis-title'].remove();

            for(var k in oldSubplot.clipPaths) {
                oldSubplot.clipPaths[k].remove();
            }
        }

        if(mustCleanScene && oldSubplot._scene) {
            oldSubplot._scene.destroy();
            oldSubplot._scene = null;
        }
    }
}

// Modülü dışa aktar
module.exports = {
    attr: attr,
    name: name,
    idRoot: name,
    idRegex: counter,
    attrRegex: counter,
    attributes: attributes,
    layoutAttributes: require('./layout_attributes'),
    supplyLayoutDefaults: require('./layout_defaults'),
    plot: plot,
    clean: clean,
    toSVG: require('../cartesian').toSVG
};
