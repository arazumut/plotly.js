'use strict';

/**
 * Benzersiz öğelerle diziyi doldur
 *
 * 0 hariç sahte (falsy) öğeleri yoksayar, böylece dizinler dizisi oluşturmak için kullanabiliriz.
 *
 * @param {array} dizi
 *  doldurulacak dizi
 * @param {any} öğe
 *  eklenecek veya eklenmeyecek öğe
 * @return {array}
 *  diziye referans (şimdi muhtemelen bir öğe daha içeriyor)
 *
 */
module.exports = function benzersizEkle(dizi, öğe) {
    if(öğe instanceof RegExp) {
        var öğeStr = öğe.toString();
        for(var i = 0; i < dizi.length; i++) {
            if(dizi[i] instanceof RegExp && dizi[i].toString() === öğeStr) {
                return dizi;
            }
        }
        dizi.push(öğe);
    } else if((öğe || öğe === 0) && dizi.indexOf(öğe) === -1) dizi.push(öğe);

    return dizi;
};
