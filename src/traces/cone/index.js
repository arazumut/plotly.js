'use strict';

module.exports = {
    moduleType: 'trace',
    name: 'cone',
    basePlotModule: require('../../plots/gl3d'),
    categories: ['gl3d', 'showLegend'],

    attributes: require('./attributes'),
    supplyDefaults: require('./defaults'),
    colorbar: {
        min: 'cmin',
        max: 'cmax'
    },
    calc: require('./calc'),
    plot: require('./convert'),
    eventData: function(out, pt) {
        out.norm = pt.traceCoordinate[6];
        return out;
    },

    meta: {
        description: [
            'Konik izleri vektör alanlarını görselleştirmek için kullanın.',
            '',
            '6 adet 1D dizi kullanarak bir vektör alanı belirtin,',
            '3 konum dizisi `x`, `y` ve `z`',
            've 3 vektör bileşen dizisi `u`, `v`, `w`.',
            'Koniler tam olarak verilen konumlarda çizilir',
            '`x`, `y` ve `z` tarafından.'
        ].join(' ')
    }
};
