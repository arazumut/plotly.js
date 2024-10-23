'use strict';

module.exports = {
    moduleType: 'iz',
    name: 'mumgrafiği',
    basePlotModule: require('../../plots/cartesian'),
    categories: ['kartezyen', 'svg', 'gösterEfsane', 'mumgrafiği', 'kutuDüzeni'],
    meta: {
        description: [
            'Mum grafiği, belirli bir `x` koordinatı (muhtemelen zaman) için',
            'açılış, yüksek, düşük ve kapanış değerlerini tanımlayan bir finansal grafik türüdür.',

            'Kutular `açılış` ve `kapanış` değerleri arasındaki farkı temsil eder ve',
            'çizgiler `düşük` ve `yüksek` değerler arasındaki farkı temsil eder.',

            'Kapanış değeri açılış değerinden yüksek (düşük) olan örnek noktalar',
            'artış (azalış) olarak adlandırılır.',

            'Varsayılan olarak, artan mumlar yeşil renkte çizilirken,',
            'azalanlar kırmızı renkte çizilir.'
        ].join(' ')
    },

    attributes: require('./attributes'),
    layoutAttributes: require('../box/layout_attributes'),
    supplyLayoutDefaults: require('../box/layout_defaults').supplyLayoutDefaults,
    crossTraceCalc: require('../box/cross_trace_calc').crossTraceCalc,
    supplyDefaults: require('./defaults'),
    calc: require('./calc'),
    plot: require('../box/plot').plot,
    layerName: 'kutukatmanı',
    style: require('../box/style').style,
    hoverPoints: require('../ohlc/hover').hoverPoints,
    selectPoints: require('../ohlc/select')
};
