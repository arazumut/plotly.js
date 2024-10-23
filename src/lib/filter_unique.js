'use strict';

/**
 * Girdi dizisinde bulunan yalnızca benzersiz öğeleri içeren yeni bir dizi döndürür.
 *
 * ÖNEMLİ: Öğelerin `String({})` benzersiz olduğu sürece benzersiz kabul edildiğini unutmayın. Örneğin;
 *
 *  Lib.filterUnique([ { a: 1 }, { b: 2 } ])
 *
 *  [{ a: 1 }] döndürür
 *
 * ve
 *
 *  Lib.filterUnique([ '1', 1 ])
 *
 *  ['1'] döndürür
 *
 * @param {array} array temel dizi
 * @return {array} yeni filtrelenmiş dizi
 */
module.exports = function filterUnique(array) {
    var görülen = {};
    var çıktı = [];
    var j = 0;

    for(var i = 0; i < array.length; i++) {
        var öğe = array[i];

        if(görülen[öğe] !== 1) {
            görülen[öğe] = 1;
            çıktı[j++] = öğe;
        }
    }

    return çıktı;
};
