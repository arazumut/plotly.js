'use strict';

var listAxes = require('../../plots/cartesian/axis_ids').list;
var getAutoRange = require('../../plots/cartesian/autorange').getAutoRange;
var constants = require('./constants');

module.exports = function calcAutorange(gd) {
    var eksenler = listAxes(gd, 'x', true);

    // Gerekirse eksen otomatik aralığını kullanarak yeni kaydırıcı aralığını hesaplayın.
    //
    // Bu adımı sonraki çizim çağrılarında atlamak için aralığı giriş aralığı kaydırıcı konteynerine geri kopyalayın.

    for(var i = 0; i < eksenler.length; i++) {
        var eksen = eksenler[i];
        var ayarlar = eksen[constants.name];

        if(ayarlar && ayarlar.visible && ayarlar.autorange) {
            ayarlar._input.autorange = true;
            ayarlar._input.range = ayarlar.range = getAutoRange(gd, eksen);
        }
    }
};
