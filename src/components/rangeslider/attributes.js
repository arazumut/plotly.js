'use strict';

var colorAttributes = require('../color/attributes');

module.exports = {
    arkaplanRengi: {
        valType: 'color',
        dflt: colorAttributes.background,
        editType: 'plot',
        description: 'Aralık kaydırıcısının arka plan rengini ayarlar.'
    },
    kenarRengi: {
        valType: 'color',
        dflt: colorAttributes.defaultLine,
        editType: 'plot',
        description: 'Aralık kaydırıcısının kenar rengini ayarlar.'
    },
    kenarKalınlığı: {
        valType: 'integer',
        dflt: 0,
        min: 0,
        editType: 'plot',
        description: 'Aralık kaydırıcısının kenar kalınlığını ayarlar.'
    },
    otomatikAralık: {
        valType: 'boolean',
        dflt: true,
        editType: 'calc',
        impliedEdits: {'aralık[0]': undefined, 'aralık[1]': undefined},
        description: [
            'Aralık kaydırıcısının aralığının',
            'giriş verilerine göre hesaplanıp hesaplanmadığını belirler.',
            '`aralık` sağlanmışsa, `otomatikAralık` *false* olarak ayarlanır.'
        ].join(' ')
    },
    aralık: {
        valType: 'info_array',
        items: [
            {valType: 'any', editType: 'calc', impliedEdits: {'^otomatikAralık': false}},
            {valType: 'any', editType: 'calc', impliedEdits: {'^otomatikAralık': false}}
        ],
        editType: 'calc',
        impliedEdits: {otomatikAralık: false},
        description: [
            'Aralık kaydırıcısının aralığını ayarlar.',
            'Ayarlanmazsa, varsayılan olarak tam x ekseni aralığına ayarlanır.',
            'Eksen `type`ı *log* ise, istenen aralığın logaritmasını almalısınız.',
            'Eksen `type`ı *date* ise, tarih dizeleri olmalıdır,',
            'tarih verileri gibi, ancak Tarih nesneleri ve unix milisaniyeleri',
            'kabul edilir ve dizelere dönüştürülür.',
            'Eksen `type`ı *category* ise, sıfırdan başlayarak her kategorinin',
            'göründüğü sıraya göre bir seri numarası kullanarak sayılar olmalıdır.'
        ].join(' ')
    },
    kalınlık: {
        valType: 'number',
        dflt: 0.15,
        min: 0,
        max: 1,
        editType: 'plot',
        description: [
            'Aralık kaydırıcısının yüksekliği,',
            'toplam grafik alanı yüksekliğinin bir kesiri olarak.'
        ].join(' ')
    },
    görünür: {
        valType: 'boolean',
        dflt: true,
        editType: 'calc',
        description: [
            'Aralık kaydırıcısının görünür olup olmadığını belirler.',
            'Görünürse, dikey eksenler `fixedrange` olarak ayarlanır.'
        ].join(' ')
    },
    editType: 'calc'
};
