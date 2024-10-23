'use strict';

module.exports = {
    barmode: {
        valType: 'enumerated',
        values: ['stack', 'group', 'overlay', 'relative'],
        dflt: 'group',
        editType: 'calc',
        description: [
            'Aynı konum koordinatındaki çubukların',
            'grafikte nasıl görüntüleneceğini belirler.',
            '*stack* ile çubuklar üst üste yığılır.',
            '*relative* ile çubuklar üst üste yığılır,',
            'negatif değerler eksenin altında, pozitif değerler üstünde olur.',
            '*group* ile çubuklar yan yana çizilir,',
            'paylaşılan konum etrafında ortalanır.',
            '*overlay* ile çubuklar üst üste çizilir,',
            'birden fazla çubuğu görmek için *opacity* değerini azaltmanız gerekebilir.'
        ].join(' ')
    },
    barnorm: {
        valType: 'enumerated',
        values: ['', 'fraction', 'percent'],
        dflt: '',
        editType: 'calc',
        description: [
            'Grafikteki çubuk izleri için normalizasyonu ayarlar.',
            '*fraction* ile her çubuğun değeri,',
            'o konum koordinatındaki tüm değerlerin toplamına bölünür.',
            '*percent* aynı işlemi yapar ancak yüzde olarak gösterir.'
        ].join(' ')
    },
    bargap: {
        valType: 'number',
        min: 0,
        max: 1,
        editType: 'calc',
        description: [
            'Bitişik konum koordinatlarındaki çubuklar arasındaki',
            'boşluğu (grafik kesirinde) ayarlar.'
        ].join(' ')
    },
    bargroupgap: {
        valType: 'number',
        min: 0,
        max: 1,
        dflt: 0,
        editType: 'calc',
        description: [
            'Aynı konum koordinatındaki çubuklar arasındaki',
            'boşluğu (grafik kesirinde) ayarlar.'
        ].join(' ')
    },
    barcornerradius: {
        valType: 'any',
        editType: 'calc',
        description: [
            'Çubuk köşelerinin yuvarlatılmasını ayarlar. Piksel cinsinden bir tam sayı,',
            'veya çubuk genişliğinin yüzdesi (sonunda % işareti olan bir string) olabilir.'
        ].join(' ')
    },
};
