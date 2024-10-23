'use strict';

var sabitler = require('./constants');

module.exports = {
    modulTipi: 'bileşen',
    isim: sabitler.isim,

    yerleşimÖznitelikleri: require('./attributes'),
    yerleşimVarsayılanlarınıSağla: require('./defaults'),

    çiz: require('./draw')
};
