'use strict';

var constants = require('./constants');

module.exports = {
    düzenlemeTürü: 'modÇubuğu',

    yönlendirme: {
        değerTürü: 'numaralandırılmış',
        değerler: ['d', 'y'],
        varsayılan: 'y',
        düzenlemeTürü: 'modÇubuğu',
        açıklama: 'Mod çubuğunun yönünü ayarlar.'
    },
    arkaplanRengi: {
        değerTürü: 'renk',
        düzenlemeTürü: 'modÇubuğu',
        açıklama: 'Mod çubuğunun arka plan rengini ayarlar.'
    },
    renk: {
        değerTürü: 'renk',
        düzenlemeTürü: 'modÇubuğu',
        açıklama: 'Mod çubuğundaki ikonların rengini ayarlar.'
    },
    aktifRenk: {
        değerTürü: 'renk',
        düzenlemeTürü: 'modÇubuğu',
        açıklama: 'Mod çubuğundaki aktif veya üzerine gelinen ikonların rengini ayarlar.'
    },
    uiRevizyon: {
        değerTürü: 'herhangi',
        düzenlemeTürü: 'yok',
        açıklama: [
            'Mod çubuğuyla ilgili kullanıcı tarafından yapılan değişikliklerin kalıcılığını kontrol eder,',
            'bu değişiklikler arasında `hovermode`, `dragmode` ve `showspikes`',
            'hem kök seviyesinde hem de alt grafiklerde bulunur. Varsayılan olarak `layout.uiRevizyon`.'
        ].join(' ')
    },
    ekle: {
        değerTürü: 'string',
        diziTamam: true,
        varsayılan: '',
        düzenlemeTürü: 'modÇubuğu',
        açıklama: [
            'Hangi önceden tanımlanmış mod çubuğu düğmelerinin ekleneceğini belirler.',
            'Lütfen bu düğmelerin yalnızca bir grafikte kullanılan tüm iz türleriyle uyumlu olduklarında gösterileceğini unutmayın.',
            '`config.modeBarButtonsToAdd` seçeneğine benzer.',
            'Bu, *' + constants.backButtons.join('*, *') + '* içerebilir.'
        ].join(' ')
    },
    çıkar: {
        değerTürü: 'string',
        diziTamam: true,
        varsayılan: '',
        düzenlemeTürü: 'modÇubuğu',
        açıklama: [
            'Hangi önceden tanımlanmış mod çubuğu düğmelerinin çıkarılacağını belirler.',
            '`config.modeBarButtonsToRemove` seçeneğine benzer.',
            'Bu, *' + constants.foreButtons.join('*, *') + '* içerebilir.'
        ].join(' ')
    }
};
