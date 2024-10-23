'use strict';

module.exports = {
    visible: {
        valType: 'boolean',
        editType: 'calc',
        description: 'Bu hata çubuklarının görünür olup olmadığını belirler.'
    },
    type: {
        valType: 'enumerated',
        values: ['percent', 'constant', 'sqrt', 'data'],
        editType: 'calc',
        description: [
            'Hata çubuklarını oluşturmak için kullanılan kuralı belirler.',
            'Eğer *constant* ise, çubuk uzunlukları sabit bir değerdedir.',
            'Bu sabiti `value` içinde ayarlayın.',
            'Eğer *percent* ise, çubuk uzunlukları alttaki verinin yüzdesine karşılık gelir.',
            'Bu yüzdesi `value` içinde ayarlayın.',
            'Eğer *sqrt* ise, çubuk uzunlukları alttaki verinin karesine karşılık gelir.',
            'Eğer *data* ise, çubuk uzunlukları `array` veri seti ile ayarlanır.'
        ].join(' ')
    },
    symmetric: {
        valType: 'boolean',
        editType: 'calc',
        description: [
            'Hata çubuklarının her iki yönde (dikey çubuklar için üst/alt, yatay çubuklar için sol/sağ) aynı uzunlukta olup olmadığını belirler.'
        ].join(' ')
    },
    array: {
        valType: 'data_array',
        editType: 'calc',
        description: 'Her hata çubuğunun uzunluğuna karşılık gelen veriyi ayarlar. Değerler alttaki veriye göre çizilir.'
    },
    arrayminus: {
        valType: 'data_array',
        editType: 'calc',
        description: [
            'Dikey (yatay) çubuklar için alt (sol) yöndeki her hata çubuğunun uzunluğuna karşılık gelen veriyi ayarlar.',
            'Değerler alttaki veriye göre çizilir.'
        ].join(' ')
    },
    value: {
        valType: 'number',
        min: 0,
        dflt: 10,
        editType: 'calc',
        description: [
            'Hata çubuklarının uzunluklarına karşılık gelen yüzdelik (eğer `type` *percent* ise) veya sabit (eğer `type` *constant* ise) değeri ayarlar.'
        ].join(' ')
    },
    valueminus: {
        valType: 'number',
        min: 0,
        dflt: 10,
        editType: 'calc',
        description: [
            'Dikey (yatay) çubuklar için alt (sol) yöndeki hata çubuklarının uzunluklarına karşılık gelen yüzdelik (eğer `type` *percent* ise) veya sabit (eğer `type` *constant* ise) değeri ayarlar.'
        ].join(' ')
    },
    traceref: {
        valType: 'integer',
        min: 0,
        dflt: 0,
        editType: 'style'
    },
    tracerefminus: {
        valType: 'integer',
        min: 0,
        dflt: 0,
        editType: 'style'
    },
    copy_ystyle: {
        valType: 'boolean',
        editType: 'plot'
    },
    copy_zstyle: {
        valType: 'boolean',
        editType: 'style'
    },
    color: {
        valType: 'color',
        editType: 'style',
        description: 'Hata çubuklarının çizgi rengini ayarlar.'
    },
    thickness: {
        valType: 'number',
        min: 0,
        dflt: 2,
        editType: 'style',
        description: 'Hata çubuklarının kalınlığını (px cinsinden) ayarlar.'
    },
    width: {
        valType: 'number',
        min: 0,
        editType: 'plot',
        description: [
            'Hata çubuklarının her iki ucundaki çapraz çubuğun genişliğini (px cinsinden) ayarlar.'
        ].join(' ')
    },
    editType: 'calc',
};
