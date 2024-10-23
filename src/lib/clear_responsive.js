'use strict';

/**
 * Duyarlı (responsive) işleyicileri temizle (varsa).
 *
 * @param {DOM düğümü veya nesne} gd : grafik div nesnesi
 */
module.exports = function duyarlılığıTemizle(gd) {
    if(gd._duyarlıGrafikİşleyici) {
        window.removeEventListener('resize', gd._duyarlıGrafikİşleyici);
        delete gd._duyarlıGrafikİşleyici;
    }
};
