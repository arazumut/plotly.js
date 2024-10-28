'use strict';

var Lib = require('../../lib');

// Kontur çıkarımı harika, ancak kısıtlamalar için tamamen başarısız çünkü
// garip aralık döngülerine ve normal formattan farklı olarak ters çevrilmiş konturlara ihtiyacımız var. Bu fonksiyon,
// konturların kısıtlamalar olarak doğru şekilde çizilmesi için çıkarılan pathinfo verilerini sihirli bir şekilde
// manipüle eder.
//
// ** Yukarıdaki yorumda belirtilen "garip aralık döngüleri"nin ne olduğunu bilmiyorum.
module.exports = function(pathinfo, operation) {
    var i, pi0, pi1;

    var tersCevir = function(arr) { return arr.reverse(); };
    var ayniBirak = function(arr) { return arr; };

    switch(operation) {
        case '=':
        case '<':
            return pathinfo;
        case '>':
            if(pathinfo.length !== 1) {
                Lib.warn('Belirtilen eşitsizlik işlemi için kontur verileri geçersiz.');
            }

            // Bu durumda pathinfo'da tam olarak bir kontur seviyesi olmalıdır.
            // Tüm verileri ters çeviririz. Bu, konturu kapalı olarak çizecektir.
            pi0 = pathinfo[0];

            for(i = 0; i < pi0.edgepaths.length; i++) {
                pi0.edgepaths[i] = tersCevir(pi0.edgepaths[i]);
            }
            for(i = 0; i < pi0.paths.length; i++) {
                pi0.paths[i] = tersCevir(pi0.paths[i]);
            }
            for(i = 0; i < pi0.starts.length; i++) {
                pi0.starts[i] = tersCevir(pi0.starts[i]);
            }

            return pathinfo;
        case '][':
            var tmp = tersCevir;
            tersCevir = ayniBirak;
            ayniBirak = tmp;
            // Bu güzel bir kural, ancak burada kesinlikle *amaçlanan* şey bu.
            /* eslint-disable: no-fallthrough */
        case '[]':
            /* eslint-enable: no-fallthrough */
            if(pathinfo.length !== 2) {
                Lib.warn('Belirtilen eşitsizlik aralığı işlemi için kontur verileri geçersiz.');
            }

            // Bu durumda pathinfo'da tam olarak iki kontur seviyesi olmalıdır.
            // - Bilgileri tek bir pathinfo'ya birleştiririz.
            // - `[]` durumunda tüm verileri de ters çevirmeliyiz.
            // Bu, konturları kapalı olarak çizecektir.
            pi0 = pathinfoKopyala(pathinfo[0]);
            pi1 = pathinfoKopyala(pathinfo[1]);

            for(i = 0; i < pi0.edgepaths.length; i++) {
                pi0.edgepaths[i] = tersCevir(pi0.edgepaths[i]);
            }
            for(i = 0; i < pi0.paths.length; i++) {
                pi0.paths[i] = tersCevir(pi0.paths[i]);
            }
            for(i = 0; i < pi0.starts.length; i++) {
                pi0.starts[i] = tersCevir(pi0.starts[i]);
            }

            while(pi1.edgepaths.length) {
                pi0.edgepaths.push(ayniBirak(pi1.edgepaths.shift()));
            }
            while(pi1.paths.length) {
                pi0.paths.push(ayniBirak(pi1.paths.shift()));
            }
            while(pi1.starts.length) {
                pi0.starts.push(ayniBirak(pi1.starts.shift()));
            }

            return [pi0];
    }
};

function pathinfoKopyala(pi) {
    return Lib.extendFlat({}, pi, {
        edgepaths: Lib.extendDeep([], pi.edgepaths),
        paths: Lib.extendDeep([], pi.paths),
        starts: Lib.extendDeep([], pi.starts)
    });
}
