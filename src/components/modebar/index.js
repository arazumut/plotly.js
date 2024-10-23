'use strict';

module.exports = {
    moduleType: 'bileşen',
    name: 'mod çubuğu',

    yerleşimÖznitelikleri: require('./attributes'),
    yerleşimVarsayılanlarınıSağla: require('./defaults'),

    yönet: require('./manage')
};
