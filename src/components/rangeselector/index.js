'use strict';

module.exports = {
    moduleType: 'bileşen',
    name: 'aralıkSeçici',

    şema: {
        altGrafikler: {
            xEkseni: {aralıkSeçici: require('./attributes')}
        }
    },

    yerleşimÖzellikleri: require('./attributes'),
    varsayılanlarıEleAl: require('./defaults'),

    çiz: require('./draw')
};
