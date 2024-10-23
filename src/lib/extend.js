'use strict';

var isPlainObject = require('./is_plain_object.js');
var isArray = Array.isArray;

function ilkelDöngüSplice(kaynak, hedef) {
    var i, değer;
    for(i = 0; i < kaynak.length; i++) {
        değer = kaynak[i];
        if(değer !== null && typeof(değer) === 'object') {
            return false;
        }
        if(değer !== void(0)) {
            hedef[i] = değer;
        }
    }
    return true;
}

exports.düzGenişlet = function() {
    return _genişlet(arguments, false, false, false);
};

exports.derinGenişlet = function() {
    return _genişlet(arguments, true, false, false);
};

exports.derinGenişletHepsi = function() {
    return _genişlet(arguments, true, true, false);
};

exports.derinGenişletDizisiz = function() {
    return _genişlet(arguments, true, false, true);
};

/*
 * İlham kaynağı: https://github.com/justmoon/node-extend/blob/master/index.js
 * Bu harika yardımcı programı mükemmelleştiren jQuery yazarlarına tüm kredi.
 *
 * jQuery sürümü ile API farkı:
 * - İlk argüman olarak isteğe bağlı boolean (true -> derin genişletme) yok,
 *   yalnızca ilk seviye genişletme için `düzGenişlet` kullanın ve
 *   derin genişletme için `derinGenişlet` kullanın.
 *
 * jQuery sürümü ile diğer farklar:
 * - Modern (ve daha hızlı) bir isPlainObject rutini kullanır.
 * - Yalnızca {} ve [] argümanlarıyla çalışması beklenir.
 * - Dairesel yapı kontrolü yapmaz.
 *   Bilgi: jQuery yalnızca bir seviye boyunca kontrol yapar.
 *   Uyarı: bu sonsuz döngülere neden olabilir.
 *
 */
function _genişlet(girdiler, derinMi, tümAnahtarlarıKoru, diziKopyalarıYok) {
    var hedef = girdiler[0];
    var uzunluk = girdiler.length;

    var girdi, anahtar, kaynak, kopya, kopyaDiziMi, klon, tümİlkeller;

    // TODO bu, yazılmış diziler için doğru şeyi yapıyor mu?

    if(uzunluk === 2 && isArray(hedef) && isArray(girdiler[1]) && hedef.length === 0) {
        tümİlkeller = ilkelDöngüSplice(girdiler[1], hedef);

        if(tümİlkeller) {
            return hedef;
        } else {
            hedef.splice(0, hedef.length); // hedefi sıfırla ve bir sonraki bloğa devam et
        }
    }

    for(var i = 1; i < uzunluk; i++) {
        girdi = girdiler[i];

        for(anahtar in girdi) {
            kaynak = hedef[anahtar];
            kopya = girdi[anahtar];

            if(diziKopyalarıYok && isArray(kopya)) {
                // Dizi kopyalarına izin verilmiyorsa erken dur ve sadece diziyi aktar:

                hedef[anahtar] = kopya;
            } else if(derinMi && kopya && (isPlainObject(kopya) || (kopyaDiziMi = isArray(kopya)))) {
                // Düz nesneleri veya dizileri birleştiriyorsak yinele

                if(kopyaDiziMi) {
                    kopyaDiziMi = false;
                    klon = kaynak && isArray(kaynak) ? kaynak : [];
                } else {
                    klon = kaynak && isPlainObject(kaynak) ? kaynak : {};
                }

                // Orijinal nesneleri asla taşımayın, onları klonlayın
                hedef[anahtar] = _genişlet([klon, kopya], derinMi, tümAnahtarlarıKoru, diziKopyalarıYok);
            } else if(typeof kopya !== 'undefined' || tümAnahtarlarıKoru) {
                // Tanımsız değerleri getirmeyin, `derinGenişletHepsi` hariç

                hedef[anahtar] = kopya;
            }
        }
    }

    return hedef;
}
