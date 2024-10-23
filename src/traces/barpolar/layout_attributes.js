'use strict';

module.exports = {
    barmode: {
        valType: 'enumerated',
        values: ['stack', 'overlay'],
        dflt: 'stack',
        editType: 'calc',
        description: [
            'Aynı konum koordinatındaki çubukların',
            'grafikte nasıl görüntüleneceğini belirler.',
            '*stack* ile çubuklar üst üste yığılır.',
            '*overlay* ile çubuklar üst üste çizilir,',
            'birden fazla çubuğu görmek için *opacity* değerini azaltmanız gerekebilir.'
        ].join(' ')
    },
    bargap: {
        valType: 'number',
        dflt: 0.1,
        min: 0,
        max: 1,
        editType: 'calc',
        description: [
            'Bitişik konum koordinatlarındaki çubuklar arasındaki',
            'boşluğu ayarlar.',
            'Değerler birimsizdir, veri içindeki çubuk pozisyonlarındaki',
            'minimum farkın kesirlerini temsil eder.'
        ].join(' ')
    }
};
