'use strict';

var isNumeric = require('fast-isnumeric');
var Lib = require('../../lib');
var constants = require('../../constants/numerical');
var BIRGUN = constants.ONEDAY;
var BIRHAFTA = constants.ONEWEEK;

/**
 * Bu eksen için doğrulanmış bir dtick değeri döndür
 *
 * @param {any} dtick: aday dtick. geçerli değerler sayılar ve stringlerdir,
 *     ve eksen türüne bağlı olarak daha fazla kısıtlanır.
 * @param {string} eksenTuru: eksen türü
 */
exports.dtick = function(dtick, eksenTuru) {
    var logEksen = eksenTuru === 'log';
    var tarihEksen = eksenTuru === 'date';
    var kategoriEksen = eksenTuru === 'category';
    var dtickVarsayilan = tarihEksen ? BIRGUN : 1;

    if(!dtick) return dtickVarsayilan;

    if(isNumeric(dtick)) {
        dtick = Number(dtick);
        if(dtick <= 0) return dtickVarsayilan;
        if(kategoriEksen) {
            // kategori dtick pozitif tam sayılar olmalıdır
            return Math.max(1, Math.round(dtick));
        }
        if(tarihEksen) {
            // tarih dtick en az 0.1ms olmalıdır (mevcut hassasiyetimiz)
            return Math.max(0.1, dtick);
        }
        return dtick;
    }

    if(typeof dtick !== 'string' || !(tarihEksen || logEksen)) {
        return dtickVarsayilan;
    }

    var prefix = dtick.charAt(0);
    var dtickNum = dtick.substr(1);
    dtickNum = isNumeric(dtickNum) ? Number(dtickNum) : 0;

    if((dtickNum <= 0) || !(
            // "M<n>" her (tam sayı) n ayda bir tik verir
            (tarihEksen && prefix === 'M' && dtickNum === Math.round(dtickNum)) ||
            // "L<f>" verilerde (konumda değil) her (float) f'de bir doğrusal olarak aralıklı tikler verir
            (logEksen && prefix === 'L') ||
            // "D1" 10'un kuvvetlerini ve aradaki tüm küçük rakamları verir, "D2" sadece 2 ve 5'i verir
            (logEksen && prefix === 'D' && (dtickNum === 1 || dtickNum === 2))
        )) {
        return dtickVarsayilan;
    }

    return dtick;
};

/**
 * Bu eksen için doğrulanmış bir tick0 değeri döndür
 *
 * @param {any} tick0: aday tick0. Geçerli değerler sayılar ve stringlerdir,
 *     eksen türüne bağlı olarak daha fazla kısıtlanır
 * @param {string} eksenTuru: eksen türü
 * @param {string} takvim: tarih eksenleri için, doğrulamak/dönüştürmek için takvim
 * @param {any} dtick: zaten geçerli bir dtick. Sadece D1 ve D2 log dtick'leri için kullanılır,
 *     bu modlar tick0'ı desteklemez.
 */
exports.tick0 = function(tick0, eksenTuru, takvim, dtick) {
    if(eksenTuru === 'date') {
        return Lib.cleanDate(tick0,
            Lib.dateTick0(takvim, (dtick % BIRHAFTA === 0) ? 1 : 0)
        );
    }
    if(dtick === 'D1' || dtick === 'D2') {
        // D1 ve D2 modları tick0'ı tamamen yok sayar
        return undefined;
    }
    // Tarih eksenleri dışında, tick0 sayısal olmalıdır
    return isNumeric(tick0) ? Number(tick0) : 0;
};
