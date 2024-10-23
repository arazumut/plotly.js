'use strict';

module.exports = {
    moduleType: 'iz',
    name: 'barpolar',
    basePlotModule: require('../../plots/polar'),
    categories: ['polar', 'bar', 'gösterEfsane'],

    attributes: require('./attributes'),
    layoutAttributes: require('./layout_attributes'),
    supplyDefaults: require('./defaults'),
    supplyLayoutDefaults: require('./layout_defaults'),

    calc: require('./calc').calc,
    crossTraceCalc: require('./calc').crossTraceCalc,

    plot: require('./plot'),
    colorbar: require('../scatter/marker_colorbar'),
    formatLabels: require('../scatterpolar/format_labels'),

    style: require('../bar/style').style,
    styleOnSelect: require('../bar/style').styleOnSelect,

    hoverPoints: require('./hover'),
    selectPoints: require('../bar/select'),

    meta: {
        hrName: 'bar_polar',
        description: [
            'Çubukların radyal aralığı ile görselleştirilen veri `r` içinde ayarlanır'
            // 'eğer `yönelim` *radyal* olarak ayarlanmışsa (varsayılan)',
            // 've etiketler `theta` içinde ayarlanır.',
            // '`yönelim` *açısal* olarak ayarlanarak roller değiştirilebilir.'
        ].join(' ')
    }
};
