'use strict';

module.exports = {
    kutuModu: {
        valTipi: 'enumere',
        değerler: ['grup', 'üstüste'],
        varsayılan: 'üstüste',
        düzenlemeTipi: 'hesapla',
        açıklama: [
            'Aynı konum koordinatındaki kutuların',
            'grafikte nasıl görüntüleneceğini belirler.',
            'Eğer *grup* ise, kutular yan yana çizilir',
            've paylaşılan konum etrafında ortalanır.',
            'Eğer *üstüste* ise, kutular üst üste çizilir,',
            'birden fazla kutuyu görmek için *opaklık* ayarlamanız gerekebilir.',
            '*genişlik* ayarı olan izler üzerinde etkisi yoktur.'
        ].join(' ')
    },
    kutuBoşluğu: {
        valTipi: 'sayı',
        min: 0,
        max: 1,
        varsayılan: 0.3,
        düzenlemeTipi: 'hesapla',
        açıklama: [
            'Bitişik konum koordinatlarındaki kutular arasındaki',
            'boşluğu (grafik kesirinde) ayarlar.',
            '*genişlik* ayarı olan izler üzerinde etkisi yoktur.'
        ].join(' ')
    },
    kutuGrupBoşluğu: {
        valTipi: 'sayı',
        min: 0,
        max: 1,
        varsayılan: 0.3,
        düzenlemeTipi: 'hesapla',
        açıklama: [
            'Aynı konum koordinatındaki kutular arasındaki',
            'boşluğu (grafik kesirinde) ayarlar.',
            '*genişlik* ayarı olan izler üzerinde etkisi yoktur.'
        ].join(' ')
    }
};
