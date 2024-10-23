'use strict';

// Çizgi stili ayarları
exports.dash = {
    valType: 'string',
    // string türü genellikle değer almaz... bu gerçekten özel bir tür veya en azından özel bir zorlama fonksiyonu olmalı,
    // GUI'den yalnızca bu değerleri alırsınız, ancak başka yerlerde kullanıcı bir px cinsinden çizgi uzunlukları listesi sağlayabilir ve bu kabul edilir
    values: ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot'],
    dflt: 'solid',
    editType: 'style',
    description: [
        'Çizgilerin çizgi stilini ayarlar. Bir çizgi türü dizesine ayarlayın',
        '(*solid*, *dot*, *dash*, *longdash*, *dashdot* veya *longdashdot*)',
        'veya px cinsinden bir çizgi uzunluğu listesine (örneğin *5px,10px,2px,2px*).'
    ].join(' ')
};

// Desen ayarları
exports.pattern = {
    shape: {
        valType: 'enumerated',
        values: ['', '/', '\\', 'x', '-', '|', '+', '.'],
        dflt: '',
        arrayOk: true,
        editType: 'style',
        description: [
            'Desen dolgusunun şeklini ayarlar.',
            'Varsayılan olarak, alanı doldurmak için desen kullanılmaz.',
        ].join(' ')
    },
    fillmode: {
        valType: 'enumerated',
        values: ['replace', 'overlay'],
        dflt: 'replace',
        editType: 'style',
        description: [
            '`marker.color`ın varsayılan olarak `bgcolor` veya `fgcolor` olarak kullanılıp kullanılmayacağını belirler.'
        ].join(' ')
    },
    bgcolor: {
        valType: 'color',
        arrayOk: true,
        editType: 'style',
        description: [
            'Renk skalası olmadığında arka plan desen dolgusunun rengini ayarlar.',
            '`fillmode` *overlay* olduğunda varsayılan olarak `marker.color` arka planına ayarlanır.',
            'Aksi takdirde, varsayılan olarak şeffaf bir arka plan olur.'
        ].join(' ')
    },
    fgcolor: {
        valType: 'color',
        arrayOk: true,
        editType: 'style',
        description: [
            'Renk skalası olmadığında ön plan desen dolgusunun rengini ayarlar.',
            '`fillmode` *replace* olduğunda varsayılan olarak `marker.color` arka planına ayarlanır.',
            'Aksi takdirde, kontrastı artırmak için varsayılan olarak koyu gri veya beyaz olur.',
        ].join(' ')
    },
    fgopacity: {
        valType: 'number',
        editType: 'style',
        min: 0,
        max: 1,
        description: [
            'Ön plan desen dolgusunun opaklığını ayarlar.',
            '`fillmode` *overlay* olduğunda varsayılan olarak 0.5 olur.',
            'Aksi takdirde, varsayılan olarak 1 olur.'
        ].join(' ')
    },
    size: {
        valType: 'number',
        min: 0,
        dflt: 8,
        arrayOk: true,
        editType: 'style',
        description: [
            'Desen dolgusunun birim karelerinin boyutunu piksel cinsinden ayarlar,',
            'bu, desenin tekrarlama aralığına karşılık gelir.',
        ].join(' ')
    },
    solidity: {
        valType: 'number',
        min: 0,
        max: 1,
        dflt: 0.3,
        arrayOk: true,
        editType: 'style',
        description: [
            'Desen dolgusunun sağlamlığını ayarlar.',
            'Sağlamlık, desen tarafından doldurulan alanın yaklaşık olarak oranıdır.',
            '0 sağlamlığı yalnızca arka plan rengini desen olmadan gösterir',
            've 1 sağlamlığı yalnızca ön plan rengini desen olmadan gösterir.',
        ].join(' ')
    },
    editType: 'style',
    description: [
        'İşaretleyici içindeki deseni ayarlar.'
    ].join(' '),
};
