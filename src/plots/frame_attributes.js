'use strict';

module.exports = {
    _isLinkedToArray: 'frames_entry',

    grup: {
        valType: 'string',
        description: [
            'Çerçevenin ait olduğu grubu belirten bir tanımlayıcı,',
            'animate tarafından çerçevelerin bir alt kümesini seçmek için kullanılır.'
        ].join(' ')
    },
    isim: {
        valType: 'string',
        description: 'Çerçeveyi tanımlamak için kullanılan bir etiket'
    },
    izler: {
        valType: 'any',
        description: [
            'Veri özniteliğindeki ilgili izleri tanımlayan iz indekslerinin bir listesi'
        ].join(' ')
    },
    temelÇerçeve: {
        valType: 'string',
        description: [
            'Bu çerçevenin özelliklerinin uygulanmadan önce birleştirildiği çerçevenin adı.',
            'Bu, özellikleri birleştirmek ve aynı özellikler için aynı değerleri birden çok çerçevede belirtme ihtiyacını önlemek için kullanılır.'
        ].join(' ')
    },
    veri: {
        valType: 'any',
        description: [
            'Bu çerçevenin değiştirdiği izlerin bir listesi. Format, normal iz tanımı ile aynıdır.'
        ].join(' ')
    },
    düzen: {
        valType: 'any',
        description: [
            'Bu çerçevenin değiştirdiği düzen özellikleri. Format, normal düzen tanımı ile aynıdır.'
        ].join(' ')
    }
};
