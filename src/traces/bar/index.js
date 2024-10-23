'use strict';

// Modül dışa aktarımı
module.exports = {
    // Özellikler
    attributes: require('./attributes'),
    layoutAttributes: require('./layout_attributes'),
    supplyDefaults: require('./defaults').supplyDefaults,
    crossTraceDefaults: require('./defaults').crossTraceDefaults,
    supplyLayoutDefaults: require('./layout_defaults'),
    calc: require('./calc'),
    crossTraceCalc: require('./cross_trace_calc').crossTraceCalc,
    colorbar: require('../scatter/marker_colorbar'),
    arraysToCalcdata: require('./arrays_to_calcdata'),
    plot: require('./plot').plot,
    style: require('./style').style,
    styleOnSelect: require('./style').styleOnSelect,
    hoverPoints: require('./hover').hoverPoints,
    eventData: require('./event_data'),
    selectPoints: require('./select'),

    // Modül tipi
    moduleType: 'trace',
    // Modül adı
    name: 'bar',
    // Temel çizim modülü
    basePlotModule: require('../../plots/cartesian'),
    // Kategoriler
    categories: ['bar-like', 'cartesian', 'svg', 'bar', 'oriented', 'errorBarsOK', 'showLegend', 'zoomScale'],
    // Animasyon desteği
    animatable: true,
    // Meta veriler
    meta: {
        description: [
            'Çubukların uzunluğu ile görselleştirilen veri `y` içinde ayarlanır',
            '`orientation` *v* (varsayılan) olarak ayarlanmışsa',
            've etiketler `x` içinde ayarlanır.',
            '`orientation` *h* olarak ayarlandığında, roller değiştirilir.'
        ].join(' ')
    }
};
