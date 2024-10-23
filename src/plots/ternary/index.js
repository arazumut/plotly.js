'use strict';

// Gerekli modülleri dahil et
var Ternary = require('./ternary');
var getSubplotCalcData = require('../../plots/get_data').getSubplotCalcData;
var counterRegex = require('../../lib').counterRegex;
var TERNARY = 'ternary';

// Modül adı
exports.name = TERNARY;

// Alt grafik (subplot) özelliği
var attr = exports.attr = 'subplot';

// ID kökü
exports.idRoot = TERNARY;

// ID ve özellik regex'i
exports.idRegex = exports.attrRegex = counterRegex(TERNARY);

// Özellikler
var attributes = exports.attributes = {};
attributes[attr] = {
    valType: 'subplotid',
    dflt: 'ternary',
    editType: 'calc',
    description: [
        'Bu izleme verilerinin koordinatları ile',
        'bir üçlü alt grafik arasında bir referans ayarlar.',
        'Eğer *ternary* (varsayılan değer) ise, veriler `layout.ternary`ye referans verir.',
        'Eğer *ternary2* ise, veriler `layout.ternary2`ye referans verir, ve bu şekilde devam eder.'
    ].join(' ')
};

// Düzen özelliklerini dahil et
exports.layoutAttributes = require('./layout_attributes');

// Düzen varsayılanlarını sağla
exports.supplyLayoutDefaults = require('./layout_defaults');

// Grafik çizim fonksiyonu
exports.plot = function plot(gd) {
    var fullLayout = gd._fullLayout;
    var calcData = gd.calcdata;
    var ternaryIds = fullLayout._subplots[TERNARY];

    for(var i = 0; i < ternaryIds.length; i++) {
        var ternaryId = ternaryIds[i];
        var ternaryCalcData = getSubplotCalcData(calcData, TERNARY, ternaryId);
        var ternary = fullLayout[ternaryId]._subplot;

        // Eğer üçlü grafik henüz oluşturulmamışsa, oluştur!
        if(!ternary) {
            ternary = new Ternary({
                id: ternaryId,
                graphDiv: gd,
                container: fullLayout._ternarylayer.node()
            },
                fullLayout
            );

            fullLayout[ternaryId]._subplot = ternary;
        }

        ternary.plot(ternaryCalcData, fullLayout, gd._promises);
    }
};

// Temizleme fonksiyonu
exports.clean = function(newFullData, newFullLayout, oldFullData, oldFullLayout) {
    var oldTernaryKeys = oldFullLayout._subplots[TERNARY] || [];

    for(var i = 0; i < oldTernaryKeys.length; i++) {
        var oldTernaryKey = oldTernaryKeys[i];
        var oldTernary = oldFullLayout[oldTernaryKey]._subplot;

        if(!newFullLayout[oldTernaryKey] && !!oldTernary) {
            oldTernary.plotContainer.remove();
            oldTernary.clipDef.remove();
            oldTernary.clipDefRelative.remove();
            oldTernary.layers['a-title'].remove();
            oldTernary.layers['b-title'].remove();
            oldTernary.layers['c-title'].remove();
        }
    }
};

// Etkileşim güncelleme fonksiyonu
exports.updateFx = function(gd) {
    var fullLayout = gd._fullLayout;
    fullLayout._ternarylayer
        .selectAll('g.toplevel')
        .style('cursor', fullLayout.dragmode === 'pan' ? 'move' : 'crosshair');
};
