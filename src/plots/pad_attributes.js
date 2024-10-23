'use strict';

/**
 * Bir dizi dolgu (padding) özelliği oluşturur.
 *
 * @param {object} seçenekler
 *   @param {string} düzenlemeTürü:
 *     bu dolgu tanımının tüm parçaları için düzenleme türü
 *
 * @return {object} {t, r, b, l} olarak belirtilen özellikler nesnesi
 */
module.exports = function(seçenekler) {
    var düzenlemeTürü = seçenekler.düzenlemeTürü;
    return {
        t: {
            valTipi: 'number',
            varsayılan: 0,
            düzenlemeTürü: düzenlemeTürü,
            açıklama: 'Bileşenin üst kısmındaki dolgu miktarı (px cinsinden).'
        },
        r: {
            valTipi: 'number',
            varsayılan: 0,
            düzenlemeTürü: düzenlemeTürü,
            açıklama: 'Bileşenin sağ tarafındaki dolgu miktarı (px cinsinden).'
        },
        b: {
            valTipi: 'number',
            varsayılan: 0,
            düzenlemeTürü: düzenlemeTürü,
            açıklama: 'Bileşenin alt kısmındaki dolgu miktarı (px cinsinden).'
        },
        l: {
            valTipi: 'number',
            varsayılan: 0,
            düzenlemeTürü: düzenlemeTürü,
            açıklama: 'Bileşenin sol tarafındaki dolgu miktarı (px cinsinden).'
        },
        düzenlemeTürü: düzenlemeTürü
    };
};
