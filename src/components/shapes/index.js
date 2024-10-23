var çizimModülü = require('./draw');

'use strict';


module.exports = {
    isim: 'şekiller',

    yerleşimÖznitelikleri: require('./attributes'),
    yerleşimVarsayılanlarınıSağla: require('./defaults'),
    yeniŞekilVarsayılanlarınıSağla: require('./draw_newshape/defaults'),
    temelGrafiğiDahilEt: require('../../plots/cartesian/include_components')('shapes'),
    otomatikAralıkHesapla: require('./calc_autorange'),

    çiz: çizimModülü.çiz,
    biriniÇiz: çizimModülü.biriniÇiz
};
