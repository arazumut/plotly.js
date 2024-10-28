'use strict';

// Gerekli modülleri dahil et
var filterOps = require('../../constants/filter_ops');
var isNumeric = require('fast-isnumeric');

// Bu sözdizimi mevcut filtre dönüştürme sözdizimine uygundur, ancak sadece kontur kısıtlamalarını çizmek için açık veya kapalı aralıklarla ilgilenmiyoruz:
module.exports = {
    '[]': aralıkAyarlarıYap('[]'),
    '][': aralıkAyarlarıYap(']['),
    '>': eşitsizlikAyarlarıYap('>'),
    '<': eşitsizlikAyarlarıYap('<'),
    '=': eşitsizlikAyarlarıYap('=')
};

// Bu hiçbir şekilde takvimleri desteklemez. transforms/filter.js'den uyarlanmıştır.
function değeriZorla(işlem, değer) {
    var diziDeğeriVar = Array.isArray(değer);

    var zorlanmışDeğer;

    function zorla(değer) {
        return isNumeric(değer) ? (+değer) : null;
    }

    if(filterOps.KARŞILAŞTIRMA_OPLARI2.indexOf(işlem) !== -1) {
        zorlanmışDeğer = diziDeğeriVar ? zorla(değer[0]) : zorla(değer);
    } else if(filterOps.ARALIK_OPLARI.indexOf(işlem) !== -1) {
        zorlanmışDeğer = diziDeğeriVar ?
            [zorla(değer[0]), zorla(değer[1])] :
            [zorla(değer), zorla(değer)];
    } else if(filterOps.KÜME_OPLARI.indexOf(işlem) !== -1) {
        zorlanmışDeğer = diziDeğeriVar ? değer.map(zorla) : [zorla(değer)];
    }

    return zorlanmışDeğer;
}

// Sağlanan iki değerde minimum/maksimum +/- 1 ve sıfır olacak şekilde ölçeklendirilmiş bir parabol döndürür. Veriler bu fonksiyon tarafından aralıklar oluşturulurken eşlenir, böylece konturları normal olarak oluşturmak çok kolaydır.
function aralıkAyarlarıYap(işlem) {
    return function(değer) {
        değer = değeriZorla(işlem, değer);

        // Doğru sıralamayı sağla:
        var min = Math.min(değer[0], değer[1]);
        var max = Math.max(değer[0], değer[1]);

        return {
            başlangıç: min,
            bitiş: max,
            boyut: max - min
        };
    };
}

function eşitsizlikAyarlarıYap(işlem) {
    return function(değer) {
        değer = değeriZorla(işlem, değer);

        return {
            başlangıç: değer,
            bitiş: Infinity,
            boyut: Infinity
        };
    };
}
